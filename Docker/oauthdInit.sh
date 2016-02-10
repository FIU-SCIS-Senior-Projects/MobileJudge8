#!/bin/bash

aptitude -y install expect

INSTANCE_NAME=sr-project

SECURE_MYSQL=$(expect -c "

set timeout 10
spawn oauthd init

expect \"What will be the name of your oauthd instance?\"
send \"$INSTANCE_NAME\r\"

expect \"Do you want to install default plugins?\"
send \"Y\r\"

expect eof
")

echo "$SECURE_MYSQL"

aptitude -y purge expect
