import stringify from "json-stable-stringify";
import jsSHA from "jssha";

const TIMEWINDOW_PERIOD = 1000 * 42; //  time window changes every 42 secs.

type SignedPayload = any & {
  signature?: string;
}

interface Options {
  secret?: string;
  timeWindow?: number;
}

function getPayloadSignature(payload: SignedPayload, options: Options, offset: number = 0) {
  const json = stringify({...payload, signature: undefined});
  const noise = Math.floor(Date.now()/(options.timeWindow ?? TIMEWINDOW_PERIOD)) + offset;
  return new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
    .update(json)
    .update(options.secret ?? "")
    .update(`${noise}`)
    .getHash("B64");
}

export function signedPayload(payload: SignedPayload, options: Options = {}) {
  return {...payload, signature: getPayloadSignature(payload, options)};
}


export function validatePayload(payload: SignedPayload, options: Options) {
  return options.timeWindow
  ? payload.signature === getPayloadSignature(payload, options) || payload.signature === getPayloadSignature(payload, options, -1)
  : payload.signature === getPayloadSignature(payload, options);
}
