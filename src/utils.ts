const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4
const TX_INPUT_PUBKEYHASH = 107
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25

export function inputBytes(input) {
    return TX_INPUT_BASE + (input.script ? input.script.length : TX_INPUT_PUBKEYHASH)
}

export function outputBytes(output) {
    return TX_OUTPUT_BASE + (output.script ? output.script.length : TX_OUTPUT_PUBKEYHASH)
}

export function dustThreshold(output, feeRate) {
    /* ... classify the output for input estimate  */
    return inputBytes({}) * feeRate
}

export function transactionBytes(inputs, outputs) {
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

export const BLANK_OUTPUT = outputBytes({})

export function finalize(inputs, outputs, feeRate) {
    var bytesAccum = transactionBytes(inputs, outputs)
    var feeAfterExtraOutput = feeRate * (bytesAccum + BLANK_OUTPUT)
    var remainderAfterExtraOutput = sum(inputs) - (sum(outputs) + feeAfterExtraOutput)

    // is it worth a change output?
    if (remainderAfterExtraOutput > dustThreshold({}, feeRate)) {
        outputs = outputs.concat({ value: remainderAfterExtraOutput })
    }

    var fee = sum(inputs) - sum(outputs)
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

export function shuffle(array: []) {
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