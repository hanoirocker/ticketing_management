import buildClient from "../api/build-client";

const LandingPage = (data) => {
  console.log(data);

  return <h1>Landing Page</h1>;
}

// Next JS is going to call this function during SSR process.
// This is ideal for calling functions that are going to fetch data, or others, when
// first building the page. After this, Next JS is going to rely on the component define above.
// NOTE: can't use useRequest here because it is a hook, and hooks can only be used inside components.
LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;