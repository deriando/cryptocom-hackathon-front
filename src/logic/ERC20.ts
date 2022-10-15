import {
  ethers,
  BigNumber,
  Contract,
  providers,
  Signer,
  Transaction,
} from "ethers";

import ERC20Meta from "../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json" assert { type: "json" };

interface ERC20Interface {
  defaultCaller: Signer;
  defaultProvider: providers.Provider;
  _ERC20Contract: Contract | null;
}

class ERC20Interface {
  constructor(defaultCaller: Signer, defaultProvider: providers.Provider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;
    this._ERC20Contract = null;
  }

  async setContract(
    this: ERC20Interface,
    contractAddress: string,
    provider = this.defaultProvider
  ) {
    const meta = ERC20Meta;
    this._ERC20Contract = await new ethers.Contract(
      contractAddress,
      meta.abi
    ).connect(provider);
  }

  async symbol(
    this: ERC20Interface,
    caller = this.defaultCaller
  ): Promise<string> {
    this._isContractSet();
    return await (this._ERC20Contract as Contract).connect(caller).symbol();
  }

  async balanceOf(
    this: ERC20Interface,
    address: string,
    caller = this.defaultCaller
  ): Promise<any> {
    this._isContractSet();
    return await (this._ERC20Contract as Contract)
      .connect(caller)
      .balanceOf(address);
  }

  _isContractSet(this: ERC20Interface) {
    if (this._ERC20Contract === null)
      throw () =>
        new Error(
          "Contract is not set. Use setContract function to set contract address."
        );
  }
}

export default ERC20Interface;
