#!/bin/bash -e

#give greengrass user access to the gpu and video system
#usermod -a -G video,spi,i2c,gpio ggc_user
groups

install -m 755 files/greengrass "${ROOTFS_DIR}/etc/init.d/"
install -m 555 files/greengrass.service "${ROOTFS_DIR}/etc/systemd/system/"
install files/98-rpi.conf "${ROOTFS_DIR}/etc/sysctl.d/"

tar Czxf ${ROOTFS_DIR} files/greengrass*.tar.gz

# Users should place the extracted keys/config into the fat32 partition.
rm -rf ${ROOTFS_DIR}/greengrass/certs \
       ${ROOTFS_DIR}/greengrass/config
mkdir -p ${ROOTFS_DIR}/boot/greengrass/certs
mkdir -p ${ROOTFS_DIR}/boot/greengrass/config

# copy root cert into /greengrass/certs
install files/root.ca.pem "${ROOTFS_DIR}/greengrass/certs/"

# turn on i2c, spi, and bump gpu memory
install -m 755 files/config.txt "${ROOTFS_DIR}/boot/"

# enable ssh
touch ${ROOTFS_DIR}/boot/ssh

# Grab samples which also has the dependencies checker utility.
if [ -d ${ROOTFS_DIR}/home/pi/aws-greengrass-samples ]; then
  cd ${ROOTFS_DIR}/home/pi/aws-greengrass-samples;
  git pull --rebase origin master
else
  git clone git://github.com/aws-samples/aws-greengrass-samples ${ROOTFS_DIR}/home/pi/aws-greengrass-samples
fi
