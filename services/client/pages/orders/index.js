const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map(order => {
        return <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      })}
    </ul>
  )
};

OrderIndex.getInitialProps = async (context, client) => {
  // This will only retrieve all orders made by userId (see orders/src/routes/index.js)
  const { data } = await client.get('/api/orders');
  return { orders: data.orders }
}

export default OrderIndex;