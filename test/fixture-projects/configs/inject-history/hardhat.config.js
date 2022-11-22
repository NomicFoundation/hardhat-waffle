require("../../../src/index");

process.env['TEST_INJECT_HISTORY'] = true;

module.exports = {
  solidity: "0.7.3",
  waffle: {
    injectCallHistory: true
  }
};
