require("../../../src/index");

process.env['TEST_SKIP_GAS'] = true;

module.exports = {
  solidity: "0.7.3",
  waffle: {
    skipEstimateGas: true
  }
};
