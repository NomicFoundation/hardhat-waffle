import { assert } from "chai";
import { normalizeHardhatNetworkAccountsConfig } from "hardhat/internal/core/providers/util";
import { HARDHAT_NETWORK_NAME } from "hardhat/plugins";
import { HardhatNetworkConfig } from "hardhat/types";
import path from "path";
import { copy } from "fs-extra";

import { useEnvironment } from "./helpers";

describe("Waffle plugin plugin", function () {
  describe("Hardhat's Waffle provider adapter", function () {
    describe("provider.getWallets", function () {
      describe("With hardhat", function () {
        describe("With the default hardhat accounts", function () {
          useEnvironment("hardhat-project", "hardhat");

          it("Should return a wallet for each of the default accounts", function () {
            const wallets = this.env.waffle.provider.getWallets();
            assert.equal(this.env.network.name, HARDHAT_NETWORK_NAME);
            const netConfig = this.env.network.config as HardhatNetworkConfig;
            const accounts = normalizeHardhatNetworkAccountsConfig(
              netConfig.accounts
            );

            assert.lengthOf(wallets, accounts.length);

            for (let i = 0; i < wallets.length; i++) {
              assert.equal(
                wallets[i].privateKey.toLowerCase(),
                accounts[i].privateKey.toLowerCase()
              );
            }
          });
        });

        describe("With customized hardhat accounts", function () {
          useEnvironment("hardhat-project-custom-accounts", "hardhat");

          it("Should return a wallet for each of the custom accounts", function () {
            const wallets = this.env.waffle.provider.getWallets();
            const accounts = require(path.join(
              process.cwd(),
              "hardhat.config.js"
            )).networks.hardhat.accounts;

            assert.lengthOf(wallets, accounts.length);

            for (let i = 0; i < wallets.length; i++) {
              assert.equal(
                wallets[i].privateKey.toLowerCase(),
                accounts[i].privateKey.toLowerCase()
              );
            }
          });
        });
      });

      describe("Using other network", function () {
        useEnvironment("hardhat-project");

        it("Should throw an error", function () {
          assert.throws(
            () => this.env.waffle.provider.getWallets(),
            "This method only works with Hardhat Network"
          );
        });
      });

      describe("Deprecated getWallets", function () {
        describe("With hardhat", function () {
          describe("With the default hardhat accounts", function () {
            useEnvironment("hardhat-project", "hardhat");

            it("Should return a wallet for each of the default accounts", function () {
              const wallets = this.env.waffle.provider.getWallets();
              assert.equal(this.env.network.name, HARDHAT_NETWORK_NAME);
              const netConfig = this.env.network.config as HardhatNetworkConfig;
              const accounts = normalizeHardhatNetworkAccountsConfig(
                netConfig.accounts
              );

              assert.lengthOf(wallets, accounts.length);

              for (let i = 0; i < wallets.length; i++) {
                assert.equal(
                  wallets[i].privateKey.toLowerCase(),
                  accounts[i].privateKey.toLowerCase()
                );
              }
            });
          });
        });
      });
    });
  });

  describe("Test environment initialization", function () {
    useEnvironment("hardhat-project", "hardhat");

    it("Should load the Waffle chai matchers", async function () {
      await this.env.run("test");
      // Mocha's exit code is the number of failed tests (up to 255).
      // We expect one failed test ("Should fail", throwing on purpose).
      assert.equal(process.exitCode, 1);
      process.exitCode = 0;
    });
  });

  const configs = [
    "default",
    "inject-history",
    "skip-gas",
    "skip-gas-inject-history",
  ];
  const projectDir = process.cwd();

  for (const config of configs) {
    describe(`Test environment initialization with ${config} config`, async function () {
      useEnvironment(`configs/${config}`, "hardhat");

      it("Should adjust to the config", async function () {
        await copy(
          `${projectDir}/test/fixture-projects/hardhat-project/contracts`,
          "./contracts",
          { recursive: true, overwrite: true }
        );
        await this.env.run("test");
        // Mocha's exit code is the number of failed tests (up to 255).
        // We expect zero failed tests.
        assert.equal(process.exitCode, 0);
      });
    });
  }
});
