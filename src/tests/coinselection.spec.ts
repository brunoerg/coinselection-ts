import utxos from './utxos/1.json'
import { coinselection } from '../coinselection';

describe('Test coin selection', () => {
    test('9560 satoshis, should return 1 input (BnB solution)', () => {
        const result = coinselection(utxos, [{ value: 9560 }], 10, 10);
        expect(result.inputs).toHaveLength(1);
    });

    test('100000 + 84975 satoshis, should not generate change (BnB solution)', () => {
        const result = coinselection(utxos, [{ value: 100000 }, { value: 84975 }], 10, 10);
        expect(result.outputs).toHaveLength(2);
    });

    test('1 million satoshis, sum of outputs value should be greater than 1 million', () => {
        const { outputs } = coinselection(utxos, [{ value: 1000000 }], 1, 10);
        let total = 0;
        for (const output of outputs) {
            total += output.value;
        }
        expect(total).toBeGreaterThanOrEqual(1000000);
    });

    test('1 million satoshis, with 10 sats/B for fee and 1 sat/B for long term fee, should have 2 inputs or less', () => {
        const { inputs } = coinselection(utxos, [{ value: 100000 }], 10, 1);
        expect(inputs.length).toBeLessThanOrEqual(2);
    });

    test('Insufficient funds, should return an empty solution', () => {
        const utxos =
            [
                {
                    "txId": "0eb727d9da3cbbabae776d8200221f68473d5a0bc2c456d18e419c493ed0bf2d",
                    "vout": 46,
                    "value": 14561,
                },
                {
                    "txId": "d4eb4955286bb97c40302b5ec018b55f9b498f2b64ce726f19b0eadb7f4a7c44",
                    "vout": 80,
                    "value": 355933,
                }
            ];

        const recipients = [
            {
                "value": 69036119,
                "to": "1GsPMkp9dr1nHYoXzuBitiCiGcDzAuhnB5",
            }
        ];

        const { inputs, outputs } = coinselection(utxos, recipients, 1, 1);

        expect(inputs.length).toEqual(0);
        expect(outputs.length).toEqual(0);
    })
});