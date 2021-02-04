FROM node:12-alpine
WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

# better-sqlite3 build deps
RUN apk add --update --no-cache --virtual .build-deps \
      build-base \
      python3 \
 && npm install -g pnpm \
 && pnpm install \
 && pnpm store prune \
 && apk del .build-deps

COPY . ./

RUN pnpm build \
 && mkdir /data \
 && ln -s /data data

ENV MQ_HOST=0.0.0.0
ENV MQ_PORT=8080
EXPOSE 8080
ENTRYPOINT ["pnpm"]
CMD ["--silent", "start"]
