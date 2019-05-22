FROM node:10.15.0-alpine

WORKDIR /home/wkd

COPY . /home/wkd/

RUN yarn

ENTRYPOINT /home/wkd/entrypoint.sh
