/**
 * AES-256-GCM encryption for sensitive data at rest (Google tokens, API keys).
 *
 * Key: ENCRYPTION_KEY (env, 32 bytes base64-encoded).
 * Ciphertext format: base64(iv + authTag + ciphertext) — 12+16+payload bytes.
 */

// WebCrypto algorithm identifier is "AES-GCM" (key length is derived from the
// 32-byte key, giving AES-256). "AES-256-GCM" is NOT a valid WebCrypto name.
const ALGORITHM = "AES-GCM";
const IV_LEN = 12;
const TAG_LEN = 16;

async function getKey(): Promise<CryptoKey> {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) throw new Error("ENCRYPTION_KEY env var is not set");
  const keyBytes = Buffer.from(raw, "base64");
  return crypto.subtle.importKey("raw", keyBytes, { name: ALGORITHM }, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encrypt(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const encoded = new TextEncoder().encode(plaintext);
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoded,
  );
  // ciphertext = iv (12) + encrypted (ciphertext + 16-byte auth tag)
  const combined = new Uint8Array(IV_LEN + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), IV_LEN);
  return Buffer.from(combined).toString("base64");
}

export async function decrypt(ciphertextB64: string): Promise<string> {
  const key = await getKey();
  const combined = Buffer.from(ciphertextB64, "base64");
  const iv = combined.subarray(0, IV_LEN);
  const encrypted = combined.subarray(IV_LEN);
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted,
  );
  return new TextDecoder().decode(decrypted);
}
