# Secure-dividebydx-project

Computer Security project

This is a facebook like platform where people can post and comment

There are two roles, admin, user:

- admin can edit/delete any people comments/posts
- user can only edit/delete their own posts

## How to run

This project require docker to run (else you need to setup environment manually)

To run project, simply run in the root of the project

`docker-compose up -d`

it will pull images of frontend and backend from Docker Hub

if you prefer to build it yourself, comment out the `image:` and uncomment `build:` part of `frontend` and `backend` service

```
image: rod41732/secure-project-frontend
### if you prefer to build yourself
# build:
#   context: frontend
```
