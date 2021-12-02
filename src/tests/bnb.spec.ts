import { Input } from '../types/input.type';
import { bnb } from '../bnb';
import utxos_json from './utxos/1.json';
import { OutputGroup } from '../types/output_group.type';

describe('Test BNB', () => {
    let utxos_bnb: Array<OutputGroup> = [];

    for (const utxo of utxos_json) {
        let output_group = {
            value: utxo.value,
            fee: 10,
            long_term_fee: 10
        }
        utxos_bnb.push(output_group);
    }

    test('227837 satoshis as target, should return 1 input', () => {
        const result: Array<Input> = bnb(utxos_bnb, 10000, 0);
        expect(result).toHaveLength(1);
    });

    test('123456 satoshi as target, should return an empty array', () => {
        const result: Array<Input> = bnb(utxos_bnb, 123456, 0);
        expect(result).toHaveLength(0);
    })
});