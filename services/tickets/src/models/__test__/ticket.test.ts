import { Ticket } from '../ticket';

it('Implements optismistic concurrency control', async () => {
  // Create instance of a ticket
  const ticket = Ticket.build({
    title: 'concnert',
    price: 5,
    userId: '123',
  });

  // Save the ticket to database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make once change for fetched ticket.
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save the first ticket, this should go well because this instance aims at version '0'
  await firstInstance!.save();

  // Next block is a creative way of finishing the test 'expecting' an error since
  // we couldn't make `expect()` to work expecting the error we want to recreate.
  try {
    // Save the second ticket and expect a VersionError since this instance
    // also aims at version '0' , but after previous save() the ticket document
    // has changed its version value to '1' already.
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  // If this code is reached, it means there's something wrong since code should've stopped
  // at catch!
  throw new Error('Should not reach this point');
});
