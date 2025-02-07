## Set up project

Before start: set up PostgreSQL and Redis.

```shell
$ npm i
$ cp .env.example .env
```

After set PostgreSQL credentials and Redis host in `.env`.

```shell
$ npm run migrate:up
```
This is a test projects and migrations doesn't support rollback.

## Start project

```shell
$ npm run dev
```

