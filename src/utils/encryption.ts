import crypto from 'crypto';
const ALGORITHM = 'aes-256-gcm'; const IV_LENGTH = 16; const SALT_LENGTH = 64; const TAG_LENGTH = 16; const KEY_LENGTH = 32;
export function encrypt(text: string, secretKey: string): string {
  const iv = crypto.randomBytes(IV_LENGTH); const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.pbkdf2Sync(secretKey, salt, 100000, KEY_LENGTH, 'sha512');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}
export function decrypt(encryptedText: string, secretKey: string): string {
  const data = Buffer.from(encryptedText, 'base64');
  const salt = data.subarray(0, SALT_LENGTH); const iv = data.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const tag = data.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const encrypted = data.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
  const key = crypto.pbkdf2Sync(secretKey, salt, 100000, KEY_LENGTH, 'sha512');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}
export function generateHMAC(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}
export function verifyHMAC(data: string, signature: string, secret: string): boolean {
  const expected = generateHMAC(data, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}