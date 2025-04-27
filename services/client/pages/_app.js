import 'bootstrap/dist/css/bootstrap.css';

// Next JS wraps the entire app in this component called 'App' wheter we
// define an _app.js file or not. So if we want to add global styles or
// functionality, we can do it here by overriding the default App function.

/**
 * @param {React.Component} Component - The component to render (index.js, or any other page)
 * @param {Object} pageProps - The components and props to pass to Component
 */
export default function App({ Component, pageProps }) {
  return < Component {...pageProps} />
};