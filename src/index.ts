import "@nomiclabs/hardhat-ethers";
import { extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import type { MockProvider } from "ethereum-waffle";
import type { providers, Signer } from "ethers";

import { getDeployMockContract, hardhatDeployContract } from "./deploy";
import { getLinkFunction } from "./link";
import { initializeWaffleMatchers } from "./matchers";
import "./type-extensions";

extendEnvironment((hre) => {
  // We can't actually implement a MockProvider because of its private
  // properties, so we cast it here 😢
  hre.waffle = lazyObject(() => {
    const { WaffleMockProviderAdapter } = require("./waffle-provider-adapter");

    const hardhatWaffleProvider = new WaffleMockProviderAdapter(
      hre.network
    ) as any;

    const { waffleChai } = require("@ethereum-waffle/chai");
    const { createFixtureLoader } = require("@ethereum-waffle/provider")

    const hardhatCreateFixtureLoader = (
      hardhatWaffleProvider: MockProvider,
      overrideSigners?: Signer[],
      overrideProvider?: providers.JsonRpcProvider
    ) => {
      return createFixtureLoader(
        overrideSigners,
        overrideProvider ?? hardhatWaffleProvider
      );
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
