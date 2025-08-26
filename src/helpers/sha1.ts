// helpers/sha1.ts
import sha1 from 'js-sha1';

export default function hashPassword(message: string): string {
  return sha1(message);
}