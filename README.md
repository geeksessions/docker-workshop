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

## Additional branches: step01 to step05

```bash
git pull

# step01 branch: Dockerize frontend/backend
git checkout step01

# step02 branch: create the initial docker-compose.yml (no live coding support)
git checkout step02

# step03 branch: wait-for script
git checkout step03

# step04 branch: live code with hot-reload
git checkout step04

# step05 branch: backend healthcheck and autoheal service
git checkout step05
```
