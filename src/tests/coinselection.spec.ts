import utxos from './utxos/1.json'
import { coinselection } from '../coinselection';

describe('Test coin selection', () => {
    test('9560 satoshis, should return 1 input (BnB solution)', () => {
        const result = coinselection(utxos, [{value: 9560}], 10, 10);
        expect(result.inputs).toHaveLength(1);
    });

    test('100000 + 84975 satoshis, should not generate change', () => {
        const result = coinselection(utxos, [{ value: 100000 }, { value: 84975 }], 10, 10);
        expect(result.outputs).toHaveLength(2);
    })
});