#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Usage: $0 IMAGE_TAG" >&2
  exit 2
fi
cd "$(dirname "$0")/.."
commit=$(git rev-parse HEAD)
commit_date=$(git show -s --format=%cI "$commit")
built_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)
git archive "$commit:server" | docker build \
  --build-arg "BUILD_COMMIT=$commit" --build-arg "BUILD_COMMIT_DATE=$commit_date" \
  --build-arg "BUILD_CREATED_AT=$built_at" -t "$1" -
