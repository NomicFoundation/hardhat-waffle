import "@nomiclabs/hardhat-ethers";
import type { MockProvider } from "ethereum-waffle";
import type { providers, Signer } from "ethers";
import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";

import { getDeployMockContract, hardhatDeployContract } from "./deploy";
import { getLinkFunction } from "./link";
import { initializeWaffleMatchers } from "./matchers";
import "./type-extensions";
import { skipEstimateGas } from "./skip-estimate-gas";

declare module "hardhat/types" {
  export interface HardhatUserConfig {
    waffle?: {
      /**
       * If true, the call history will be injected into the Hardhat Runtime Environment.
       * This will allow you to use matchers `calledOnContract` and `calledOnContractWith`.
       *
       * @default false
       */
      injectCallHistory?: boolean;
      /**
       * If true, the estimate gas step will be skipped when executing a transaction.
       *
       * @default false
       */
      skipEstimateGas?: boolean;
    };
  }

  export interface HardhatConfig {
    waffle?: {
      injectCallHistory?: boolean;
      skipEstimateGas?: boolean;
    };
  }
}

extendEnvironment((hre) => {
  // We can't actually implement a MockProvider because of its private
  // properties, so we cast it here 😢
  hre.waffle = lazyObject(() => {
    const { WaffleMockProviderAdapter } = require("./waffle-provider-adapter");

    const hardhatWaffleProvider = new WaffleMockProviderAdapter(
      hre.network
    ) as any;

    // eslint-disable-next-line import/no-extraneous-dependencies
    const { waffleChai } = require("@ethereum-waffle/chai");
    // TODO: next line requires @ethereum-waffle/provider - do we want it to be this way?
    // eslint-disable-next-line import/no-extraneous-dependencies
    const { createFixtureLoader } = require("@ethereum-waffle/provider");

    const hardhatCreateFixtureLoader = (
      provider: MockProvider,
      overrideSigners?: Signer[],
      overrideProvider?: providers.JsonRpcProvider
    ) => {
      return createFixtureLoader(overrideSigners, overrideProvider ?? provider);
    };

    if (hre.config.waffle?.skipEstimateGas === true) {
      skipEstimateGas(hardhatWaffleProvider);
    }

    return {
      provider: hardhatWaffleProvider,
      deployContract: hardhatDeployContract.bind(undefined, hre),
      deployMockContract: getDeployMockContract(),
      solidity: waffleChai,
      createFixtureLoader: hardhatCreateFixtureLoader.bind(
        undefined,
        hardhatWaffleProvider
      ),
      loadFixture: hardhatCreateFixtureLoader(hardhatWaffleProvider),
      link: getLinkFunction(),
    };
  });

  initializeWaffleMatchers(hre.config.paths.root);
});
