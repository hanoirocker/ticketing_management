# Infra

Here lives all shared infrastructure, mostly for kubernetes objects.

### Ingress Configuration

The ingress-srv.yaml file is used to define an Ingress resource in Kubernetes, which manages external access to services within the cluster.

```bash
apiVersion: networking.k8s.io/v1 # Specifies the API version for the Ingres resource.

kind: Ingress # Defines the resource type as Ingress.

metadata:
  - name: ingress-service # The name of the Ingress resource.
  - annotations:
    - nginx.ingress.kubernetes.io/use-regex: 'true' # An annotation to enable the use of regex in path matching.

spec:
  - ingressClassName: nginx # Specifies the Ingress class to use, which is nginx in this case.
  - rules:
    - host: ticketing.dev # The domain name for which the Ingress routes traffic.
    - http:
      - paths:
        - path: /api/users/?(.*) # The path pattern to match. This example uses regex to match any path starting with /api/users/.
        - pathType: ImplementationSpecific # The type of path matching. ImplementationSpecific allows the use of custom path matching rules.
        - backend:
          - service:
            - name: auth-srv # The name of the backend service to route traffic to.
            - port:
              - number: 3000 # The port on which the backend service is listening.
```

### MongoDB:

Images comes from Docker Hub as the official hosted images.
https://hub.docker.com/_/mongo

- Port 27017 is default port for MongoDB. Not all db's have the same default port!
