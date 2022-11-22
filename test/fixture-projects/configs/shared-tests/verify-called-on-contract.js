const { expect } = require('chai');

const shouldSupportCalledOnContractMatchers = () => {
  describe('Call history injection', () => {
    it("should support calledOnContractWith", async function () {
      const Contract = await ethers.getContractFactory("Contract");
      const contract = await Contract.deploy();
    
      await contract.deployed();
    
      const tx = await contract.inc(7);
      await tx.wait();
    
      expect("inc").to.be.calledOnContractWith(contract, [7]);
    });
    
    it("should support calledOnContract", async function () {
      const Contract = await ethers.getContractFactory("Contract");
      const contract = await Contract.deploy();
    
      await contract.deployed();
    
      const tx = await contract.inc(7);
      await tx.wait();
    
      expect("inc").to.be.calledOnContract(contract);
    });
  });
};

const shouldNotSupportCalledOnContractMatchers = () => {
  describe('Call history injection', () => {
    it("Should print the right error for calledOnContractWith", async function () {
      const Contract = await ethers.getContractFactory("Contract");
      const contract = await Contract.deploy();
  
      await contract.deployed();
  
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
      const Contract = await ethers.getContractFactory("Contract");
      const contract = await Contract.deploy();
  
      await contract.deployed();
  
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

