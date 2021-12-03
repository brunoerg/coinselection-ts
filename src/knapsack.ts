import { Output } from "./types/output.type";
import * as utils from "./utils";

const MIN_CHANGE = 500;

export function knapsack(utxos: Array<Output>, target_value: number): Array<Output> {
    let lowest_larger: Output;
    let applicable_groups: Array<Output> = [];
    let set_coins_ret: Array<Output> = [];
    let total_lower: number = 0;

    utxos = utils.shuffle(utxos);

    for (const utxo of utxos) {
        const amount = utils.getSelectionAmount(false, utxo);
        if (amount == target_value) {
            set_coins_ret.push(utxo);
            return set_coins_ret;
        } else if (amount < target_value + MIN_CHANGE) {
            applicable_groups.push(utxo);
            total_lower += amount;
        } else if (!lowest_larger || amount < utils.getSelectionAmount(false, lowest_larger)) {
            lowest_larger = utxo;
        }
    }

    if (total_lower == target_value) {
        return applicable_groups;
    }

    if (total_lower < target_value) {
        if (!lowest_larger) return [];
        return [lowest_larger];
    }

    applicable_groups = applicable_groups.sort((a, b) => {
        return b.value - a.value
    });

    let abs: [number, Array<boolean>] = utils.ApproximateBestSubset(applicable_groups, total_lower, target_value);

    if (abs[0] != target_value && total_lower >= target_value + MIN_CHANGE) {
        abs = utils.ApproximateBestSubset(applicable_groups, total_lower, target_value + MIN_CHANGE);
    }

    if (lowest_larger && ((abs[0] != target_value && abs[0] < target_value + MIN_CHANGE) || utils.getSelectionAmount(false, lowest_larger) <= abs[0])) {
        return [lowest_larger];
    } else {
        let final_return: Array<Output> = [];
        for (let i = 0; i < applicable_groups.length; i++) {
            if (abs[1]) {
                final_return.push(applicable_groups[i]);
            }
        }
        return final_return;
    }



}
