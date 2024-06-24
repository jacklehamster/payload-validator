# `payload-validator`

[![npm version](https://badge.fury.io/js/payload-validator.svg)](https://www.npmjs.com/package/payload-validator)

`payload-validator` is a simple and efficient library for signing and validating payloads using a secret. It ensures the integrity of your data by generating and checking signatures based on the content of the payload and a provided secret.

![icon](https://jacklehamster.github.io/payload-validator/icon.png)

## Github Source

[https://github.com/jacklehamster/payload-validator/](https://github.com/jacklehamster/payload-validator/)

## Installation

Install the package using npm:

```sh
npm install payload-validator
```

Or using bun:

```sh
bun add payload-validator
```

## Usage

### Importing

```typescript
import { signedPayload, validatePayload } from 'payload-validator';
```

### Signing a Payload

Use the `signedPayload` function to sign a payload with a secret:

```typescript
const payload = { data: 'example' };
const secret = 'mysecret';
const signed = signedPayload(payload, secret);

console.log(signed);
// Output: { data: 'example', signature: 'generated-signature' }
```

### Validating a Payload

Use the `validatePayload` function to validate a signed payload with a secret:

```typescript
const isValid = validatePayload(signed, secret);

console.log(isValid);
// Output: true
```

## API

### `signedPayload(payload: SignedPayload, secret: string = ""): SignedPayload`

Signs the given payload using the provided secret and returns a new payload with the added signature.

- `payload`: The payload object to be signed.
- `secret`: The secret string used for signing the payload.

Returns the signed payload object.

### `validatePayload(payload: SignedPayload, secret: string = ""): boolean`

Validates the given signed payload using the provided secret.

- `payload`: The signed payload object to be validated.
- `secret`: The secret string used for validating the payload.

Returns `true` if the payload is valid, otherwise `false`.

## Example

```typescript
import { signedPayload, validatePayload } from 'payload-validator';

const payload = { data: 'test' };
const secret = 'mysecret';

// Signing the payload
const signed = signedPayload(payload, secret);
console.log(signed); // { data: 'test', signature: '...' }

// Validating the payload
const isValid = validatePayload(signed, secret);
console.log(isValid); // true

// Invalid validation with a wrong secret
const isValidWrongSecret = validatePayload(signed, 'wrongsecret');
console.log(isValidWrongSecret); // false
```

## License

This project is licensed under the MIT License.
