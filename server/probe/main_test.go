package main

import (
	"context"
	"net"
	"net/http"
	"net/http/httptest"
	"os"
	"syscall"
	"testing"
	"time"
)

func TestSocketIsolation(t *testing.T) {
	if os.Geteuid() != 0 {
		t.Skip("requires root with NET_ADMIN in the isolated test container")
	}
	listener, err := net.Listen("tcp4", "127.0.0.1:0")
	if err != nil {
		t.Fatal(err)
	}
	defer listener.Close()
	go func() {
		conn, err := listener.Accept()
		if err == nil {
			conn.Close()
		}
	}()
	checked := false
	dialer := net.Dialer{Control: func(network, address string, raw syscall.RawConn) error {
		if err := socketControl("lo", 0x201)(network, address, raw); err != nil {
			return err
		}
		return raw.Control(func(fd uintptr) {
			mark, err := syscall.GetsockoptInt(int(fd), syscall.SOL_SOCKET, syscall.SO_MARK)
			if err != nil || mark != 0x201 {
				t.Error("socket must carry the upstream mark")
			}
			checked = true
		})
	}}
	conn, err := dialer.Dial("tcp4", listener.Addr().String())
	if err != nil {
		t.Fatal(err)
	}
	conn.Close()
	if !checked {
		t.Fatal("socket control did not run")
	}
	dialer.Control = socketControl("au-missing", 0x201)
	if conn, err := dialer.Dial("tcp4", listener.Addr().String()); err == nil {
		conn.Close()
		t.Fatal("missing interface must not fall back to a reachable local route")
	}
}

func TestProbeChecksTLSStatusAndDeadline(t *testing.T) {
	server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/ok":
			w.WriteHeader(204)
		case "/redirect":
			http.Redirect(w, r, "/ok", http.StatusFound)
		case "/slow":
			<-r.Context().Done()
		default:
			w.WriteHeader(503)
		}
	}))
	defer server.Close()
	client := server.Client()
	client.CheckRedirect = func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	defer cancel()
	if !probe(ctx, client, server.URL+"/ok") {
		t.Fatal("successful TLS response should pass")
	}
	for _, path := range []string{"/error", "/redirect"} {
		if probe(ctx, client, server.URL+path) {
			t.Fatal("non-2xx response should fail")
		}
	}
	if probe(ctx, http.DefaultClient, server.URL+"/ok") {
		t.Fatal("untrusted certificate must fail")
	}
	short, stop := context.WithTimeout(context.Background(), 20*time.Millisecond)
	defer stop()
	if probe(short, client, server.URL+"/slow") {
		t.Fatal("deadline must fail")
	}
	if !check(ctx, client, []string{server.URL + "/error", server.URL + "/ok"}) {
		t.Fatal("one successful target should pass")
	}
	if check(ctx, client, []string{server.URL + "/error", server.URL + "/redirect"}) {
		t.Fatal("all failed targets must fail")
	}
}
