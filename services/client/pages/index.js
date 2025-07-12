// Landing page!

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
}

// Since getInitialProps stops being called automatically from anywhere else once invoked at _app.js
// we need to define it here again.
LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;