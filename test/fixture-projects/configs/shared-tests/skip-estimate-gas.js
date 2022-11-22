const { expect } = require("chai");

const checkGasCostEstimation = ({ enabled }) => {
  describe('Gas cost estimation', () => {
    it(`should ${enabled ? '' : `not `}skip gas cost estimation`, async function () {
      let estimateGasCalled = false;
      const originalProcess =
        waffle.provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule.processRequest.bind(
          waffle.provider._hardhatNetwork.provider._wrapped._wrapped._wrapped
            ._ethModule
        );
      waffle.provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule.processRequest =
        (method, params) => {
          if (method === "eth_estimateGas") {
            estimateGasCalled = true;
          }
          return originalProcess(method, params);
        };
  
      processRequest =
        waffle.provider._hardhatNetwork.provider._wrapped._wrapped._wrapped
          ._ethModule.processRequest;
  
      const Contract = await ethers.getContractFactory("Contract");
      const contract = await Contract.deploy();
  
      await contract.deployed();
  
      const tx = await contract.inc(7);
      await tx.wait();
  
      if (enabled) {
        expect(estimateGasCalled, "Estimate gas was called but shouldn't have been").to.be.false;
      } else {
        expect(estimateGasCalled, "Estimate gas was not called but should have been").to.be.true;
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
