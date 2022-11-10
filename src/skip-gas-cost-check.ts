let processRequest: any;

export function skipGasCostCheck(provider: any) {
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

export function getHardhatVMEventEmitter(provider: any) {
  const vm =
    provider?._hardhatNetwork.provider?._wrapped._wrapped?._wrapped?._node
      ?._vmTracer?._vm;

  /**
   * There were changes related to the location of event emitter introduced
   * in Hardhat version 2.11.0.
   */
  return vm?.evm?.events ?? vm;
}
