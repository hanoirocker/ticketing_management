# Payments

This service is meant for handling order's payments process. It needs to understand all the different orders that are created inside of our app, as well as all the changes that are made to those orders over time.
An `order:created` event is going to be emitted every time a user tries to pay for an order, so we need to understand exactly what order they are trying to pay for and also validate that payment ( meaning to validate if the user's the correct user trying to pay for that oder and also the correct amount )

<img src="./assets/payments_events_diagram.png" alt="Payments Events Diagram" width="70%">

## Payments MongoDB

For the previous, we'll have to:

- Replicate data received on both `order:created` and `order:cancelled` into our own orders collection.
- Associate a new `payments` document with its related order
- `payments` service will not care about the 'expiresAt' order's property since that property is already handled by the `expiration` service. Not this service's responsability. Neither will recieve the ticket.price property but only its price instead.

<img src="./assets/payments_orders_model.png" alt="Payments Oders Model" width="70%">

- Also, we'll create a payments collection for keeping track of all of the charges applied during time. This will be created once `stripe.charges.create` is called. Every payment document will store both the `oderId` and its related `stripId`.

## Payments Process

<img src="./assets/payments_flow_diagram.png" alt="Payments flow Diagram" width="70%">

Details about client side at https://github.com/hanoirocker/ticketing_management/blob/main/services/client/README.md

Once we finally receive the payment token we will perfom the following actions:

<img src="./assets/payments_handler_diagram.png" alt="Payments Handler Diagram" width="100%">

- On 'Verify payment with Stripe API' we'll use the Node Stripe SDK to easily communicate with the Stripe API, providing the auth token as a source parameter and using the API secret to instantiate a stripe client. So, we'll firstly need to install this dependency and also sign up on Stripe to get this API secret for useing it into our service.

IMPORTANT NOTES:

- the secret key provided by Stripe will be stored in a k8s secret object. To create this object, we need to run `kubectl create secret generic stripe-secret --from-literal=<KEY_HERE=<STRING_VALUE_HERE>`
  To see all secrets created, we can run `kubectl get secrets`
- since we won't be able to actually use real tokens as source for these payments, we'll mock this by using a very specific token for this testing stage (`"token": "tok_visa"`). This value will ALWAYS succeed the payment process.
- Since test suites runs out the k8s cluster if we wanted to call Stripe API from our test files such as new.test.ts for `new` route, we'd need to acecss this env key directly from our test file before the beforeAll call. This is currently NOT BEING IMPLEMENTED.

More information about Stripe at:

https://stripe.com/docs/api

https://stripe.com/docs/api/charges/create

- On 'Create charge record to record successful payment' we'll store this data into our `payments` database
