#!/bin/bash

source /root/.bash_profile
sudo service mysql restart
sudo service nginx restart
sudo node /usr/share/nginx/html/api/index.js
while :; do
    sleep 300
done
