# Client App

<img src="./assets/client_project_logo.png" alt="Project Logo" width="100%">

Technologies to use: Next.js and React.

## Approaches:

Some information about different approaches considered beforehand:

- Traditional React app using create-react-app: the browser would need to make at least three requests (first for the HTML file → then to fetch the JS files to load and start the React app, and finally another request to fetch service data to render it on the client side).

- Server-side rendering approach: the browser makes a single request to our Next.js development server, which internally fetches all necessary data from our services. Once all the data is gathered, Next.js sends it back to the client — all in one single request. This is much faster, especially for mobile users.

So, we'll go with the server-side rendering approach, as it tends to fit much better for search engine optimization — particularly important for e-commerce apps like this one.

## Useful Information:

To set up routing inside a Next.js project, we need to define a set of routes inside a pages directory. Based on the folder and file names, Next.js interprets these files as distinct routes that users can visit within the app.
