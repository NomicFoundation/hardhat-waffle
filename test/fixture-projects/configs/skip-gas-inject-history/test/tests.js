const { shouldSupportCalledOnContractMatchers } = require('../../shared-tests/verify-called-on-contract');
const { shouldSkipGasCostEstimation } = require('../../shared-tests/skip-estimate-gas');

shouldSupportCalledOnContractMatchers();
shouldSkipGasCostEstimation();
