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

## Skaffold:
