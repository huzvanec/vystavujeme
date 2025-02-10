#!/bin/bash

INPUT=$(realpath "$1")
STATIC=$(realpath static)
MODELS=$(realpath src/lib/components/models)

TEMP=$(realpath "$(mktemp -d -p .)")
echo "Workdir: $TEMP"

cd "$TEMP" || exit

echo "Optimizing: $1"
pnpm dlx @threlte/gltf@latest "$INPUT" --transform --resolution 4096 --types --suspense --simplify

echo "Applying results..."
mv ./*.glb "$STATIC"
mv ./*.svelte "$MODELS"

echo "Cleaning up..."
rmdir "$TEMP"
echo "Done."