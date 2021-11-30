import { utxos } from './utxos/1'
import { srd } from '../srd'
import { Input } from '../types/input.type';
import { bnb } from '../bnb';
import utxos_json from './utxos/1.json';
import { OutputGroup } from '../types/output_group.type';

describe('Test BNB', () => {
    test('aoba', () => {
        let utxos_bnb: Array<OutputGroup> = [];

        for (const utxo of utxos_json) {
            let output_group = {
                value: utxo.value,
                fee: 1,
                long_term_fee: 10
            }
            utxos_bnb.push(output_group);
        }

        const result: Array<Input> = bnb(utxos_bnb, 284074, 0);
        console.log(result);
    });
});