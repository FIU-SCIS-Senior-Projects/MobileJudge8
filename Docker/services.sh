#!/bin/bash

source /root/.bash_profile
sudo service mysql restart
sudo service nginx restart

while :; do
    sleep 300
done
