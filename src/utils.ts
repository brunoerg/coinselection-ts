import { Input } from "./types/input.type"
import { Output } from "./types/output.type"

const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4
const TX_INPUT_PUBKEYHASH = 107
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25

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