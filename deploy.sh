#!/bin/bash
# 网站的根目录
WEB_PATH='/var/www/vue-ssr'
DEP_PATH='/var/www/deploy'
 
cd $WEB_PATH
echo "fetching from remote..."
# 为了避免冲突，强制更新本地文件
git fetch --all
git reset --hard origin/master
npm i
npm run build:mac

mv ./dist $DEP_PATH/next

cd $DEP_PATH
mv ./dist ./pre
mv ./next ./dist
rm -rf ./next/*

npm run re

echo "done"
