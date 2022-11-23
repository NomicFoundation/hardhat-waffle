require("../../../../src/index");

module.exports = {
  solidity: "0.7.3",
  waffle: {
    skipEstimateGas: '0xB71B00',
    injectCallHistory: true
  }
};
