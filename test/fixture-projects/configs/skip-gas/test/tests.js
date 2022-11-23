const {
  shouldNotSupportCalledOnContractMatchers,
} = require("../../shared-tests/verify-called-on-contract");
const {
  shouldSkipGasCostEstimation,
} = require("../../shared-tests/skip-estimate-gas");

shouldSkipGasCostEstimation();
shouldNotSupportCalledOnContractMatchers();
