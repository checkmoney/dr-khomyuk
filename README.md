# Dr. Khomyuk

Statistics calculation service

[Who?](https://en.wikipedia.org/wiki/Chernobyl_(miniseries)#Main)

## Production

### Release to Checkmoney infrastructure

1. Ensure, all code for release in `master`
2. Run `yarn release` to bump version and create git-tag
3. Run `git push --follow-tags`
4. CircleCI will build release and deliver it to production

### Release to you own infrastructure

This service has an MIT license, so you can use it for you own needs.

1. Run `docker build` for creating docker-image
2. Run docker-image: by `docker run`, `docker-compose`, `k8s` or what ever

Container accept the following env-variables:
+ Database (PostgreSQL) connection params: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
+ Queue-store (Redis) connection params: `REDIS_HOST`, `REDIS_PORT`, `REDIS_USER`, `REDIS_PASSWORD`
+ URL for other Chekmoney-services:
    + `MR_BUTCHER_URL` — for now, coupled with gateway — https://github.com/checkmoney/gateway, just add `/mr-butcher` postfix
    + `MR_SOLOMONS_URL` — https://github.com/checkmoney/mr-solomons
    + `DET_BELL_URL` — for now, coupled with gateway — https://github.com/checkmoney/gateway, just add `/det-bell` postfix

Before starting the application, you must initialize tables for application. Run inside the container next commands:
+ `yarn run evolutions -i` — create tables for database evolutions
+ `yarn run evolutions` — apply database evolutions

Now, application listen `3000` port in container, you can use it.

## Development

1. Start PostgreSQL
2. Start Redis
3. Start required Checkmoney-services (mr-butcher, mr-solomons, det-bell)
3. Copy file `.env.dist` to `.env`
4. Pass PostgreSQL connection params, Redis connection params and Checkmoney urls to `.env`
5. Run application by `yarn dev`

Now, you can find docs and playground at [localhost:3000/docs](http://localhost:3001/docs).
