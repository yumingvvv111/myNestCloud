
FROM node:10-alpine
COPY / /app

RUN apk update && apk add --no-cache --virtual .fetch-deps \
    python2 \
    make \
    g++ \
    gcc && \
    npm install && \
    apk del .fetch-deps

RUN apk --no-cache add tzdata ca-certificates

#RUN cp -r -f /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /app


CMD [ "yarn","start" ]
