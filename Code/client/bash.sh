#!/bin/bash


#rm -r /usr/share/nginx/html/classic
#rm -r /usr/share/nginx/html/modern
#rm -r /usr/share/nginx/html/resources
#rm /usr/share/nginx/html/classic.json
#rm /usr/share/nginx/html/index.html
#rm /usr/share/nginx/html/modern.json
sencha app build production
cp -r build/production/* /usr/share/nginx/html
sencha app watch
#cp -r build/production/classic /usr/share/nginx/html/
#cp -r build/production/modern /usr/share/nginx/html/
#cp -r build/production/resources /usr/share/nginx/html/
#cp build/production/classic.json /usr/share/nginx/html/
#cp build/production/index.html /usr/share/nginx/html/
#cp build/production/modern.json /usr/share/nginx/html/
