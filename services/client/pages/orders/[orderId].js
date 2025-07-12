import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState('');

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
  }, []);

  return (
    <div>
      <h1>Order</h1>
      <h4>Time left to pay for the order: {timeLeft}</h4>
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
}

export default OrderShow;