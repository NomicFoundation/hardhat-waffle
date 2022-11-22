let processRequest: any;

export function skipEstimateGas(hardhatWaffleProvider: any) {
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
        overrideProcessRequest(hardhatWaffleProvider);
      }
    };
}

function overrideProcessRequest(provider: any) {
  const curProcessRequest =
    provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule
      .processRequest;

  if (curProcessRequest !== processRequest) {
    const originalProcess =
      provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule.processRequest.bind(
        provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule
      );
    provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule.processRequest =
      (method: string, params: any[]) => {
        if (method === "eth_estimateGas") {
          return "0xB71B00";
        } else {
          return originalProcess(method, params);
        }
      };

    processRequest =
      provider._hardhatNetwork.provider._wrapped._wrapped._wrapped._ethModule
        .processRequest;
  }
}

function getHardhatVMEventEmitter(provider: any) {
  const vm =
    provider?._hardhatNetwork.provider?._wrapped._wrapped?._wrapped?._node
      ?._vmTracer?._vm;

  /**
   * There were changes related to the location of event emitter introduced
   * in Hardhat version 2.11.0.
   */
  return vm?.evm?.events ?? vm;
}
