import stringify from "json-stable-stringify";
import shajs from "sha.js";

type SignedPayload = Object & {
  signature?: string;
}

function getPayloadSignature(payload: SignedPayload, secret: string) {
  const json = stringify({...payload, signature: undefined});
  return shajs('sha256')
    .update(json)
    .update(secret)
    .digest("base64url");
}

export function signedPayload(payload: SignedPayload, secret: string = "") {
  return {...payload, signature: getPayloadSignature(payload, secret)};
}


export function validatePayload(payload: SignedPayload, secret: string = "") {
  return payload.signature === getPayloadSignature(payload, secret);
}
