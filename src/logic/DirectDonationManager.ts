import { ethers, Contract, providers, Signer, Transaction } from "ethers";

import DirectDonationManagerMeta from "../../artifacts/contracts/DDManager.sol/DDManager.json" assert { type: "json" };

interface DirectDonationManagerInterface {
  defaultCaller: Signer;
  defaultProvider: providers.Provider;
  _directDonationManagerContract: Contract | null;
}

class DirectDonationManagerInterface {
  constructor(defaultCaller: Signer, defaultProvider: providers.Provider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;
    this._directDonationManagerContract = null;
  }

  async setContract(
    this: DirectDonationManagerInterface,
    directDonationManagerAddress: string,
    provider = this.defaultProvider
  ) {
    const meta = await DirectDonationManagerMeta;
    this._directDonationManagerContract = await new ethers.Contract(
      directDonationManagerAddress,
      meta.abi
    ).connect(provider);
  }

  async createDirectDonation(
    this: DirectDonationManagerInterface,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .createDirectDonation();
  }

  async removeDirectDonation(
    this: DirectDonationManagerInterface,
    key: number,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .removeDirectDonation(key);
  }

  async getDirectDonationList(
    this: DirectDonationManagerInterface,
    caller = this.defaultCaller
  ): Promise<Array<string>> {
    this._isContractSet();
    //! need to test functionality of returns from contract
    return await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .getDirectDonationList();
  }

  async getDirectDonationCount(
    this: DirectDonationManagerInterface,
    caller = this.defaultCaller
  ): Promise<number> {
    this._isContractSet();
    return await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .getDirectDonationCount();
  }

  async getDirectDonationAtIndex(
    this: DirectDonationManagerInterface,
    index: number,
    caller = this.defaultCaller
  ): Promise<string> {
    this._isContractSet();
    return await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .getDirectDonationAtIndex(index);
  }

  _isContractSet = function (this: DirectDonationManagerInterface) {
    if (this._directDonationManagerContract === null)
      throw () => {
        throw new ErrorEvent(
          "Contract is not set. Use setContract function to set contract address."
        );
      };
  };
}

export default DirectDonationManagerInterface;
