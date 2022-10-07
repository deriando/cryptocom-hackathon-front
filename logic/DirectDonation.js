import ethers from "ethers";


import DirectDonationMeta from "../artifacts/contracts/DirectDonation.sol/DirectDonation.json" assert {type: 'json'};


function DirectDonationInterface(defaultCaller,defaultProvider) {
    this.defaultCaller = defaultCaller;
    this.defaultProvider = defaultProvider;

    this._directDonationContract = null;

    this.setContract = async function (directDonationAddress, provider = this.defaultProvider){
        const meta = await DirectDonationMeta;
        this._directDonationContract  = await new ethers.Contract(directDonationAddress,meta.abi).connect(provider);
    };

    this.createAllocation = async function(walletAddress, percent, caller = this.defaultCaller){
        this._isContractSet();
        const unsignedPercentCount = Math.floor((percent/100) * 1000000000);
        return await this._directDonationContract.connect(caller).createAllocation(walletAddress,unsignedPercentCount);
    };

    this.addAllocation = async function(walletAddress, percent, caller =this.defualtCaller){
        this._isContractSet();
        const unsignedPercentCount = Math.floor((percent/100) * 1000000000);
        return await this._directDonationContract.connect(caller).addAllocation(walletAddress,unsignedPercentCount);
    };
    
    this.substractAllocation = async function(walletAddress, percent, caller = this.defaultCaller){
        this._isContractSet();
        const unsignedPercentCount = Math.floor((percent/100) * 1000000000);
        return await this._directDonationContract.connect(caller).subtractAllocation(walletAddress,unsignedPercentCount);
    };

    this.getAllocationSum = async function(caller=this.defaultCaller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).getAllocationSum();
    };

    this.removeAllocation= async function(walletAddress,caller = this.defaultCaller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).removeAllocation(walletAddress);
    };

    this.getWalletList = async function(caller = this.defaultCaller){
        this._isContractSet();
        //! need to test functionality of returns from contracct
        return await this._directDonationContract.connect(caller).getWalletList();
    };

    this.setAcceptedERC20 = async function( tokenAddress, caller = this.defaultCaller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).setAcceptedERC20(tokenAddress);
    };

    this.deleteAcceptedERC20 = async function( tokenAddress, caller = this.defaultCaller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).deleteAcceptedERC20(tokenAddress);
    }

    this.getAcceptedERC20List = async function(caller = this.caller){
        this._isContractSet();
        //! need to test functionality of returns from contracct
        return await this._directDonationContract.connect(caller).getAcceptedERC20List();
    };

    this.setCustodianFeature = async function(switchBool, caller = this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).setCustodianFeature(switchBool);
    };

    this.donate = async function(donationInWei,caller=this.caller){
        this._isContractSet();
        //! need to test functionality of returns from contracct
        return await this._directDonationContract.connect(caller).donate({
            value: ethers.utils.parseUnits(String(donationInWei),"wei")
          });
    }; 
    
    this.donate = async function(tokenAddress,donationTokenDecimal,caller=this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).donate(tokenAddress,donationTokenDecimal);
    };

    this.payoutContractBalance = async function(subSetAmount, caller=this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).payoutContractBalance(subSetAmount);
    };

    this.payoutContractBalance = async function(tokenAddress,subSetAmount, caller=this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).payoutContractBalance(tokenAddress,subSetAmount);
    };

    this.payoutAllContractBalance =async function(caller=this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).payoutAllContractBalance();
    };

    this.withdrawContractBalance = async function(caller=this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).withdrawContractBalance();
    };

    this.withdrawContractBalance = async function (tokenAddress,caller=this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).withdrawContractBalance(tokenAddress);
    };

    this.withdrawAllContractBalance = async function (caller=this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).withdrawAllContractBalance();
    }

    this.destory = async function destory(caller = this.caller){
        this._isContractSet();
        return await this._directDonationContract.connect(caller).destory();
    }

    this._isContractSet = function(){
        if (this._directDonationContract == null) throw () => {
            this.name = "ContractControllerException",
            this.message = "Contract is not set. Use setContract function to set contract address.";
        } 
    }
}


export default DirectDonationInterface;
