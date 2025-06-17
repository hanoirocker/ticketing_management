/**
 * Fake the real natsWrapper file for Jest to mock it on tests. For this, we need
 * to understand what we expect from the nats client. So far, we can see that the only class
 * making use of it is Publisher, so if we take a look into base-publisher code we'll see that
 * it expects the client for publishing an event later on.
 * So to sum it up, we'll need to mock the client and the publish invoke, along with
 * data and callback as well.
 */

export const natsWrapper = {
  client: {
    publish: (subject: string, data: string, callback: () => void) => {
      callback();
    },
  },
};
