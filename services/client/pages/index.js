import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}

// Next JS is going to call this function during SSR process.
// This is ideal for calling functions that are going to fetch data, or others, when
// first building the page. After this, Next JS is going to rely on the component define above.
// NOTE: can't use useRequest here because it is a hook, and hooks can only be used inside components.
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  try {
    const { data } = await client.get('/api/users/currentuser');
    return { currentUser: data };
  } catch (err) {
    return { currentUser: null };
  }
};

export default LandingPage;