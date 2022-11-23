const { expect } = require("chai");

const checkGasCostEstimation = ({ enabled }) => {
  describe("Gas cost estimation", () => {
    it(`should ${
      enabled ? "" : `not `
    }skip gas cost estimation`, async function () {
      const Contract = await ethers.getContractFactory("Contract");
      const contract = await Contract.deploy();

      await contract.deployed();

      const calldata1 = contract.interface.encodeFunctionData("inc", [7]);
      const calldata2 = contract.interface.encodeFunctionData("doNothing", []);
      const gas1 = await waffle.provider.estimateGas({
        to: contract.address,
        data: calldata1,
      });
      const gas2 = await waffle.provider.estimateGas({
        to: contract.address,
        data: calldata2,
      });

      if (enabled) {
        expect(
          gas1.toHexString() === gas2.toHexString() &&
            gas1.toHexString() === "0xB71B00",
          "Estimate gas was called but shouldn't have been"
        ).to.be.true;
      } else {
        expect(
          gas1.toHexString() === gas2.toHexString(),
          "Estimate gas was not called but should have been"
        ).to.be.false;
      }
    });
  });
};

const shouldSkipGasCostEstimation = () => {
  checkGasCostEstimation({ enabled: true });
};

const shouldNotSkipGasCostEstimation = () => {
  checkGasCostEstimation({ enabled: false });
};

module.exports = {
  shouldSkipGasCostEstimation,
  shouldNotSkipGasCostEstimation,
};
