#!/usr/bin/env bash

# Will append a "-dev.commithash" suffix to version,
# and change NPM release channel to "dev".
# Used to auto-publish dev version from main branch.

set -e
DEV=$(jq -r ".version" package.json | awk -F "-" '{print $1}')-dev.$(git rev-parse --short HEAD)
cat <<< "$(jq --arg DEV "$DEV" ".version = \"$DEV\"" package.json)" > package.json
cat <<< "$(jq ".publishConfig.tag = \"dev\"" package.json)" > package.json
