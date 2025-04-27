import axios from "axios";

const LandingPage = (data) => {
  console.log(data);

  return <h1>Landing Page</h1>;
}

// Next JS is going to call this function during SSR process.
// This is ideal for calling functions that are going to fetch data, or others, when
// first building the page. After this, Next JS is going to rely on the component define above.
// NOTE: can't use useRequest here because it is a hook, and hooks can only be used inside components.
LandingPage.getInitialProps = async ({ req }) => {
  // NOTE: README for more informationa about this call. Important k8s and SSR concepts here!!
  // window exits only in the browser, so we can check if we are in the browser or not.
  if (typeof window === 'undefined') {
    // We are on the server here, so we still need to specify domain name with header and the cookie!
    // For the previous, we extract headers from request made by the browser,
    // to foward them into our request to the Auth API.
    const { data } = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
      headers: req.headers
    });

    return data;
  }
  else {
    // We are on the browser. This always include cookie as header!
    const { data } = await axios.get('/api/users/currentuser');
    return data;
  }
};

export default LandingPage;