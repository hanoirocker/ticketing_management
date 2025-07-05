import Queue from 'bull';

// interface to described the job information
interface Payload {
  orderId: string;
}

// Just call the new order instance and add options for letting this instance
// know that it has to connect to the Redis Server.
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST, // at infra/expiration-depl.yaml
  },
});

// 'job' it's a wrapper of the data to be sent along into Rendis, not the job object itself
expirationQueue.process(async (job) => {
  // TODO: replace with proper implementation in the future
  console.log(
    'I want to publish an expiration:complete event for orderId',
    job.data.orderId
  );
});

export { expirationQueue };
