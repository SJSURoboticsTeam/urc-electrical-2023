#!/usr/bin/sh

eval $(git for-each-ref --shell \
  --format='git checkout %(objectname) && poetry run mike deploy %(refname:lstrip=2);' \
  refs/heads/)
git checkout gh-pages
