import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-requests'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment)
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const orderExpirationTime = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(orderExpirationTime / 1000));
    };

    // Call it as soon as page loads
    findTimeLeft();
    // Then call it once per second. Also retrieve timerId for stopping the timer
    // in case the user exits the page
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    }
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div>Order expired!</div>
    )
  }

  return (
    <div>
      <h1>Order</h1>
      <h4>Time left to pay for the order: {timeLeft}</h4>
      {/* token prop is actually a callback, we'll get the stripeId from the response to
      send over payments api! */}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {/* Show errors if something went wrong when trying to purchase the order (api call into
      payments service) */}
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;