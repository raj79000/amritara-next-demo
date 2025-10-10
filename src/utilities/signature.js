// utilities/signature.js
export function createSignature(payload, timestamp, secret) {
    const data = JSON.stringify(payload) + timestamp;
    const encoder = new TextEncoder();
    const key = encoder?.encode(secret);
    const msg = encoder?.encode(data);

    return crypto?.subtle?.importKey(
        'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    ).then(cryptoKey =>
        crypto?.subtle?.sign('HMAC', cryptoKey, msg)
    ).then(signatureBuffer =>
        Buffer.from(signatureBuffer).toString('hex')
    );
}
