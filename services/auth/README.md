<h1><b style="font-size: 4rem; letter-spacing: 0.2rem; color:rgb(156, 158, 93)">Auth microservice</b></h1>

## Auth

Made for validating all user's actions on the ticketing macro project.
Also, this service will handle errors produced during this requests with an error Handler defined inside of this project so the client receives a detailed and properly structured error message.

### Routes:

<img src="./assets/auth_routes.png" alt="Auth Routes" width="100%">

### Errors structure:

This structure is defined as an object that wrapps the 'errors' list. This last is a list of different objects and for each one of them we define a message and a field that relates the message with the property that was validated.

<img src="./assets/auth_errors_structure.png" alt="Auth Errors Structure" width="80%">

### Auth MongoDB:

Using Mongoose to create databse entries into our MongoDB instance running inside of our k8s cluster.
For more information on MongoDB instance: `<ticketing_infra_auth_mongo_depl_yaml_url>`

<img src="./assets/auth_database_structure.png" alt="Auth Errors Structure" width="100%">

We'll create a `Mongoose User Model` (which will represent the entire colleciton of users) for running queries from our Auth pod straight into our MongoDB pod to be able to verify different case scnearios:

<img src="./assets/auth_mongo_verification.png" alt="Auth Mongo Verification" width="90%">

Also, we will define a `Mongoose User Document` that'll represent one single user inside of the User Collection structure.

Note: TypeScript and Mongoose are not best friends. There'll be two main problems to address on this:

- Define types for creating a new user such as email and password, to prevent typos which TS by default won't prevent us from.
- After creating a new user there will be a lot more properties out of our new user instance, so we'll limit them.

<img src="./assets/auth_mongo_structures.png" alt="Auth Mongo Verification" width="90%">
