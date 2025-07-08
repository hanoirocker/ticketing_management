# Payments

This service is meant for handling order's payments process. It needs to understand all the different orders that are created inside of our app, as well as all the changes that are made to those orders over time.
An `order:created` event is going to be emitted every time a user tries to pay for an order, so we need to understand exactly what order they are trying to pay for and also validate that payment ( meaning to validate if the user's the correct user trying to pay for that oder and also the correct amount )

<img src="./assets/payments_events_diagram.png" alt="Payments Events Diagram" width="70%">

## payments MongoDB

For the previous, we'll have to:

- Replicate data received on both `order:created` and `order:cancelled` into our own orders collection.
- Associate the `chargers` with its related order
- `payments` service will not care about the 'expiresAt' order's property since that property is already handled by the `expiration` service. Not this service's responsability. Neither will recieve the ticket.price property but only its price instead.

<img src="./assets/payments_orders_model.png" alt="Payments DB Schemas" width="70%">

## Payments Process

<img src="./assets/payments_flow_diagram.png" alt="Payments DB Schemas" width="70%">

Details about client side at https://github.com/hanoirocker/ticketing_management/blob/main/services/client/README.md

Once we finally receive the payment token we will ..

- Verify that the user is actually trying to make a payment for a valid order
- Make sure the price is correct

... and finally decide whether or not to make a request from here to the Stripe API using this token to finally charge the user.
