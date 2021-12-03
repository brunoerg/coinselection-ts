import { Input } from '../types/input.type';
import { knapsack } from '../knapsack';
import utxos_json from './utxos/1.json';
import { Output } from '../types/output.type';


describe('Test Knapsack', () => {
    let utxos: Array<Output> = [];

    for (const utxo of utxos_json) {
        let output_group = {
            value: utxo.value,
            fee: 10,
            long_term_fee: 10
        }
        utxos.push(output_group);
    }

    test('100000 satoshis as target, the sum should be greater than 100000', () => {
        const result: Array<Input> = knapsack(utxos, 100000);
        const final_value: number = result.reduce((a, { value }) => a + value, 0);
        expect(final_value).toBeGreaterThan(100000);
    });

    test('10000 satoshis as target, should return 2 inputs', () => {
        const result: Array<Input> = knapsack(utxos, 10000);
        expect(result).toHaveLength(2);
    });
});