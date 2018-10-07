#!/bin/sh

adduser --disabled-password -q --gecos "" ggc_user
addgroup ggc_group
adduser ggc_user ggc_group

#give greengrass user access to the gpu and video system
usermod -a -G video,spi,i2c,gpio ggc_user

# cat <<EOF >/etc/init.d/greengrass
# #!/bin/sh
# mkdir -p /tmp/images
# chmod 777 /tmp/images
# mkdir -p /greengrass/certs
# mkdir -p /greengrass/config
# cp /boot/certs/* /greengrass/certs/
# cp /boot/config/* /greengrass/config/
# /greengrass/ggc/core/greengrassd \$@
# EOF
install -m 755 files/greengrass "${ROOTFS_DIR}/etc/init.d/greengrass"
# chmod 755 /etc/init.d/greengrass

# cat <<EOF >/etc/systemd/system/greengrass.service
# [Unit]
# Description=AWS Greengrass Service
# After=network.target
#
# [Service]
# Type=simple
# ExecStart=/etc/init.d/greengrass start
# RestartSec=2
# Restart=always
# User=root
# PIDFile=/var/run/greengrassd.pid
#
# [Install]
# WantedBy=multi-user.target
# EOF
install files/greengrass.service "${ROOTFS_DIR}/etc/systemd/system/greengrass.service"
systemctl enable greengrass.service
