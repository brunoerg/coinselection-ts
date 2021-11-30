import { srd } from "./srd"
import { Output } from "./types/output.type";
import * as utils from "./utils";

export function coinselection(utxos: Array<Output>, outputs: Array<Output>, fee_rate: number) {
    const srd_result = srd(utxos, 10000);
    return utils.finalize(srd_result, outputs, fee_rate);
}
