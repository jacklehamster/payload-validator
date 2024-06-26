import stringify from "json-stable-stringify";
import jsSHA from "jssha";

const TIMEWINDOW_PERIOD = 1000 * 42; // Time window changes every 42 seconds.

type SignedPayload = any & {
  signature?: string;
}

interface Options {
  [key: string]: any;
  timeWindow?: number;
  noTimeWindow?: boolean;
}

/**
 * Generates a signature for the given payload using the specified options and offset.
 * @param payload - The payload to be signed.
 * @param options - The options for generating the signature, including secret, timeWindow, and noTimeWindow.
 * @param offset - The offset to be applied to the time window for signature generation.
 * @returns The generated signature as a Base64 string.
 */
function getPayloadSignature(payload: SignedPayload, options: Options, offset: number = 0): string {
  const json = stringify({ ...payload, signature: undefined });
  const noise = options.noTimeWindow ? 0 : Math.floor(Date.now() / (options.timeWindow ?? TIMEWINDOW_PERIOD)) + offset;
  return new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
    .update(json)
    .update(stringify(options))
    .update(`${noise}`)
    .getHash("B64");
}

/**
 * Signs the given payload using the specified options.
 * @param payload - The payload to be signed.
 * @param options - The options for signing the payload, including secret, timeWindow, and noTimeWindow.
 * @returns The signed payload with an added signature.
 */
export function signedPayload(payload: SignedPayload, options: Options = {}): SignedPayload {
  return { ...payload, signature: getPayloadSignature(payload, options) };
}

/**
 * Validates the given signed payload using the specified options.
 * @param payload - The signed payload to be validated.
 * @param options - The options for validating the payload, including secret, timeWindow, and noTimeWindow.
 * @returns True if the payload is valid, otherwise false.
 */
export function validatePayload(payload: SignedPayload, options: Options): boolean {
  return options.timeWindow
    ? payload.signature === getPayloadSignature(payload, options) || payload.signature === getPayloadSignature(payload, options, -1)
    : payload.signature === getPayloadSignature(payload, options);
}
