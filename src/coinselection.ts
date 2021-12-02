import { bnb } from "./bnb";
import { knapsack } from "./knapsack";
import { srd } from "./srd"
import { Output } from "./types/output.type";
import { OutputGroup } from "./types/output_group.type";
import * as utils from "./utils";

export function coinselection(utxos: Array<OutputGroup>, outputs: Array<Output>, fee_rate: number, long_term_fee: number) {
    const input_bytes = utils.transactionBytes([], outputs);
    const amount = outputs.reduce((a, { value }) => a + value, 0);
    const amount_with_fees = input_bytes * fee_rate + amount;

    let coins: Array<OutputGroup> = [];

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
            'waste': utils.getSelectionWaste(srd_result.inputs, false, 10, amount_with_fees)
        },
        {
            'result': bnb_result,
            'waste': utils.getSelectionWaste(bnb_result.inputs, false, 0, amount_with_fees)
        },
        {
            'result': ks_result,
            'waste': utils.getSelectionWaste(ks_result.inputs, false, 0, amount_with_fees)
        }
    ];

    return Math.min.apply(null, results.map(item => item.waste));
}
