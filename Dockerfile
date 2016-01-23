FROM ubuntu:14.04

COPY Docker/php.ini /configFiles/
COPY Docker/mysql_secure.sh /configFiles/
COPY Docker/mime.types /configFiles/
COPY Docker/nginx.conf /configFiles/
COPY Docker/default /configFiles/
COPY Docker/services.sh /configFiles/
COPY Code/ /MobileJudge8



#mariadb

RUN sudo apt-get install software-properties-common -y
RUN sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xcbcb082a1bb943db
RUN sudo add-apt-repository 'deb [arch-amd64, i386] http://nyc2.mirrors.digitalocean.com/mariadb/repo/10.1/ubuntu trusty main'; exit 0

RUN sudo apt-get install vim -y
RUN sudo apt-get install aptitude -y

RUN sudo apt-get update
RUN sudo apt-get install -y mariadb-server

RUN sudo service mysql start && sh /configFiles/mysql_secure.sh

EXPOSE 13306
EXPOSE 3306
#phpmyadmin

RUN sudo apt-get install php5-fpm php5-mysql php5-mcrypt -y


RUN sudo php5enmod mcrypt
RUN sudo service php5-fpm restart

RUN sudo apt-get install phpmyadmin -y

#NGINX

RUN sudo apt-get install nginx -y

#link the files in nginx to the repo versions

RUN sudo ln -s /usr/share/phpmyadmin /usr/share/nginx/html

RUN sudo service apache2 stop

EXPOSE 80

RUN sudo service nginx restart
RUN sudo service nginx start

#Sencha Cmd

RUN apt-get install wget
RUN apt-get install unzip
RUN wget http://cdn.sencha.com/cmd/6.0.2/no-jre/SenchaCmd-6.0.2-linux-amd64.sh.zip -P /
RUN unzip /SenchaCmd-6.0.2-linux-amd64.sh.zip
RUN apt-get install default-jre -y
RUN sh SenchaCmd-6.0.2.14-linux-amd64.sh -q 
#alternative for sencha
#RUN apt-get install git -y

RUN sudo cp -rf /MobileJudge8/client/build/production/* /usr/share/nginx/html/


#RUN git clone https://github.com/FIU-SCIS-Senior-Projects/MobileJudge8.git /MobileJudge8
#RUN sudo cp -rf /MobileJudge8/Code/client/build/production/* /usr/share/nginx/html/

CMD ["sh", "configFiles/services.sh"]
