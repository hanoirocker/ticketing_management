import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-requests';

const NewTicket = () => {

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  // Post request to tickets API at /tickets route for creating
  // a new ticket.
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => {
      // Redirect to the landing page after signing out
      Router.push('/');
    }
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  }

  // We won't validate string cases since our backend is going to do that for us ..
  // We'll do just the value round up
  const onBlur = () => {
    // call parseFloat so if the user enters a string we return a NaN
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    // if user entered a valid number round it to the 2nd decimal right after the user 
    // has clicked outside of the input box
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            style={{ margin: '10px 0 10px 0' }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            style={{ margin: '10px 0 10px 0' }}
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {/* Only visible if request failed */}
        {errors}
        <button
          className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  )
};

export default NewTicket;