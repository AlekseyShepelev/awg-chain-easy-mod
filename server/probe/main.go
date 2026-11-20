// The health probe binds every HTTPS and DNS socket to one upstream and its
// routing mark. A missing route must never make a probe use the host uplink.
package main

import (
	"context"
	"flag"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"syscall"
	"time"
)

func socketControl(device string, mark int) func(string, string, syscall.RawConn) error {
	return func(_, _ string, raw syscall.RawConn) error {
		var socketErr error
		err := raw.Control(func(fd uintptr) {
			socketErr = syscall.SetsockoptString(int(fd), syscall.SOL_SOCKET, syscall.SO_BINDTODEVICE, device)
			if socketErr == nil {
				socketErr = syscall.SetsockoptInt(int(fd), syscall.SOL_SOCKET, syscall.SO_MARK, mark)
			}
		})
		if err != nil {
			return err
		}
		return socketErr
	}
}

func probe(ctx context.Context, client *http.Client, target string) bool {
	u, err := url.Parse(target)
	if err != nil || u.Scheme != "https" || u.Hostname() == "" || u.User != nil || u.Fragment != "" {
		return false
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, target, nil)
	if err != nil {
		return false
	}
	req.Header.Set("User-Agent", "AWG-Chain-Easy-health/1")
	response, err := client.Do(req)
	if err != nil {
		return false
	}
	defer response.Body.Close()
	return response.StatusCode >= 200 && response.StatusCode < 300
}

func check(ctx context.Context, client *http.Client, targets []string) bool {
	deadline, bounded := ctx.Deadline()
	for i, target := range targets {
		if ctx.Err() != nil {
			return false
		}
		attempt := ctx
		cancel := func() {}
		if remaining := len(targets) - i; bounded && remaining > 1 {
			// Give each fallback a share of the deadline if an earlier target hangs.
			attempt, cancel = context.WithTimeout(ctx, time.Until(deadline)/time.Duration(remaining))
		}
		success := probe(attempt, client, target)
		cancel()
		if success {
			return true
		}
	}
	return false
}

func main() {
	device := flag.String("interface", "", "Upstream interface")
	markText := flag.String("mark", "", "Upstream routing mark")
	dns := flag.String("dns", "1.1.1.1", "IPv4 DNS resolver")
	timeout := flag.Duration("timeout", 5*time.Second, "Total probe deadline")
	flag.Parse()
	mark, err := strconv.ParseUint(*markText, 0, 32)
	if err != nil || mark == 0 || !strings.HasPrefix(*device, "au") || len(*device) > 15 || net.ParseIP(*dns).To4() == nil || *timeout <= 0 || flag.NArg() < 1 || flag.NArg() > 3 {
		fmt.Fprintln(os.Stderr, "Invalid health probe arguments")
		os.Exit(2)
	}
	control := socketControl(*device, int(mark))
	resolver := &net.Resolver{PreferGo: true, Dial: func(ctx context.Context, network, _ string) (net.Conn, error) {
		d := net.Dialer{Control: control}
		if strings.HasPrefix(network, "tcp") {
			network = "tcp4"
		} else {
			network = "udp4"
		}
		return d.DialContext(ctx, network, net.JoinHostPort(*dns, "53"))
	}}
	dialer := &net.Dialer{Control: control, Resolver: resolver}
	transport := &http.Transport{DisableKeepAlives: true, DialContext: func(ctx context.Context, _, address string) (net.Conn, error) {
		return dialer.DialContext(ctx, "tcp4", address)
	}}
	defer transport.CloseIdleConnections()
	client := &http.Client{Transport: transport, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}
	ctx, cancel := context.WithTimeout(context.Background(), *timeout)
	defer cancel()
	if !check(ctx, client, flag.Args()) {
		os.Exit(1)
	}
}
