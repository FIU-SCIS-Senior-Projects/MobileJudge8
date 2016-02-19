#!/bin/bash

export PATH="/home/andres/bin/Sencha/Cmd/6.0.2.14/..:$PATH"
cd MobileJudge8/client/
sencha app build production
sudo cp -rf /MobileJudge8/client/build/production/* /usr/share/nginx/html/
