#!/bin/bash

echo "current directory"
ls -l
install -m 755 files/greengrass "${ROOTFS_DIR}/etc/init.d/"
install files/greengrass.service "${ROOTFS_DIR}/etc/systemd/system/"
systemctl enable greengrass.service


cat <<EOF >>${ROOTFS_DIR}/etc/sysctl.d/98-rpi.conf
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
EOF

tar Czxf ${ROOTFS_DIR} files/greengrass*.tar.gz

# Users should place the extracted keys/config into the fat32 partition.
rm -rf ${ROOTFS_DIR}/greengrass/certs \
       ${ROOTFS_DIR}/greengrass/config
mkdir -p ${ROOTFS_DIR}/boot/greengrass/certs
mkdir -p ${ROOTFS_DIR}/boot/greengrass/config

# copy root cert into /greengrass/certs
cp files/root.ca.pem ${ROOTFS_DIR}/greengrass/certs

# turn on i2c, spi, and bump gpu memory
cat <<EOF >>${ROOTFS_DIR}/boot/config.txt
dtparam=i2c_arm=on
dtparam=spi=on
start_x=1
gpu_mem=128
EOF

# enable ssh
touch ${ROOTFS_DIR}/boot/ssh

# Grab samples which also has the dependencies checker utility.
if [ -d ${ROOTFS_DIR}/home/pi/aws-greengrass-samples ]; then
  cd ${ROOTFS_DIR}/home/pi/aws-greengrass-samples;
  git pull --rebase origin master
else
  git clone git://github.com/aws-samples/aws-greengrass-samples ${ROOTFS_DIR}/home/pi/aws-greengrass-samples
fi
