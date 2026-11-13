#!/usr/bin/env bash
set -euo pipefail

PROOF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROOF_IMAGE="${1:-awg-chain-easy:upstream-priority-test}"
PROOF_ENTRYPOINT="${2:-/proof/proof.js}"
PROOF_PKI="$(mktemp -d /tmp/awg-namespace-proof-pki.XXXXXX)"
PROOF_NAME="awg-namespace-proof-$(date -u +%Y%m%dT%H%M%SZ)-$$"
PROOF_CREATED=0

cleanup() {
  if [[ "$PROOF_CREATED" == 1 ]]; then
    docker rm -f "$PROOF_NAME" >/dev/null 2>&1 || true
  fi
  rm -rf -- "$PROOF_PKI"
}
trap cleanup EXIT
umask 077
openssl req -x509 -newkey rsa:2048 -nodes -days 1 \
  -subj /CN=health.test -addext subjectAltName=DNS:health.test \
  -keyout "$PROOF_PKI/key.pem" -out "$PROOF_PKI/cert.pem" >/dev/null 2>&1

docker create --name "$PROOF_NAME" --label awg-chain-easy.test=namespace-proof \
  --network none --cap-add NET_ADMIN --cap-add SYS_ADMIN --device /dev/net/tun \
  --sysctl net.ipv4.ip_forward=1 --sysctl net.ipv4.conf.all.rp_filter=0 \
  --mount "type=bind,src=$PROOF_DIR,dst=/proof,readonly" \
  --mount "type=bind,src=$PROOF_DIR/..,dst=/tests,readonly" \
  --mount "type=bind,src=$PROOF_PKI,dst=/proof-pki,readonly" \
  --env SSL_CERT_FILE=/proof-pki/cert.pem --env GOMAXPROCS=2 \
  --entrypoint node "$PROOF_IMAGE" "$PROOF_ENTRYPOINT" >/dev/null
PROOF_CREATED=1
docker start "$PROOF_NAME" >/dev/null
docker inspect --format 'Proof container: {{.Name}}; host PID: {{.State.Pid}}; started: {{.State.StartedAt}}; command: {{.Path}} {{join .Args " "}}; network: {{.HostConfig.NetworkMode}}; published ports: {{json .HostConfig.PortBindings}}' "$PROOF_NAME"
docker logs --follow "$PROOF_NAME"
PROOF_EXIT="$(docker wait "$PROOF_NAME")"
docker rm "$PROOF_NAME" >/dev/null
PROOF_CREATED=0
if docker inspect "$PROOF_NAME" >/dev/null 2>&1; then
  echo 'Proof container cleanup failed' >&2
  exit 1
fi
echo 'Proof container removed; no host ports were published.'
exit "$PROOF_EXIT"
