import ethers, { Contract, providers, Signer, Transaction } from "ethers";
import DirectDonationManagerFactoryMeta from "../../artifacts/contracts/DDManagerFactory.sol/DDManagerFactory.json" assert {type: 'json'};


interface DirectDonationManagerFactoryInterface{
    defaultCaller: Signer, 
    defaultProvider: providers.Provider, 
    _directDonationManagerFactoryContract: Contract | null, 
}

class DirectDonationManagerFactoryInterface{
    constructor(defaultCaller : Signer ,defaultProvider : providers.Provider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;
    this._directDonationManagerFactoryContract = null;
    }

    setContract = async function (this: DirectDonationManagerFactoryInterface, directDonationManagerFactoryAddress : string, provider = this.defaultProvider){
        const meta = await DirectDonationManagerFactoryMeta;
        this._directDonationManagerFactoryContract  = await new ethers.Contract(directDonationManagerFactoryAddress,meta.abi).connect(provider);
    };

    async myDirectDonationManagerExist(this: DirectDonationManagerFactoryInterface, caller= this.defaultCaller):Promise<boolean>{
        this._isContractSet();
        return await (this._directDonationManagerFactoryContract as Contract).connect(caller).myDDManagerExist();
    }

    async getMyDirectDonationManager(this: DirectDonationManagerFactoryInterface, caller = this.defaultCaller):Promise<string>{
        this._isContractSet();
        return await (this._directDonationManagerFactoryContract as Contract).connect(caller).getMyDDManager();    
    }

    async createMyDirectDonationManager(this: DirectDonationManagerFactoryInterface, caller = this.defaultCaller):Promise<Transaction>{
        this._isContractSet();
        return await (this._directDonationManagerFactoryContract as Contract).connect(caller).createMyDDManger();
    }

    _isContractSet = function(this: DirectDonationManagerFactoryInterface ){
        if (this._directDonationManagerFactoryContract == null) {
            throw new ErrorEvent("Contract is not set. Use setContract function to set contract address.");
        }
    }

}


export default DirectDonationManagerFactoryInterface;
