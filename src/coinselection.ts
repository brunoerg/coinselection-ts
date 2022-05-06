import { bnb } from "./bnb";
import { knapsack } from "./knapsack";
import { srd } from "./srd"
import { Output } from "./types/output.type";
import * as utils from "./utils";

export function coinselection(utxos: Array<Output>, outputs: Array<Output>, fee_rate: number, long_term_fee: number) {
    const input_bytes = utils.transactionBytes([], outputs);
    const amount = outputs.reduce((a, { value }) => a + value, 0);
    const amount_with_fees = input_bytes * fee_rate + amount;
    const amount_utxos = utxos.reduce((a, { value }) => a + value, 0);


    if (amount_with_fees > amount_utxos || (fee_rate < 0 || long_term_fee < 0)) {
        return {
            inputs: [],
            outputs: []
        }
    }

    let coins: Array<Output> = [];

    for (const utxo of utxos) {
        const coin = {
            value: utxo.value,
            script: utxo.script ? utxo.script : [],
            fee: utxo.fee ? utxo.fee : fee_rate,
            long_term_fee: utxo.long_term_fee ? utxo.long_term_fee : long_term_fee
        }
        coins.push(coin);
    }

    const srd_result = utils.finalize(srd(coins, amount_with_fees), outputs, fee_rate);
    const bnb_result = utils.finalize(bnb(coins, amount_with_fees, 0), outputs, fee_rate);
    const ks_result = utils.finalize(knapsack(coins, amount_with_fees), outputs, fee_rate);

    const results = [ 
        {
            'result': srd_result,
            'waste': srd_result.inputs.length == 0 ? 1000000 : utils.getSelectionWaste(srd_result.inputs, false, 10, amount_with_fees)
        },
        {
            'result': bnb_result,
            'waste': bnb_result.inputs.length == 0 ? 1000000 : utils.getSelectionWaste(bnb_result.inputs, false, 0, amount_with_fees)
        },
        {
            'result': ks_result,
            'waste':  ks_result.inputs.length == 0 ? 1000000 : utils.getSelectionWaste(ks_result.inputs, false, 0, amount_with_fees)
        }
    ];

    const min = Math.min.apply(null, results.map(item => item.waste));

    return results.filter(item => item.waste == min)[0].result;
}
