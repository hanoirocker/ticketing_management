/**
 * Fake the real stripe. We'll use `mockResolvedValue` to get back a promise that automatically
 * resolves with an empty object. This is because on 'strip.charge.create' we're indeed
 * waiting on a promise (await).
 */

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};
