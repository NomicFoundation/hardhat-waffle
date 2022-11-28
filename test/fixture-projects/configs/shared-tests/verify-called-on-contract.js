const { expect } = require("chai");

const shouldSupportCalledOnContractMatchers = () => {
  describe("Call history injection", () => {
    it("should support calledOnContractWith", async function () {
      const contractJSON = require(process.cwd() +
        "/artifacts/contracts/Contract.sol/Contract.json");
      const wallet = waffle.provider.getWallets()[0];
      const contract = await waffle.deployContract(wallet, contractJSON);

      const tx = await contract.inc(7);
      await tx.wait();

      expect("inc").to.be.calledOnContractWith(contract, [7]);
      expect(() =>
        expect("inc").to.be.calledOnContractWith(contract, [8])
      ).to.throw();
      expect(() =>
        expect("doNothing").to.be.calledOnContractWith(contract, [7])
      ).to.throw();
    });

    it("should support calledOnContract", async function () {
      const contractJSON = require(process.cwd() +
        "/artifacts/contracts/Contract.sol/Contract.json");
      const wallet = waffle.provider.getWallets()[0];
      const contract = await waffle.deployContract(wallet, contractJSON);

      const tx = await contract.inc(7);
      await tx.wait();

      expect("inc").to.be.calledOnContract(contract);
      expect(() =>
        expect("doNothing").to.be.calledOnContract(contract)
      ).to.throw();
    });
  });
};

const shouldNotSupportCalledOnContractMatchers = () => {
  describe("Call history injection", () => {
    it("Should print the right error for calledOnContractWith", async function () {
      const contractJSON = require(process.cwd() +
        "/artifacts/contracts/Contract.sol/Contract.json");
      const wallet = waffle.provider.getWallets()[0];
      const contract = await waffle.deployContract(wallet, contractJSON);

      const tx = await contract.inc(7);
      await tx.wait();

      try {
        expect("inc").to.be.calledOnContractWith(contract, [7]);
      } catch (error) {
        if (error.message.includes("calledOnContract matcher")) {
          return;
        }
      }

      throw Error("Should have failed");
    });

    it("Should print the right error for calledOnContract", async function () {
      const contractJSON = require(process.cwd() +
        "/artifacts/contracts/Contract.sol/Contract.json");
      const wallet = waffle.provider.getWallets()[0];
      const contract = await waffle.deployContract(wallet, contractJSON);

      const tx = await contract.inc(7);
      await tx.wait();

      try {
        expect("inc").to.be.calledOnContract(contract);
      } catch (error) {
        if (error.message.includes("calledOnContract matcher")) {
          return;
        }
      }

      throw Error("Should have failed");
    });
  });
};

module.exports = {
  shouldSupportCalledOnContractMatchers,
  shouldNotSupportCalledOnContractMatchers,
};
