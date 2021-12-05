import * as utils from "./utils";
import { Input } from "./types/input.type";
import { Output } from "./types/output.type";

const TOTAL_TRIES = 100000;

export function bnb(utxos: Array<Output>, selection_target: number, cost_of_change: number): Array<Input> {
    let curr_value: number = 0;
    let curr_selection: Array<boolean> = [];
    let out_set: Array<Input> = [];

    let curr_available_value: number = 0;
    for (const utxo of utxos) {
        curr_available_value += utils.getSelectionAmount(true, utxo);
    }

    if (curr_available_value < selection_target) {
        return [];
    }

    utxos = utxos.sort((a, b) => {
        return b.effective_value - a.effective_value
    });

    let curr_waste: number = 0;
    let best_selection: Array<boolean> = [];
    let best_waste: number = (21000000 * 100000000);

    for (let i = 0; i < TOTAL_TRIES; ++i) {
        let backtrack: boolean = false;
        if (curr_value + curr_available_value < selection_target ||
            curr_value > selection_target + cost_of_change ||
            (curr_waste > best_waste && (utxos[0].fee - utxos[0].long_term_fee) > 0)) {
            backtrack = true;
        } else if (curr_value >= selection_target) {
            curr_waste += (curr_value - selection_target);
            
            if (curr_waste <= best_waste) {
                best_selection = curr_selection;
                best_waste = curr_waste;
                if (best_waste == 0) {
                    break;
                }
            }

            curr_waste -= (curr_value - selection_target);
            backtrack = true;
        }

        if (backtrack) {
            while (curr_selection.length > 0 && !curr_selection[curr_selection.length - 1]) {
                curr_selection.pop();
                curr_available_value += utils.getSelectionAmount(true, utxos[curr_selection.length]);
            }

            if (curr_selection.length == 0) {
                break;
            }

            curr_selection[curr_selection.length - 1] = false;
            let utxo: Output = utxos[curr_selection.length - 1];
            curr_value -= utils.getSelectionAmount(true, utxo);
            curr_waste -= utxo.fee - utxo.long_term_fee;
        } else {
            let utxo: Output = utxos[curr_selection.length];

            curr_available_value -= utils.getSelectionAmount(true, utxo);

            if (curr_selection.length > 0 && !curr_selection[curr_selection.length - 1] &&
                utils.getSelectionAmount(true, utxo) == utils.getSelectionAmount(true, utxos[curr_selection.length - 1]) &&
                utxo.fee == utxos[curr_selection.length - 1].fee) {
                curr_selection.push(false);
            } else {
                curr_selection.push(true);
                curr_value += utils.getSelectionAmount(true, utxo);
                curr_waste += utxo.fee - utxo.long_term_fee;
            }
        }
    }

    if (best_selection.length == 0) {
        return [];
    }

    for (let i = 0; i < best_selection.length; i++) {
        if (best_selection[i]) {
            out_set.push(utxos[i]);
        }
    }

    return out_set;
}