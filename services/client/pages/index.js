// Landing page!
import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          {/* Redirect to /tickets/:ticketId page */}
          <Link className="nav-link" href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  );
}

// Since getInitialProps stops being called automatically from anywhere else once invoked at _app.js
// we need to define it here again.
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // Use client for fetching tickets service to list all created tickets
  const { data } = await client.get('/api/tickets');

  // This is going to be merged into the props to pass into the LandingPage components
  return { tickets: data };
};

export default LandingPage;