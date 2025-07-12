import 'bootstrap/dist/css/bootstrap.css';
import Header from '../components/header';
import buildClient from "../api/build-client";

// Next JS wraps the entire app in this component called 'App' wheter we
// define an _app.js file or not. So if we want to add global styles or
// functionality, we can do it here by overriding the default App function.

/**
 * @param {React.Component} Component - The component to render (index.js, or any other page)
 * @param {Object} pageProps - The components and props to pass to Component
 */
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  )
};

// Next JS is going to call this function during SSR process.
// This is ideal for calling functions that are going to fetch data, or others, when
// first building the page. After this, Next JS is going to rely on the component define above.
// NOTE: can't use useRequest here because it is a hook, and hooks can only be used inside components.
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  try {
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      // Make sure that if another component has a getInitialProps function, we call it
      // by also passing the built client and current data into it
      // This is ideal so we don't have to instantiate a client and search for user data
      // on every page's getInitialProps call.
      pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }

    return { pageProps, currentUser: data };
  } catch (err) {
    return { pageProps: null, currentUser: null };
  }
};

export default AppComponent;