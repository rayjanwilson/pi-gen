#!/bin/bash -e

if ! id -u ggc_user >/dev/null 2>&1; then
  echo "ggc_user does not exist... making"
  adduser --disabled-password --gecos "" ggc_user
  addgroup ggc_group
  adduser ggc_user ggc_group
  for GRP in video gpio spi i2c; do
    adduser ggc_user $GRP
  done
else
  echo "ggc_user exists... skipping"
fi
