#!/usr/bin/env bash

set -e

# Extract the version and append -dev.<commit_hash> to it - format like `1.2.0-dev.9fd2c7c`
DEV=$(jq -r ".version" package.json | awk -F "-" '{print $1}')-dev.$(git rev-parse --short HEAD)

# Replace the version with the prepared dev version.
cat <<< "$(jq --arg DEV "$DEV" ".version = \"$DEV\"" package.json)" > package.json

# Add a `dev` NPM tag/channel.
cat <<< "$(jq ".publishConfig.tag = \"dev\"" package.json)" > package.json

# Change the name of the package,
# in order to publish it to NPM using different account without the access to the @nomiclabs/hardhat-waffle package
cat <<< "$(jq ".name = \"hardhat-waffle-dev\"" package.json)" > package.json
