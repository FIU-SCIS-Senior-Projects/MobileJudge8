#!/bin/bash

source /root/.bash_profile
sudo service apache2 stop
sudo service mysql restart
sudo service php5-fpm restart
mysqladmin -u root password root
sudo service nginx restart
sudo service redis-server start
sudo node /usr/share/nginx/html/api/index.js
while :; do
    sleep 300
done
