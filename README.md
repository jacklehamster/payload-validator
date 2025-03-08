# `payload-validator`

[![npm version](https://badge.fury.io/js/@dobuki%2Fpayload-validator.svg)](https://www.npmjs.com/package/@dobuki/payload-validator)

[![License](https://img.shields.io/github/license/jacklehamster/payload-validator)](https://github.com/jacklehamster/payload-validator)

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
const options = { secret: 'mysecret' }; // You can name the secret key anything you want for security
const signed = signedPayload(payload, options);

console.log(signed);
// Output: { data: 'example', signature: 'generated-signature' }
```

### Validating a Payload

Use the `validatePayload` function to validate a signed payload with a secret:

```typescript
const isValid = validatePayload(signed, options);

console.log(isValid);
// Output: true
```

## Time Window Mechanism

The library uses a time window mechanism to enhance security. The time window changes every 5 seconds by default, ensuring that the signature is only valid within the current and the previous time window. This adds an additional layer of protection against replay attacks. The time window duration can be customized through the `options` parameter.

### Example with Time Window

```typescript
import { signedPayload, validatePayload } from 'payload-validator';

const payload = { data: 'test' };
const options = { secret: 'mysecret', timeWindow: 1000 * 5 };

// Signing the payload
const signed = signedPayload(payload, options);
console.log(signed); // { data: 'test', signature: '...' }

// Validating the payload
const isValid = validatePayload(signed, options);
console.log(isValid); // true

// Invalid validation with a wrong secret
 const wrongOptions = { secret: 'wrongsecret', timeWindow: 1000 * 5 };
 const isValidWrongSecret = validatePayload(signed, wrongOptions);
 console.log(isValidWrongSecret); // false
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

<https://jacklehamster.github.io/payload-validator/example/>

```typescript
import { signedPayload, validatePayload } from 'payload-validator';

const payload = { data: 'test' };

const options = { secret: 'mysecret' }; // You can name the secret key anything you want for security
const signed = signedPayload(payload, options);

console.log(signed); // { data: 'test', signature: '...' }

// Validating the payload
const isValid = validatePayload(signed, options);
console.log(isValid); // true

// Invalid validation with a wrong secret
const isValidWrongSecret = validatePayload(signed, { secret: 'wrongsecret' });
console.log(isValidWrongSecret); // false
```

## License

This project is licensed under the MIT License.
