const textEncoder = new TextEncoder();

async function getKey(secret: string): Promise<CryptoKey> {
	const keyData = textEncoder.encode(secret.padEnd(32, " "));
	return crypto.subtle.importKey("raw", keyData, { name: "AES-GCM" }, false, [
		"encrypt",
		"decrypt",
	]);
}

/**
 * @function encryptBuffer
 * @description 버퍼를 암호화합니다.
 * @param data 
 * @param keys 
 * @returns 
 */
export async function encryptBuffer(data: Uint8Array, keys: string) {
	// hash the key to get a fixed length key value
	const keyArray = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(keys));

	const key = await window.crypto.subtle.importKey("raw", keyArray, "AES-GCM", false, [
		"encrypt",
		"decrypt",
	]);

	// use web crypto api to encrypt the data
	const result = await window.crypto.subtle.encrypt(
		{
			name: "AES-GCM",
			iv: new Uint8Array(12),
		},
		key,
		data
	);

	return result;
}

/**
 * @function decryptBuffer
 * @description 버퍼를 복호화합니다.
 * @param data 
 * @param keys 
 * @returns 
 */
export async function decryptBuffer(data: Uint8Array, keys: string) {
	// hash the key to get a fixed length key value
	const keyArray = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(keys));

	const key = await window.crypto.subtle.importKey("raw", keyArray, "AES-GCM", false, [
		"encrypt",
		"decrypt",
	]);

	// use web crypto api to encrypt the data
	const result = await window.crypto.subtle.decrypt(
		{
			name: "AES-GCM",
			iv: new Uint8Array(12),
		},
		key,
		data
	);

	return result;
}
