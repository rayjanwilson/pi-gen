#!/bin/sh

adduser --disabled-password -q --gecos "" ggc_user
addgroup ggc_group
adduser ggc_user ggc_group

#give greengrass user access to the gpu and video system
#usermod -a -G video,spi,i2c,gpio ggc_user

install -m 755 files/greengrass "${ROOTFS_DIR}/etc/init.d/"

install files/greengrass.service "${ROOTFS_DIR}/etc/systemd/system/"
systemctl enable greengrass.service
