FROM node:12-alpine
WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN apk add --update --no-cache --virtual .build-deps \
      # extra-fetch
      git \
      # better-sqlite3
      build-base \
      python3 \
 && yarn install \
 && yarn cache clean \
 && apk del .build-deps

COPY . ./

RUN yarn build \
 && mkdir /data \
 && ln -s /data data

ENV MQ_HOST=0.0.0.0
ENV MQ_PORT=8080
EXPOSE 8080
ENTRYPOINT ["yarn"]
CMD ["--silent", "start"]
