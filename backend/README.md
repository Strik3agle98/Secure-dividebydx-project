# Simple Express Typescript Scaffold

- Please refer to setup instruction below before running.
- run `yarn dev` to start the server (at port 3000 by default)

# 1. Setup mongodb database server

- run mongodb server on your machine (or docker)
  - for docker use command `docker run --name null-project-mongo -it -v $(pwd)/data/:/data/db -p 27017:27017 -d mongo`

# 2. set up environment

in the `.env` file

- set `MONGODB_URI` to `mongodb://127.0.0.1:27017/test`
- set `JWT_SECRET` to any random string
  - you can use `openssl rand -hex 8 # or any length` to random the string
- set `PORT` to 3000
