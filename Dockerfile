FROM ubuntu:16.04
MAINTAINER Ryan Lu <eating.911@gmail.com>
ENV REFRESHED_AT 2017-03-13

RUN apt-get -yqq update
RUN apt-get -yqq install nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/nodejs
RUN mkdir -p /var/log/hulkapp/hulk_service

ADD hulkapp /opt/hulkapp/hulk_service

WORKDIR /opt/hulkapp/hulk_service
RUN npm install

VOLUME ["/var/log/hulkapp/hulk_service"]

EXPOSE 7001

ENTRYPOINT ["nodejs","EGG_SERVER_ENV=prod","index.js"]


