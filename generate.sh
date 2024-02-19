#!/usr/bin/bash

set -e
eval $(git for-each-ref --shell \
  --format='git checkout %(objectname) && poetry run mike deploy %(refname:lstrip=2);' \
  refs/heads/)
poetry run mike set-default main
git checkout gh-pages