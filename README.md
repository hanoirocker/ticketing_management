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
