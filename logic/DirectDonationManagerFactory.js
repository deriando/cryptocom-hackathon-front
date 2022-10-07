import ethers from "ethers";


import DirectDonationManagerFactoryMeta from "../artifacts/contracts/DDManagerFactory.sol/DDManagerFactory.json" assert {type: 'json'};


function DirectDonationManagerFactoryInterface(defaultCaller,defaultProvider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;

    this._directDonationManagerFactoryContract = null;

    this.setContract = async function (directDonationManagerFactoryAddress, provider = this.defaultProvider){
        const meta = await DirectDonationManagerFactoryMeta;
        this._directDonationManagerFactoryContract  = await new ethers.Contract(directDonationManagerFactoryAddress,meta.abi).connect(provider);
    };

    this.myDirectDonationManagerExist= async function(caller = this.caller){
        this._isContractSet();
        return await this._directDonationManagerFactoryContract.connect(caller).myDDManagerExist();
    }

    this.getMyDirectDonationManager = async function(caller = this.caller){
        this._isContractSet();
        return await this._directDonationManagerFactoryContract.connect(caller).getMyDDManager();    
    }

    this.createMyDirectDonationManager = async function(caller = this.caller){
        this._isContractSet();
        return await this._directDonationManagerFactoryContract.connect(caller).createMyDDManger();
    }

    this._isContractSet = function(){
        if (this._directDonationManagerFactoryContract == null) throw () => {
            this.name = "ContractControllerException",
            this.message = "Contract is not set. Use setContract function to set contract address.";
        } 
    }
}


export default DirectDonationManagerFactoryInterface;
