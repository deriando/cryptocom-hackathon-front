import { ThemeProviderProps } from "@emotion/react";
import {
  ethers,
  BigNumber,
  Contract,
  providers,
  Signer,
  Transaction,
} from "ethers";

import DirectDonationMeta from "../../artifacts/contracts/DirectDonation.sol/DirectDonation.json" assert { type: "json" };

interface DirectDonationInterface {
  defaultCaller: Signer;
  defaultProvider: providers.Provider;
  _directDonationContract: Contract | null;
}

class DirectDonationInterface {
  constructor(defaultCaller: Signer, defaultProvider: providers.Provider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;
    this._directDonationContract = null;
  }

  async setContract(
    this: DirectDonationInterface,
    directDonationAddress: string,
    provider = this.defaultProvider
  ) {
    const meta = await DirectDonationMeta;
    this._directDonationContract = await new ethers.Contract(
      directDonationAddress,
      meta.abi
    ).connect(provider);
  }

  async createAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    percent: number,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    const unsignedPercentCount = Math.floor((percent / 100) * 1000000000);
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .createAllocation(walletAddress, unsignedPercentCount);
  }

  async addAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    percent: number,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    const unsignedPercentCount = Math.floor((percent / 100) * 1000000000);
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .addAllocation(walletAddress, unsignedPercentCount);
  }

  async substractAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    percent: number,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    const unsignedPercentCount = Math.floor((percent / 100) * 1000000000);
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .subtractAllocation(walletAddress, unsignedPercentCount);
  }

  async getAllocationSum(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<BigNumber> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .getAllocationSum();
  }

  async removeAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .removeAllocation(walletAddress);
  }

  async getWalletList(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<Array<string>> {
    this._isContractSet();
    //! need to test functionality of returns from contracct
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .getWalletList();
  }

  async setAcceptedERC20(
    this: DirectDonationInterface,
    tokenAddress: string,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .setAcceptedERC20(tokenAddress);
  }

  async deleteAcceptedERC20(
    this: DirectDonationInterface,
    tokenAddress: string,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .deleteAcceptedERC20(tokenAddress);
  }

  async getAcceptedERC20List(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    //! need to test functionality of returns from contracct
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .getAcceptedERC20List();
  }

  async CustodianFeature(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<boolean> {
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .CustodianFeature();
  }

  async setCustodianFeature(
    this: DirectDonationInterface,
    switchBool: boolean,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .setCustodianFeature(switchBool);
  }

  async donate(
    this: DirectDonationInterface,
    UnitAmount: number,
    tokenAddress?: string
  ): Promise<Transaction>;
  async donate(
    this: DirectDonationInterface,
    UnitAmount: number,
    tokenAddress: string,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    if (tokenAddress !== null) {
      return await (this._directDonationContract as Contract)
        .connect(caller)
        .donate(tokenAddress, UnitAmount);
    }
    //! need to test functionality of returns from contracct
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .donate({
        value: ethers.utils.parseUnits(String(UnitAmount), "wei"),
      });
  }

  async payoutContractBalance(
    this: DirectDonationInterface,
    subSetAmount: number,
    tokenAddress?: string
  ): Promise<Transaction>;
  async payoutContractBalance(
    this: DirectDonationInterface,
    subSetAmount: number,
    tokenAddress: string,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    if (tokenAddress !== null) {
      return await (this._directDonationContract as Contract)
        .connect(caller)
        .payoutContractBalance(tokenAddress, subSetAmount);
    }
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .payoutContractBalance(subSetAmount);
  }

  async payoutAllContractBalance(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .payoutAllContractBalance();
  }

  async withdrawContractBalance(
    this: DirectDonationInterface,
    tokenAddress?: string
  ): Promise<Transaction>;
  async withdrawContractBalance(
    this: DirectDonationInterface,
    tokenAddress: string,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    if (tokenAddress != null) {
      return await (this._directDonationContract as Contract)
        .connect(caller)
        .withdrawContractBalance(tokenAddress);
    }
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .withdrawContractBalance();
  }

  async withdrawAllContractBalance(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .withdrawAllContractBalance();
  }

  async destory(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<Transaction> {
    this._isContractSet();
    return await (this._directDonationContract as Contract)
      .connect(caller)
      .destory();
  }

  _isContractSet(this: DirectDonationInterface) {
    if (this._directDonationContract === null)
      throw () =>
        new Error(
          "Contract is not set. Use setContract function to set contract address."
        );
  }
}

export default DirectDonationInterface;
