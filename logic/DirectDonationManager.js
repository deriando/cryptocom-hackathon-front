import ethers from "ethers";


import DirectDonationManagerMeta from "../artifacts/contracts/DDManager.sol/DDManager.json" assert {type: 'json'};


function DirectDonationManagerInterface(defaultCaller,defaultProvider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;

    this._directDonationManagerContract = null;

    this.setContract = async function (directDonationManagerAddress, provider = this.defaultProvider){
        const meta = await DirectDonationManagerMeta;
        this._directDonationManagerContract  = await new ethers.Contract(directDonationManagerAddress,meta.abi).connect(provider);
    };

    this.createDirectDonation = async function(caller = this.caller){
        this._isContractSet();
        return await this._directDonationManagerContract.connect(caller).createDirectDonation();
    };

    this.removeDirectDonation = async function(key,caller = this.caller){
        this._isContractSet();
        return await this._directDonationManagerContract.connect(caller).removeDirectDonation(key);
    };

    this.getDirectDonationList = async function(caller = this.caller){
        this._isContractSet();
        //! need to test functionality of returns from contracct
        return await this._directDonationManagerContract.connect(caller).getDirectDonationList();
    };

    this.getDirectDonationCount = async function(caller = this.caller){
        this._isContractSet();
        return await this._DirectDonationManagerContract.connect(caller).getDirectDonationCount();
    };


    this.getDirectDonationAtIndex = async function(index, caller = this.caller){
        this._isContractSet();
        return await this._DirectDonationManagerContract.connect(caller).getDirectDonationAtIndex(index);
    };


    this._isContractSet = function(){
        if (this._directDonationManagerContract == null) throw () => {
            this.name = "ContractControllerException",
            this.message = "Contract is not set. Use setContract function to set contract address.";
        } 
    }
}


export default DirectDonationManagerInterface;
