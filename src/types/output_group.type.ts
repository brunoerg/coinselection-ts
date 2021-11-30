export type OutputGroup = {
    script?: Script
    fee: number 
    long_term_fee: number
    value: number
    effective_value?: number
}

export type Script = {
    length: number
}