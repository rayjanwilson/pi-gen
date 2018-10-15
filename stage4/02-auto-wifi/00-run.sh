on_chroot << EOF
apt-get purge dns-root-data
EOF

install -v -m 644 files/hostapd/hostapd.conf "${ROOTFS_DIR}/etc/hostapd/"
install -v -m 644 files/hostapd/hostapd "${ROOTFS_DIR}/etc/default/"
install -v -m 644 files/dnsmasq/dnsmasq.conf "${ROOTFS_DIR}/etc/"
install -v -m 664 files/dhcpd/dhcpcd.conf "${ROOTFS_DIR}/etc/"
install -v -m 644 files/autohotspot/autohotspot.service "${ROOTFS_DIR}/etc/systemd/system/"
install -v -m 755 files/autohotspot/autohotspot.sh "${ROOTFS_DIR}/usr/bin/"

install -v -m 644 files/nodeserver/nodeserver.service "${ROOTFS_DIR}/etc/systemd/system/"
mkdir -p "${ROOTFS_DIR}/var/www"
install -v -m 755 files/nodeserver/app.js "${ROOTFS_DIR}/var/www/"

on_chroot << EOF
systemctl enable autohotspot.service
EOF
