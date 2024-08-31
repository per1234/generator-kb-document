#!/bin/sh
# Bump the npm package version metadata.

set \
  -o \
  errexit

if [ "$1" = "" ]; then
  echo "error: Version argument was not passed to script."
  exit 1
fi

git \
  checkout \
  main

git \
  pull

git \
  checkout \
  -b "bump-package"

npm \
  version \
  --no-git-tag-version \
  --preid "beta" \
  "$1"

git \
  add \
  package.json \
  package-lock.json

git \
  commit \
  -m "Update package version to $1"

git \
  push \
  --set-upstream origin bump-package
