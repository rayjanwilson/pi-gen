#!/bin/bash -e

#give greengrass user access to the gpu and video system
#usermod -a -G video,spi,i2c,gpio ggc_user

install -v -m 644 files/fstab "${ROOTFS_DIR}/etc/fstab"
install -v -m 755 files/greengrass "${ROOTFS_DIR}/etc/init.d/"
install -v -m 644 files/greengrass.service "${ROOTFS_DIR}/etc/systemd/system/"
on_chroot << EOF
systemctl enable greengrass.service
EOF

install -v files/98-rpi.conf "${ROOTFS_DIR}/etc/sysctl.d/"

echo "unpacking greengrass tarball..."
tar Czxf ${ROOTFS_DIR} files/greengrass*.tar.gz
echo "done"

# Users should place the extracted keys/config into the fat32 partition.
install -d "${ROOTFS_DIR}/boot/certs"
install -d "${ROOTFS_DIR}/boot/config"

# copy root cert into /greengrass/certs
# install -d "${ROOTFS_DIR}/greengrass/certs/"
install -D files/root.ca.pem "${ROOTFS_DIR}/greengrass/certs/"

# turn on i2c, spi, and bump gpu memory
install -m 755 files/config.txt "${ROOTFS_DIR}/boot/"
install -m 644 files/cmdline.txt "${ROOTFS_DIR}/boot/"

# enable ssh
touch "${ROOTFS_DIR}/boot/ssh"

# Grab samples which also has the dependencies checker utility.
echo "grabbing checker utility using git"
if [ -d ${ROOTFS_DIR}/home/pi/aws-greengrass-samples ]; then
  cd ${ROOTFS_DIR}/home/pi/aws-greengrass-samples;
  git pull --rebase origin master
else
  git clone git://github.com/aws-samples/aws-greengrass-samples ${ROOTFS_DIR}/home/pi/aws-greengrass-samples
fi
