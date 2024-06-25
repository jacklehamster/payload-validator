import stringify from "json-stable-stringify";
import jsSHA from "jssha";

type SignedPayload = any & {
  signature?: string;
}

function getPayloadSignature(payload: SignedPayload, secret: string) {
  const json = stringify({...payload, signature: undefined});
  return new jsSHA("SHA-256", "TEXT", { encoding: "UTF8" })
    .update(json)
    .update(secret)
    .getHash("B64");
}

export function signedPayload(payload: SignedPayload, secret: string = "") {
  return {...payload, signature: getPayloadSignature(payload, secret)};
}


export function validatePayload(payload: SignedPayload, secret: string = "") {
  return payload.signature === getPayloadSignature(payload, secret);
}
