#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v quarkdown >/dev/null 2>&1; then
    echo "quarkdown not found in PATH (built against 2.7.0)" >&2
    exit 1
fi

mkdir -p posts

node -e '
const data = require("./assets/js/data.js");
for (const post of data.posts || []) {
  if (!post.id || !post.source) {
    console.error("post needs id and source:", post.title || post.id || "(unnamed)");
    process.exit(1);
  }
  console.log(post.id + "\t" + post.source);
}
' | while IFS=$'\t' read -r id source; do
    echo "==> $source -> posts/$id.pdf"
    flags=(--pdf --out-name "$id" --strict)
    if [ "${CI:-}" = "true" ]; then
        flags+=(--pdf-no-sandbox)
    fi
    quarkdown compile "$source" -o posts "${flags[@]}"
done

echo "Posts built into blog/posts/."