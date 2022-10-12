import { Listener } from "@remix-run/router/dist/history";
import { ethers, Contract, providers, Signer, Transaction } from "ethers";
import DirectDonationManagerFactoryMeta from "../../artifacts/contracts/DDManagerFactory.sol/IDDManagerFactory.json" assert { type: "json" };

interface DirectDonationManagerFactoryInterface {
  defaultCaller: Signer;
  defaultProvider: providers.Provider;
  _directDonationManagerFactoryContract: Contract | null;
}

class DirectDonationManagerFactoryInterface {
  constructor(defaultCaller: Signer, defaultProvider: providers.Provider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;
    this._directDonationManagerFactoryContract = null;
  }

  async setContract(
    this: DirectDonationManagerFactoryInterface,
    directDonationManagerFactoryAddress: string,
    provider = this.defaultProvider
  ) {
    const meta = DirectDonationManagerFactoryMeta;
    this._directDonationManagerFactoryContract = await new ethers.Contract(
      directDonationManagerFactoryAddress,
      meta.abi
    ).connect(provider);
  }

  //read
  async myDirectDonationManagerExist(
    this: DirectDonationManagerFactoryInterface,
    caller = this.defaultCaller
  ): Promise<boolean> {
    this._isContractSet();
    return await (this._directDonationManagerFactoryContract as Contract)
      .connect(caller)
      .myDDManagerExist();
  }

  //read
  async getMyDirectDonationManager(
    this: DirectDonationManagerFactoryInterface,
    caller = this.defaultCaller
  ): Promise<string> {
    this._isContractSet();
    return await (this._directDonationManagerFactoryContract as Contract)
      .connect(caller)
      .getMyDDManager();
  }

  //update
  async createMyDirectDonationManager(
    this: DirectDonationManagerFactoryInterface,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<void> {
    this._isContractSet();
    console.log(this._directDonationManagerFactoryContract);

    if (this._directDonationManagerFactoryContract !== null) {
      await (this._directDonationManagerFactoryContract as Contract)
        .connect(caller)
        .createMyDDManager();

      if (callback !== undefined) {
        const contract = this._directDonationManagerFactoryContract;
        const _contractOwner = await caller.getAddress();
        const filter = (contract as Contract).filters.LogDDManagerCreation(
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
    }
  }

  _isContractSet = function (this: DirectDonationManagerFactoryInterface) {
    if (this._directDonationManagerFactoryContract === null) {
      throw new ErrorEvent(
        "Contract is not set. Use setContract function to set contract address."
      );
    }
  };
}

export default DirectDonationManagerFactoryInterface;
