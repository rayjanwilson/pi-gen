
echo "Unpacking node.js for arm7l"
curl -sL https://deb.nodesource.com/setup_10.x | bash -
apt-get update
#apt-get install -y nodejs
#tar CJxf ${ROOTFS_DIR} files/node*.tar.xz --strip-components=1
echo "done"
