#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: $0 IMAGE_TAG" >&2
  exit 2
fi
cd "$(dirname "$0")/.."
commit=$(git rev-parse HEAD)
git archive "$commit:server" | docker build --build-arg "BUILD_COMMIT=$commit" -t "$1" -
