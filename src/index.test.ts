import { signedPayload, validatePayload } from './index';
import stringify from 'json-stable-stringify';
import shajs from 'sha.js';

describe('signedPayload', () => {
    it('should add a valid signature to the payload', () => {
        const payload = { data: 'test' };
        const secret = 'mysecret';
        const signed = signedPayload(payload, secret);

        expect(signed.signature).toBeDefined();
        const expectedSignature = shajs('sha256')
            .update(stringify({...payload, signature: undefined}))
            .update(secret)
            .digest('base64url');
        expect(signed.signature).toEqual(expectedSignature);
    });

    it('should not modify the original payload', () => {
        const payload = { data: 'test' };
        const secret = 'mysecret';
        const originalPayload = { ...payload };
        signedPayload(payload, secret);

        expect(payload).toEqual(originalPayload);
    });
});

describe('validatePayload', () => {
    it('should validate a payload with a correct signature', () => {
        const payload = { data: 'test' };
        const secret = 'mysecret';
        const signed = signedPayload(payload, secret);

        expect(validatePayload(signed, secret)).toBe(true);
    });

    it('should invalidate a payload with an incorrect signature', () => {
        const payload = { data: 'test' };
        const secret = 'mysecret';
        const signed = signedPayload(payload, secret);
        signed.signature = 'tampered-signature';

        expect(validatePayload(signed, secret)).toBe(false);
    });

    it('should invalidate a payload with a missing signature', () => {
        const payload = { data: 'test' };
        const secret = 'mysecret';

        expect(validatePayload(payload, secret)).toBe(false);
    });

    it('should invalidate a payload when the secret is incorrect', () => {
        const payload = { data: 'test' };
        const secret = 'mysecret';
        const wrongSecret = 'wrongsecret';
        const signed = signedPayload(payload, secret);

        expect(validatePayload(signed, wrongSecret)).toBe(false);
    });
});
