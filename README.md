# Docker workshop

Development of a fullstack web-application using React, Node.js (Express+Mongoose), MongoDB using docker and docker-compose.

The goal of this workshop is to dockerize an web-application with all of it's existing components (Frontend, Backend, Database) and make it easy to run a local  `DEVELOPMENT` environment using `docker-compose`.

Please note that in the `master` branch you fill find the web-application base source code and each branch will introduce a new step toward our goal (with the presented challenge to solve and solution, or one possible path to solve it).

## Master branch

In the master branch you will find the web-application source code, to launch it locally without docker please follow the instructions:

1) Launch MongoDB database locally (either the host installed mongod OR if you prefer using docker)

    ```bash
    docker run --rm \
        --name mongodb \
        -p 27017:27017 \
        -v "$PWD/database/data/db:/data/db" \
        -e MONGO_DATA_DIR="/data/db" \
        -e MONGO_LOG_DIR="/dev/null" \
        mongo:latest --noauth --bind_ip=0.0.0.0
    ```

2) Install backend dependencies and launch backend api

    ```bash
        # from repository root path
        cd backend/sourcecode
        npm i
        # npm start ## start node without nodemon hot-reload functionality
        npm run start:dev
        # test api response
        curl http://localhost:3001/api/healthcheck
    ```

3) Install frontend dependencies and launch

    ```bash
        # from repository root path
        cd frontend
        npm i
        npm start
        # open browser http://localhost:3000
        open http://localhost:3000
    ```

## step01 branch: Dockerize frontend/backend

First initial step to dockerize both FE/BE applications is to create the respective `Dockerfile` in each folder.
In order to maintain our docker images compact, we will use an alpine node.js docker container as a base.

Respective `Dockerfile` can be found in this branch, open both to review what it's doing, build and run the containers manually to make sure all is working as expected.

* Launch MongoDB database locally

    ```bash
    docker run --rm \
        --name mongodb \
        -p 27017:27017 \
        -v "$PWD/database/data/db:/data/db" \
        -e MONGO_DATA_DIR="/data/db" \
        -e MONGO_LOG_DIR="/dev/null" \
        mongo:latest --noauth --bind_ip=0.0.0.0
    ```

* Get your host IP address, use it when running the gsbackend container

```bash
(ipconfig getifaddr en0 2>/dev/null; ifconfig 2>/dev/null | grep -v "127.0.0.1" | grep -oP '(?<=inet\saddr:)\d+(\.\d+){3}';)
```

* Build and run the backend docker container

```bash
    # from repository root path
    cd backend
    docker build -t gsbackend:latest .
    docker run --rm --name local-gsbackend -p 3001:3001 --env DATABASE="mongodb://192.168.1.80:27017/gsworkshop?retryWrites=true" gsbackend:latest
    # test api
    curl http://localhost:3001/api/counter
    curl -X POST -H "Content-Type: application/json" -d '{"value":10}' http://localhost:3001/api/counter
```

* Build and run the frontend docker container

```bash
    # from repository root path
    cd frontend
    # edit ./sourcecode/package.json, proxy property should point to the host IP address
    ## "proxy": "http://192.168.1.80:3001",
    docker build -t gsfrontend:latest .
    docker run --rm --name local-gsfrontend -p 3000:3000 gsfrontend:latest
    open http://localhost:3000
```

Re-using the same base docker image `FROM mhart/alpine-node:8` is one of the key points of docker, image is already cached in your system, only additional file layers of the final image will be created, you also take the advantaged of a common base, if you need to fix something in one container it will be simple to reuse the same recipe, and we are already saving a lot of space using a slim version of node.js with alpine!

Please note, we are still running the docker containers isolated from each other, just to check if the Dockerfiles are correct. At this point we are not connecting the containers internally, and it was required to make some hacks to get it to work, but none of this will be required, docker-compose services will make all this pretty simple!

## step02 branch: create the initial docker-compose.yml (no live coding support)

Second step will focus on the `docker-compose.yml` initial version. File is already available in the repository, make sure you review the changes and compare with previous manual instructions, you will find it simpler and pretty descriptive, no more complex commands to run!

```bash
docker-compose build
docker-compose up -d
docker-compose ps
docker-compose logs -f
open http://localhost:3000
docker-compose down
```

NOTES:

* mongodb fixed version to avoid migration issues (avoid using latest tag to containers that you do not control)
* frontend package.json proxy update, will resolve docker container ip from service name
* backend .env file update, will resolve docker container ip from service name
* backend service fails to communicate during the initial period due to mongodb container start time

## step03 branch: wait-for script

For the next step we will tweak backend service, wait for the mongodb service to be ready and fully functional, meaning that we will use docker-compose `depends
_on` functionality and since this will not completely solve our issue and additional wait-for script will be added to the backend service, forcing the container to wait until mongodb is up and totally functional.

Source:

* https://github.com/eficode/wait-for
* https://dev.to/hugodias/wait-for-mongodb-to-start-on-docker-3h8b

Using EntryPoint option:

* https://success.docker.com/article/use-a-script-to-initialize-stateful-container-data

```bash
docker-compose down
docker-compose build
docker-compose up
open http://localhost:3000
docker-compose down
```
