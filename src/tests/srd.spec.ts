import { utxos } from './utxos/1'
import { srd } from '../srd'
import { Input } from '../types/input.type';

describe('Test SRD', () => {
    test('1 satoshi as target, should return 1 input', () => {
        const result: Array<Input> = srd(utxos, 1);
        expect(result).toHaveLength(1);
    });

    test('1000000 satoshis as target, should return more than 1 input', () => {
        const result: Array<Input> = srd(utxos, 1000000);
        expect(result.length).toBeGreaterThan(1);
    });

    test('sum of the value of the inputs must be greater or equal the target', () => {
        const result: Array<Input> = srd(utxos, 1000000);
        const amount = result.reduce((a, { value }) => a + value, 0 );
        expect(amount).toBeGreaterThanOrEqual(1000000);
    })
});