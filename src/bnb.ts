import * as utils from "./utils";
import { Input } from "./types/input.type";
import { OutputGroup } from "./types/output_group.type";

const MAX_TRIES = 100000;

export function bnb(utxos: Array<OutputGroup>, selection_target: number, cost_of_change: number): Array<Input> {
    let curr_value: number = 0;
    let curr_selection: Array<boolean> = [];
    let out_set: Array<Input> = [];

    let curr_available_value = utxos.reduce((a, { value }) => a + value, 0);

    if (curr_available_value < selection_target) {
        return [];
    }

    utxos = utxos.sort((a, b) => {
        return b.value - a.value
    });

    let curr_waste: number = 0;
    let best_selection: Array<boolean> = [];
    let best_waste: number = (21000000 * 100000000);

    for (let i = 0; i < MAX_TRIES; ++i) {
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
                curr_available_value += utils.getSelectionAmount(true, utxos[utxos.length - 1]);
            }

            if (curr_selection.length == 0) {
                break;
            }

            curr_selection[curr_selection.length - 1] = false;
            let utxo: OutputGroup = utxos[curr_selection.length - 1];
            curr_value -= utils.getSelectionAmount(true, utxo);
            curr_waste -= utxo.fee - utxo.long_term_fee;
        } else {
            let utxo: OutputGroup = utxos[curr_selection.length];
            curr_available_value -= utils.getSelectionAmount(true, utxo);

            if (curr_selection.length > 0 && !curr_selection[curr_selection.length - 1] &&
                utils.getSelectionAmount(false, utxo) == utils.getSelectionAmount(false, utxos[curr_selection.length - 1]) &&
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