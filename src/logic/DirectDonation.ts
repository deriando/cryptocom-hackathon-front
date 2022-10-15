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
    const meta = DirectDonationMeta;
    this._directDonationContract = await new ethers.Contract(
      directDonationAddress,
      meta.abi
    ).connect(provider);
  }

  async createAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    percent: number,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const unsignedPercentCount = Math.floor((percent / 100) * 1000000000);
    const tx = (this._directDonationContract as Contract)
      .connect(caller)
      .createAllocation(walletAddress, unsignedPercentCount);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogCreateAllocation(walletAddress, null);
    contract.once(filter, reducer);
    return tx;

    function reducer(_walletAddress: string, _percentCount: number) {
      const unsignedPercentCount = (_percentCount / 1000000000) * 100;
      callback({
        walletAddress: _walletAddress,
        unsignedPercentCount,
      });
    }
  }

  async addAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    percent: number,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const unsignedPercentCount = Math.floor((percent / 100) * 1000000000);
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      .addAllocation(walletAddress, unsignedPercentCount);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogAddAllocation(walletAddress, null);
    contract.once(filter, reducer);

    function reducer(_walletAddress: string, _percentCount: number) {
      callback({
        walletAddress: _walletAddress,
        percentCount: _percentCount,
      });
    }
    return tx;
  }

  async substractAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    percent: number,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const unsignedPercentCount = Math.floor((percent / 100) * 1000000000);
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      .subtractAllocation(walletAddress, unsignedPercentCount);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogSubtractAllocation(walletAddress, null);
    contract.once(filter, reducer);

    function reducer(_walletAddress: string, _percentCount: number) {
      callback({
        walletAddress: _walletAddress,
        percentCount: _percentCount,
      });
    }
    return tx;
  }

  async getAllocationValue(
    this: DirectDonationInterface,
    walletAddress: string,
    caller = this.defaultCaller
  ): Promise<number> {
    const unsignedPercentCount = await (
      this._directDonationContract as Contract
    )
      .connect(caller)
      .getAllocationValue(walletAddress);
    return (unsignedPercentCount / 1000000000) * 100;
  }

  async getAllocationSum(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<number> {
    this._isContractSet();
    const unsignedPercentCount = await (
      this._directDonationContract as Contract
    )
      .connect(caller)
      .getAllocationSum();
    return (unsignedPercentCount / 1000000000) * 100;
  }

  async removeAllocation(
    this: DirectDonationInterface,
    walletAddress: string,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      .removeAllocation(walletAddress);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogRemoveAllocation(walletAddress);
    contract.once(filter, reducer);

    function reducer(_walletAddress: string) {
      callback({
        walletAddress: _walletAddress,
      });
    }
    return tx;
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
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      .setAcceptedERC20(tokenAddress);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogSetAcceptedERC20(null);
    contract.once(filter, reducer);

    function reducer(tokenAddress: string) {
      console.log(tokenAddress);
      callback({
        tokenAddress,
      });
    }
  }

  async deleteAcceptedERC20(
    this: DirectDonationInterface,
    tokenAddress: string,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    console.log(caller);
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      .deleteAcceptedERC20(tokenAddress);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogDeleteAcceptedERC20(null);
    contract.once(filter, reducer);

    function reducer(tokenAddress: string) {
      console.log(tokenAddress);
      callback({
        tokenAddress,
      });
    }
  }

  async getAcceptedERC20List(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<string[]> {
    this._isContractSet();
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
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      .setCustodianFeature(switchBool);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogSetCustodianFeature(null);
    contract.once(filter, reducer);

    function reducer(state: boolean) {
      callback({
        state,
      });
    }
    return tx;
  }

  async donateEther(
    this: DirectDonationInterface,
    UnitAmount: BigNumber,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      ["donate()"]({
        value: ethers.utils.parseUnits(String(UnitAmount), "wei"),
      });

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogEtherDonation(null);
    contract.once(filter, reducer);

    function reducer(sum: number) {
      callback({
        sum,
      });
    }
    return tx;
  }

  async donateToken(
    this: DirectDonationInterface,
    tokenAddress: string,
    UnitAmount: BigNumber,
    callback: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();

    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      ["donate(address,uint256)"](tokenAddress, UnitAmount);

    if (callback === undefined) return tx;
    const contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogERC20Donation(null);
    contract.once(filter, reducer);

    function reducer(tokenAddress: string, sum: number) {
      callback({
        tokenAddress,
        sum,
      });
    }
    return tx;
  }

  async payoutTokenContractBalance(
    this: DirectDonationInterface,
    subSetAmount: number,
    tokenAddress: string,
    callback?: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      ["payoutContractBalance(address,uint256)"](tokenAddress, subSetAmount);
    if (callback === undefined) return tx;
    const contract: Contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogERC20Payout(tokenAddress, null);
    contract.once(filter, ERC20Reducer);

    function ERC20Reducer(tokenAddress: string, sum: number) {
      if (callback === undefined) return;
      callback({
        sum,
        tokenAddress,
      });
    }
    return tx;
  }

  async payoutEtherContractBalance(
    this: DirectDonationInterface,
    subSetAmount: number,
    callback?: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();

    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      ["payoutContractBalance(uint256)"](subSetAmount);
    if (callback === undefined) return tx;
    const contract: Contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogEtherPayout(null);
    contract.once(filter, EtherReducer);

    function EtherReducer(sum: number) {
      if (callback === undefined) return;
      callback({
        sum,
      });
    }

    return tx;
  }

  async payoutAllContractBalance(
    this: DirectDonationInterface,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      .payoutAllContractBalance();
  }

  async withdrawTokenContractBalance(
    this: DirectDonationInterface,
    tokenAddress: string,
    callback?: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      ["withdrawContractBalance(address)"](tokenAddress);

    if (callback === undefined) return tx;
    const contract: Contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogERC20Withdrawal(
      tokenAddress,
      await caller.getAddress(),
      null
    );
    contract.once(filter, ERC20Reducer);

    function ERC20Reducer(
      tokenAdrress: string,
      recipentAddress: string,
      sum: number
    ) {
      if (callback === undefined) return;
      callback({
        tokenAddress,
        recipentAddress,
        sum,
      });
    }
    return tx;
  }

  async withdrawEtherContractBalance(
    this: DirectDonationInterface,
    callback?: providers.Listener,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();

    const tx = await (this._directDonationContract as Contract)
      .connect(caller)
      ["withdrawContractBalance()"]();
    if (callback === undefined) return tx;
    const contract: Contract = this._directDonationContract as Contract;
    const filter = contract.filters.LogEtherWithdrawal(
      await caller.getAddress(),
      null
    );
    contract.once(filter, EtherReducer);

    function EtherReducer(recipentAddress: string, sum: number) {
      if (callback === undefined) return;
      callback({
        recipentAddress,
        sum,
      });
    }

    return tx;
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
