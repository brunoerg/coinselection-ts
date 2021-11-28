import * as utils from '../utils'

describe('Test util functions', () => {
  test('test empty inputbytes', () => {
    const input_bytes = utils.inputBytes({ value: 100 })
    expect(input_bytes).toBe(148);
  });

  test('test empty outputbytes', () => {
    const output_bytes = utils.outputBytes({ value: 100 })
    expect(output_bytes).toBe(34)
  });

  test('test dustThreshold', () => {
    const dust = utils.dustThreshold(100);
    expect(dust).toBe(14800);
  });
});