const { shouldSupportCalledOnContractMatchers } = require('../../shared-tests/verify-called-on-contract');
const { shouldNotSkipGasCostEstimation } = require('../../shared-tests/skip-estimate-gas');

shouldSupportCalledOnContractMatchers();
shouldNotSkipGasCostEstimation();
