
echo "Unpacking node.js for arm7l"
on_chroot << EOF
curl -sL https://deb.nodesource.com/setup_10.x | bash -
EOF
#apt-get install -y nodejs
#tar CJxf ${ROOTFS_DIR} files/node*.tar.xz --strip-components=1
echo "done"
