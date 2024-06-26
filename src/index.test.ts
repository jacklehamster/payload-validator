import { signedPayload, validatePayload } from './index';
import stringify from 'json-stable-stringify';
import jsSHA from 'jssha';

const TIMEWINDOW_PERIOD = 1000 * 42;

describe('signedPayload', () => {
    it('should add a valid signature to the payload', () => {
        const payload = { data: 'test' };
        const options = { secret: 'mysecret', timeWindow: TIMEWINDOW_PERIOD };
        const signed = signedPayload(payload, options);

        expect(signed.signature).toBeDefined();

        const json = stringify({ ...payload, signature: undefined });
        const noise = Math.floor(Date.now() / TIMEWINDOW_PERIOD);
        const expectedSignature = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' })
            .update(json)
            .update(stringify(options))
            .update(`${noise}`)
            .getHash('B64');

        expect(signed.signature).toEqual(expectedSignature);
    });

    it('should not modify the original payload', () => {
        const payload = { data: 'test' };
        const options = { secret: 'mysecret' };
        const originalPayload = { ...payload };
        signedPayload(payload, options);

        expect(payload).toEqual(originalPayload);
    });
});

describe('validatePayload', () => {
    it('should validate a payload with a correct signature', () => {
        const payload = { data: 'test' };
        const options = { secret: 'mysecret', timeWindow: TIMEWINDOW_PERIOD };
        const signed = signedPayload(payload, options);

        expect(validatePayload(signed, options)).toBe(true);
    });

    it('should invalidate a payload with an incorrect signature', () => {
        const payload = { data: 'test' };
        const options = { secret: 'mysecret', timeWindow: TIMEWINDOW_PERIOD };
        const signed = signedPayload(payload, options);
        signed.signature = 'tampered-signature';

        expect(validatePayload(signed, options)).toBe(false);
    });

    it('should invalidate a payload with a missing signature', () => {
        const payload = { data: 'test' };
        const options = { secret: 'mysecret', timeWindow: TIMEWINDOW_PERIOD };

        expect(validatePayload(payload, options)).toBe(false);
    });

    it('should invalidate a payload when the secret is incorrect', () => {
        const payload = { data: 'test' };
        const options = { secret: 'mysecret', timeWindow: TIMEWINDOW_PERIOD };
        const wrongOptions = { secret: 'wrongsecret', timeWindow: TIMEWINDOW_PERIOD };
        const signed = signedPayload(payload, options);

        expect(validatePayload(signed, wrongOptions)).toBe(false);
    });

    it('should validate a payload with a correct signature within the previous time window', () => {
        const payload = { data: 'test' };
        const options = { secret: 'mysecret', timeWindow: TIMEWINDOW_PERIOD };
        const offset = -1;
        const json = stringify({ ...payload, signature: undefined });
        const noise = Math.floor(Date.now() / TIMEWINDOW_PERIOD) + offset;
        const expectedSignature = new jsSHA('SHA-256', 'TEXT', { encoding: 'UTF8' })
            .update(json)
            .update(stringify(options))
            .update(`${noise}`)
            .getHash('B64');

        const signed = { ...payload, signature: expectedSignature };

        expect(validatePayload(signed, options)).toBe(true);
    });
});
