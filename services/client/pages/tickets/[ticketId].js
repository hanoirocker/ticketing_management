import useRequest from '../../hooks/use-requests'

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders/',
    method: 'post',
    body: { ticketId: ticket.id },
    onSuccess: (order) => { console.log('order created: ', order) }
  });

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {/* Show only if there was something wrong with the order creation request */}
      {errors}
      <button
        onClick={doRequest}
        className="btn btn-primary">
        Purchase
      </button>
    </div>
  )
};

// Remember that _app.js will execute getInitialProps from child components first!
TicketShow.getInitialProps = async (context, client) => {
  // Pull the ticketId from the page query param. 'ticketId' since that's the name
  // of the wildcard [ticketId].js
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
}

export default TicketShow;