import "@nomiclabs/hardhat-ethers";
import type { MockProvider } from "ethereum-waffle";
import type { providers, Signer } from "ethers";
import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";

import { getDeployMockContract, hardhatDeployContract } from "./deploy";
import { getLinkFunction } from "./link";
import { initializeWaffleMatchers } from "./matchers";
import "./type-extensions";
import {
  getHardhatVMEventEmitter,
  skipGasCostCheck,
} from "./skip-gas-cost-check";

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

    const init =
      hardhatWaffleProvider._hardhatNetwork.provider._wrapped._wrapped._wrapped
        ._init;
    hardhatWaffleProvider._hardhatNetwork.provider._wrapped._wrapped._wrapped._init =
      async function () {
        await init.apply(this);
        if (
          getHardhatVMEventEmitter(hardhatWaffleProvider)?.listenerCount(
            "beforeMessage"
          ) < 2
        ) {
          skipGasCostCheck(hardhatWaffleProvider);
        }
      };

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
