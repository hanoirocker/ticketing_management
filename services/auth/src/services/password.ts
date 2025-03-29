import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt the hashing function to use, but is 'callback' based implemented,
// so we make it 'promise' based implemented by using promisify.
const scryptAsync = promisify(scrypt);

// Specific class for making use of password hashing and comparing

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    // Separate hashed password from salt, both joined before storing.
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    // Compare the suppliedPassword hashed version against the storedPassword
    return buf.toString('hex') === hashedPassword;
  }
}
