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
    const meta = DirectDonationManagerMeta;
    this._directDonationManagerContract = await new ethers.Contract(
      directDonationManagerAddress,
      meta.abi
    ).connect(provider);
  }

  //update
  async createDirectDonation(
    this: DirectDonationManagerInterface,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .createDirectDonation();

    if (callback !== undefined) {
      const contract = this._directDonationManagerContract;
      const _contractOwner = await caller.getAddress();
      const filter = (contract as Contract).filters.LogCreateDirectDonation(
        _contractOwner,
        null
      );
      (contract as Contract).once(filter, reducer);
    }

    function reducer(_contractOwner: string, _contractAddress: string) {
      callback({
        _contractOwner,
        _contractAddress,
      });
    }

    return tx;
  }

  //update
  async removeDirectDonation(
    this: DirectDonationManagerInterface,
    key: string,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .removeDirectDonation(key);

    if (callback !== undefined) {
      const contract = this._directDonationManagerContract;
      const _contractOwner = await caller.getAddress();
      const filter = (contract as Contract).filters.LogRemoveDirectDonation(
        _contractOwner,
        null
      );
      (contract as Contract).once(filter, reducer);
    }

    function reducer(_contractOwner: string, _contractAddress: string) {
      callback({
        _contractOwner,
        _contractAddress,
      });
    }
    return tx;
  }

  //read
  async getDirectDonationList(
    this: DirectDonationManagerInterface,
    caller = this.defaultCaller
  ): Promise<Array<string>> {
    this._isContractSet();
    const data = await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .getDirectDonationList();
    return data;
  }

  //read
  async getDirectDonationCount(
    this: DirectDonationManagerInterface,
    caller = this.defaultCaller
  ): Promise<number> {
    this._isContractSet();
    return await (this._directDonationManagerContract as Contract)
      .connect(caller)
      .getDirectDonationCount();
  }

  //read
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
