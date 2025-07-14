import axios from "axios";

/**
 * buildClient doens't make any requests, it just creates an axios instance that can be used to make requests.
 * It checks if the code is running on the server or in the browser and sets the base URL accordingly.
 * If running on the server, it uses the base URL of the ingress controller in the Kubernetes cluster.
 * If running in the browser, it uses the base URL of the current domain.
 * NOTE: if we ever deploy our ticketing app into a cloud provider cluster and buy a real domain name
 * we would need to change the baseURL into whaterver we bought.
 * buildCliente recieves the context object as an argument, which contains the request object (req).
 * ------- MORE DATA ABOUT SSR/CLIENT calls AT Client's REAMDME.md -------
 */
export default function buildClient({ req }) {
  if (typeof window === 'undefined') {
    // We are on the server.
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });

    // TODO-IF-DEPLOY: change into this structure ponting at real domain name.
    // e.g: baseURL: 'http://www.ticketing-app-prod.xyz/'

    // return axios.create({
    //   baseURL: 'Whatever_your_purchased_domain_is',
    //   headers: req.headers,
    // });
  }
  else {
    // We are on the browser. This always include request headers!
    return axios.create({
      baseURL: '/',
    });
  }
};