<h1><b style="font-size: 4rem; letter-spacing: 0.2rem; color: #5D759E">Ticketing Management time!</b></h1>

## Description

This project is meant to demostrate how a simple application such as this one can be modularized / devided into separted microservices, and how to solve data sharing between all of them.
We're relying on the promise of async commmunication between all of these microservices to ensure
independece between them. This way, we can trust our app to be functional even when one or more of these services go down.
By taking this async approach of course we'll have to handle data between services in a more complex and efficient way.

For this specific version we'll be using Kubernetes to create each cluster and manage pods, deployments, services, etc .. and pointing at docker engine on local. This orquestration could also be approached as an alternative for lower performance hardware users by building all of these clusters on some cloud provider.

## Schemas

<img src="./assets/project_schema_1.png" alt="Project Schema 1" width="70%">

## Local dev setup

## Infra

### Ingress

Ingress paths will always check for matching incomming requests with paths defined on vertical order from up to down. Said this, we need to make sure that all specificp paths are listed first, and let the more general paths into the end. For example, `/?(.*)` which is for ALL paths (used on Client app) should be listed at the button, below specific paths for example used by the Auth app such as `/api/users/?(.*)`

## Skaffold:

## Common steps for each service creation:

- 1. Create folder + `.gitignore` + `README.md` + `tsconfig.json` + `.dockerignore` + `Dockerfile` + `package.json` + create /src folder with `index.ts` file. This step can be also achieved by copying those files from any other service like `tickets` and modifying some basic service naming values and imports.
- 2. Modify `skaffold.yaml` to sync changes made on new service folder.
- 3. Install dependencies used at `package.json` by running `npm install`. If any other specific dependency is needed install it by using same command + the name of the dependency and also its types definition (e.g `npm install bull @types/bull`). Please double check for the correct types dependency naming at https://www.npmjs.com/
- 4. Create the docker image by running `docker build -t <YOUR_DOCKER_USER>/<SERVICE_NAME> .`
- 5. Push your docker image into docker hub by running `docker push <YOUR_DOCKER_USER>/<SERVICE_NAME>`
- 6. Create k8s deployment file/s at `infra` dir (e.g `<SERVICE_NAME>-depl.yaml`). Follow other's services files structure as a guide for the new one. Take into account what this new service needs to run properly in coordination with other services (Cluster IP, Ingress configuration, Mongoose deployment, etc).

<img src="./assets/project_services_steps.png" alt="Project Services Steps" width="100%">
