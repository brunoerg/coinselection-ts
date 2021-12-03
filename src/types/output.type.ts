export type Output = {
    script?: Script
    tx_id?: string, 
    vout?: number,
    non_witness_utxo?: Buffer
    witness_utxo?: WitnessUtxo
    fee?: number 
    long_term_fee?: number
    value: number
    effective_value?: number
}

export type Script = {
    length: number
}

export type WitnessUtxo = {
    script: Buffer,
    value: number
}