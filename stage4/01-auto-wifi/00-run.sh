on_chroot << EOF
apt-get purge dns-root-data
EOF

install -v -m 644 files/hostapd/hostapd.conf "${ROOTFS_DIR}/etc/hostapd/"
install -v -m 644 files/hostapd/hostapd "${ROOTFS_DIR}/etc/default/"
install -v -m 644 files/dnsmasq/dnsmasq.conf "${ROOTFS_DIR}/etc/"
install -v -m 664 files/dhcpcd.conf "${ROOTFS_DIR}/etc/"
