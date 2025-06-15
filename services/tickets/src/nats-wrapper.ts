import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // '?' means _client can be undefined for a period of time. This is needed
  // since we're creating the instance of nats (stan) once connected, not at the constructor
  // itself.
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting!');
    }

    return this._client;
  }

  /**
   * clusterId: value from infra nats-delp.yaml args '-cid'
   * clientId: random value
   * url: based service that governs our infra nats-depl.yaml deployment, on specified port
   * */
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      // once connected, run callback
      this.client.on('connect', () => {
        console.log('Connected to NATSss');
        resolve();
      });
      this.client.on('error', (err) => {
        console.log('');
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
