require("../../../src/index");

process.env['TEST_SKIP_GAS'] = true;
process.env['TEST_INJECT_HISTORY'] = true;

module.exports = {
  solidity: "0.7.3",
  waffle: {
    skipEstimateGas: true,
    injectCallHistory: true
  }
};
