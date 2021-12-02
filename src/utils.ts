import { Input } from "./types/input.type"
import { Output } from "./types/output.type"
import { OutputGroup } from "./types/output_group.type"

const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4
const TX_INPUT_PUBKEYHASH = 107
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25
const EFFECTIVE_FEE_RATE = 10;

export function inputBytes(input: Input) {
    return TX_INPUT_BASE + (input.script ? input.script.length : TX_INPUT_PUBKEYHASH)
}

export function outputBytes(output: Output) {
    return TX_OUTPUT_BASE + (output.script ? output.script.length : TX_OUTPUT_PUBKEYHASH)
}

export function dustThreshold(feeRate: number) {
    /* ... classify the output for input estimate  */
    return (TX_INPUT_BASE + TX_INPUT_PUBKEYHASH) * feeRate
}

export function transactionBytes(inputs: Array<Input>, outputs: Array<Output>) {
    return TX_EMPTY_SIZE +
        inputs.reduce(function (a, x) { return a + inputBytes(x) }, 0) +
        outputs.reduce(function (a, x) { return a + outputBytes(x) }, 0)
}

export function sumForgiving(range) {
    return range.reduce(function (a, x) { return a + (isFinite(x.value) ? x.value : 0) }, 0)
}

export function sum(range) {
    return range.reduce(function (a, x) { return a + x.value }, 0)
}

export const BLANK_OUTPUT = TX_OUTPUT_BASE + TX_OUTPUT_PUBKEYHASH

export function finalize(inputs: Array<Input>, outputs: Array<Output>, feeRate: number) {
    const bytesAccum = transactionBytes(inputs, outputs)
    const feeAfterExtraOutput = feeRate * (bytesAccum + BLANK_OUTPUT)
    const remainderAfterExtraOutput = sum(inputs) - (sum(outputs) + feeAfterExtraOutput)

    // is it worth a change output?
    if (remainderAfterExtraOutput > dustThreshold(feeRate)) {
        outputs = outputs.concat({ value: remainderAfterExtraOutput })
    }

    let fee = sum(inputs) - sum(outputs)
    if (!isFinite(fee)) return { fee: feeRate * bytesAccum }

    return {
        inputs: inputs,
        outputs: outputs,
        fee: fee
    }
}

export function getRandom(arr: [], n: number) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export function shuffle(array: Array<Output>) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export function getSelectionAmount(subtract_fee_outputs: boolean, utxo: OutputGroup): number {
    utxo.effective_value = utxo.value - (EFFECTIVE_FEE_RATE * inputBytes(utxo));
    return subtract_fee_outputs ? utxo.value : utxo.effective_value;
}

export function getSelectionWaste(inputs: Array<OutputGroup>, use_effective_value: boolean, change_cost: number, target: number): number {
    let waste: number = 0;
    let selected_effective_value: number = 0;

    for (const input of inputs) {
        waste += input.fee - input.long_term_fee;
        selected_effective_value += use_effective_value ? input.effective_value : input.value;
    }

    if (change_cost > 0) {
        waste += change_cost;
    } else {
        waste += selected_effective_value - target;
    }

    return waste;
}

export function ApproximateBestSubset(groups: Array<OutputGroup>, total_lower: number, target_value: number, iterations: number = 1000): [number, boolean[]] {
    
    let vf_included: Array<boolean> = [];
    let vf_best: Array<boolean> = [];
    let n_best: number = total_lower;

    for (let rep = 0; rep < iterations && n_best != target_value; rep++) {
        let n_total: number = 0;
        let reached_target: boolean = false;
        for (let n_pass = 0; n_pass < 2 && !reached_target; n_pass++) {
            for (let i = 0; i < groups.length; i++) {
                const amount = getSelectionAmount(false, groups[i]);
                if (n_pass == 0 ? Math.random() < 0.5 : !vf_included[i]) {
                    n_total += amount;
                    vf_included[i] = true;
                    if (n_total >= target_value) {
                        reached_target = true;
                        if (n_total < n_best) {
                            n_best = n_total;
                            vf_best = vf_included;
                        }
                        n_total -= amount;
                        vf_included[i] = false;
                    }
                }
            }
        }
    }

    return [n_best, vf_best];
}