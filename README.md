# coinselection-ts
Coin selection library in Typescript

This library adopts the same strategy of Bitcoin Core. It implements Branch and Bound, Knapsack and SRD algorithms and uses a waste metric to decide what solution will be used. Obs.: Some parts of this library is based on coinselect (https://github.com/bitcoinjs/coinselect).

## Install

```
npm i --save coinselection-ts
```

## How to use

```javascript
import { coinselection } from "coinselection-ts"

const fee_rate = 1; //satoshis per byte
const long_term_fee = 10;

const utxos = [
    ...,
    {
    txId: '...',
    vout: 0,
    ...,
    value: 10000,
    script: {
        ...
    }
];

const outputs = [
    ...,
    {
        address: '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm',
        value: 5000
    }
];

const { inputs, outputs, fee } = coinselection(utxos, outputs, fee_rate, long_term_fee);
```
