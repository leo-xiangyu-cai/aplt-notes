import crypto from 'crypto';

export class HashingService {

  /**
   * Hashes a text using the PBKDF2 algorithm with a provided salt.
   * @param password - The password to hash.
   * @param salt - The salt to use in the hashing process.
   * @returns The hashed password.
   */
  static hashText(password: string, salt: string | null = null): string {
    const iterations = 10000; // The number of iterations, adjustable as per requirements
    const keyLength = 64; // The length of the derived key, adjustable as per requirements
    const digest = 'sha256'; // The hash algorithm used
    if (salt == null) {
      salt = process.env.TOKEN_SECRET as string;
    }
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, digest);
    return derivedKey.toString('hex'); // The format of the returned hash
  }
}
