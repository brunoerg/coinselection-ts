import { Input } from "./types/input.type";
import { Output } from "./types/output.type";
import { shuffle } from "./utils"

export function srd(utxos: Array<Output>, target: number): Array<Input> {
    const shuffle_res = shuffle(utxos);
    
    let final_solution: Array<Input> = [];
    let accumulative_value = 0;

    for (const utxo of shuffle_res) {
        final_solution.push(utxo);
        accumulative_value += utxo.value;

        if (accumulative_value >= target) {
            return final_solution;
        }
    }

    return final_solution;
}