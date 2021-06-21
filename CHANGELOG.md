# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.4.1](https://github.com/BlackGlory/mq/compare/v0.4.0...v0.4.1) (2021-06-21)


### Features

* add /health ([916dfb4](https://github.com/BlackGlory/mq/commit/916dfb441062e6dfedccb4cb8a0d8d4944fe85f2))


### Bug Fixes

* docker build ([b1cdea6](https://github.com/BlackGlory/mq/commit/b1cdea69fb6da13c88b5043b92be2957000e6233))
* docker-compose test ([92b3f2a](https://github.com/BlackGlory/mq/commit/92b3f2a16be29d4e1a870e9897a3c8351a4d41ef))

## [0.4.0](https://github.com/BlackGlory/mq/compare/v0.3.3...v0.4.0) (2021-04-27)


### ⚠ BREAKING CHANGES

* The database schema has been upgraded.

* rename ([7e66457](https://github.com/BlackGlory/mq/commit/7e66457922ac1c3deddcaaec9733776306565d4f))

### [0.3.3](https://github.com/BlackGlory/mq/compare/v0.3.2...v0.3.3) (2021-03-27)


### Bug Fixes

* maintainQueuesEverySecond ([a2c57cd](https://github.com/BlackGlory/mq/commit/a2c57cd5db1cf3a4feef6843c66199fc76fa2f03))

### [0.3.2](https://github.com/BlackGlory/mq/compare/v0.3.1...v0.3.2) (2021-03-27)

### [0.3.1](https://github.com/BlackGlory/mq/compare/v0.3.0...v0.3.1) (2021-03-17)


### Bug Fixes

* order ([367d103](https://github.com/BlackGlory/mq/commit/367d103a25c825e7bfc23a12b00270b7c9840751))

## [0.3.0](https://github.com/BlackGlory/mq/compare/v0.2.0...v0.3.0) (2021-03-16)


### ⚠ BREAKING CHANGES

* rename `configurations` to `config` in urls

### Features

* rename `configurations` to `config` in urls ([bef3a2a](https://github.com/BlackGlory/mq/commit/bef3a2a4f1eb595d469930af6ff26a4a7a9daf0d))

## 0.2.0 (2021-03-14)


### ⚠ BREAKING CHANGES

* rename /api to /admin
* status codes changed
* complete HTTP request changed
* /stats => /metrics
* remove clearOutdatedMessages

### Features

* add failed state ([849a054](https://github.com/BlackGlory/mq/commit/849a0548ed4df71926daecad2c0ab5baace932b6))
* add fallbackOutdatedMessages ([0d61176](https://github.com/BlackGlory/mq/commit/0d61176fb0ff971c09a2af311819e664fbc18f3b))
* add indexes ([e459caa](https://github.com/BlackGlory/mq/commit/e459caa6fa5108094a1f4c44a91b634fa72e3a8e))
* add list ([9698e56](https://github.com/BlackGlory/mq/commit/9698e5656e8bd92a02d02371079789286889dc65))
* add robots.txt ([5e86906](https://github.com/BlackGlory/mq/commit/5e869064906ad8519056977992931f7c7a547a00))
* auto vacuum ([fb3cdc6](https://github.com/BlackGlory/mq/commit/fb3cdc61ee5674ee084130a8df948553861d2ae2))
* custom ajv options ([5f3a05f](https://github.com/BlackGlory/mq/commit/5f3a05f9a662ab5843caefbc46cdf413a271bf94))
* define status codes for known errors ([2e16d1f](https://github.com/BlackGlory/mq/commit/2e16d1fdf73c30eb3200e27636ef4e02b5cb9858))
* disable auto_vacuum ([5f5ce6b](https://github.com/BlackGlory/mq/commit/5f5ce6b831319007b90880bdcf6e0637aba4a0ef))
* improve maintain ([245293e](https://github.com/BlackGlory/mq/commit/245293ed57d7096c4d128787a6949a86bc3f1835))
* init ([4d476aa](https://github.com/BlackGlory/mq/commit/4d476aa69e704d58f2dea7aa509d9bd684404df2))
* maintain first ([e9b4cf0](https://github.com/BlackGlory/mq/commit/e9b4cf04ad85ac82dda5c69e55ed15a390e95dac))
* oneOf => anyOf ([02282f0](https://github.com/BlackGlory/mq/commit/02282f0e6191a66eb90796239d863365789d6e90))
* optimize indexes ([0edd2cf](https://github.com/BlackGlory/mq/commit/0edd2cfd331c691dbc2e34d3a1709010765cc9a2))
* prometheus metrics ([5cf7643](https://github.com/BlackGlory/mq/commit/5cf76437ad34593740776d68e17f2a1ca349dc09))
* remove indexes ([2757d40](https://github.com/BlackGlory/mq/commit/2757d402ffcda49c61e43da62b1369dee8c26d05))
* remove vacuum ([03ac4b5](https://github.com/BlackGlory/mq/commit/03ac4b5a55d69f0652ca5bf6d043331c4f12bb0f))
* rename /api to /admin ([ffa1824](https://github.com/BlackGlory/mq/commit/ffa1824f80fd5012ba6f3e2ad3a2009e25e4ee7c))
* rename stats to metrics ([de86935](https://github.com/BlackGlory/mq/commit/de869353d5d57690a11351f5b43ac04f096ab6e7))
* support auto maintain ([ac9ee4e](https://github.com/BlackGlory/mq/commit/ac9ee4e5d59de75c9a08f1700b683cae21d1114e))
* support concurrency ([f97cf7d](https://github.com/BlackGlory/mq/commit/f97cf7d9edf7169dffdc6409b40b8b6a356dbfe9))
* support MQ_DATA ([a290b14](https://github.com/BlackGlory/mq/commit/a290b14522a237f61c9f10147c44018af3265c18))
* support pm2 ([6a44bfe](https://github.com/BlackGlory/mq/commit/6a44bfebd8472ac57521b8dcaced5bcc61ff040d))
* support unique ([4ddff33](https://github.com/BlackGlory/mq/commit/4ddff333d8c755ae57a299e98c32a9a1e6f233d6))
* support X-MQ-Priority ([27e9447](https://github.com/BlackGlory/mq/commit/27e9447e9bbcc47157720cc231d40a181fcac240))
* update auto maintain ([8b452cd](https://github.com/BlackGlory/mq/commit/8b452cdf26420c541fc661521ae69046841bd146))


### Bug Fixes

* auto maintain ([8152411](https://github.com/BlackGlory/mq/commit/815241152e47e572eb5f28f55bf19a79af441d91))
* completeMessage ([0b25952](https://github.com/BlackGlory/mq/commit/0b25952b9d3df7021e5ec37da3425b3ec1ae7a36))
* docker ([6bd4954](https://github.com/BlackGlory/mq/commit/6bd49544b115a335887d0b8bb82dd41c498b347c))
* draft ([61bc9d6](https://github.com/BlackGlory/mq/commit/61bc9d60b95d2b3b9eb0333381edb61cb863db5b))
* examples ([37738b8](https://github.com/BlackGlory/mq/commit/37738b8be593c18a6f7acbda59388ee69b86d120))
* getAllFailedMessageIds, getAllQueueIds ([e06bc4b](https://github.com/BlackGlory/mq/commit/e06bc4b71e9e08d11802fcaaa91415a478ffaea4))
* process.on ([3c1f03e](https://github.com/BlackGlory/mq/commit/3c1f03e1d132c0629837fae9dd3c33ab31eab155))
* schema ([cb44f34](https://github.com/BlackGlory/mq/commit/cb44f34f46524d1f70e28ec66d723a2d3a5651bc))
* stats ([4c0a60f](https://github.com/BlackGlory/mq/commit/4c0a60f855c61b36a030301991dc14fa1dec4318))
* wait ([40dacc2](https://github.com/BlackGlory/mq/commit/40dacc2ee566ca255516d88bbe8429adee570375))
