#!/bin/bash

source /root/.bash_profile
cd MobileJudge8/client/
sencha app build production
sudo cp -rf /MobileJudge8/client/build/production/* /usr/share/nginx/html/
