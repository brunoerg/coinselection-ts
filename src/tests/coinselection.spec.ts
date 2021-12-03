import utxos from './utxos/1.json'
import { coinselection } from '../coinselection';

describe('Test coin selection', () => {
    test('9560 satoshis, should return 1 input (BnB solution)', () => {
        const result = coinselection(utxos, [{value: 9560}], 10, 10);
        expect(result.inputs).toHaveLength(1);
    });
});