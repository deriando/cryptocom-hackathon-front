import { ethers, providers, Signer, Contract } from "ethers";

import DirectDonationManagerFactoryInterface from "./DirectDonationManagerFactory.js";
import DirectDonationManagerInterface from "./DirectDonationManager.js";
import DirectDonationInterface from "./DirectDonation.js";

import DirectDonationManagerFactoryMeta from "../../artifacts/contracts/DDManagerFactory.sol/IDDManagerFactory.json" assert { type: "json" };
import DirectDonationManagerMeta from "../../artifacts/contracts/DDManager.sol/IDDManager.json" assert { type: "json" };
import DirectDonationMeta from "../../artifacts/contracts/DirectDonation.sol/DirectDonation.json" assert { type: "json" };
import ERC20Meta from "../../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json" assert { type: "json" };

interface EventController {
  provider: providers.Provider | null;
  caller: Signer | null;
  DDMFactoryInstance: DirectDonationManagerFactoryInterface | null;
  DDManagerInstance: DirectDonationManagerInterface | null;
  DirectDonationInstance: DirectDonationInterface | null;
}

class EventController {
  constructor() {
    this.provider = null;
    this.caller = null;

    this.DDMFactoryInstance = null;
    this.DDManagerInstance = null;
    this.DirectDonationInstance = null;
  }
  // * context-based preloading *//

  // setter getter for DDMFactory

  async setDDMFactory(
    this: EventController,
    provider = this.provider,
    caller = this.caller
  ) {
    if (this.DDMFactoryInstance === null) {
      const DirectDonationManagerFactoryInstance =
        new DirectDonationManagerFactoryInterface(
          caller as Signer,
          provider as providers.Provider
        );
      await DirectDonationManagerFactoryInstance.setContract(
        import.meta.env.VITE_DIRECT_DONATION_FACTORY_ADDR
      );
      this.DDMFactoryInstance = DirectDonationManagerFactoryInstance;
    }
  }

  async clearDDMFactory(this: EventController) {
    this.DDMFactoryInstance = null;
  }

  //setter getter for DDManager

  async setDDManager(
    this: EventController,
    managerAddress: string,
    provider = this.provider,
    caller = this.caller
  ) {
    if (this.DDManagerInstance === null) {
      const DirectDonationManagerInstance = new DirectDonationManagerInterface(
        caller as Signer,
        provider as providers.Provider
      );
      await DirectDonationManagerInstance.setContract(managerAddress);
      this.DDManagerInstance = DirectDonationManagerInstance;
    }
  }
  async clearDDManager(this: EventController) {
    this.DDMFactoryInstance = null;
  }

  //setter getter for DirectDonation

  async setDirectDonation(
    donationAddress: string,
    provider = this.provider,
    caller = this.caller
  ) {
    if (this.DirectDonationInstance === null) {
      const DirectDonationInstance = new DirectDonationInterface(
        caller as Signer,
        provider as providers.Provider
      );
      await DirectDonationInstance.setContract(donationAddress);
      this.DirectDonationInstance = DirectDonationInstance;
    }
  }
  async clearDirectDonation(this: EventController) {
    this.DDMFactoryInstance = null;
  }
}

var EventControllerSingleton = (function () {
  var instance: EventController;

  function createInstance() {
    var object = new EventController();
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export default EventControllerSingleton;

// class EventController {
//   constructor() {
//     this.provider = null;
//     this.caller = null;

//     this.DDMFactoryInstance = null;
//     this.DDManagerInstance = null;
//     this.DirectDonationInstance = null;
//   }

//   //* connecting to blockchain provider *//

//   //   this.provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_RPC);
//   //   this.caller = new ethers.Wallet(process.env.USER_ADDRESS_PVT_KEY).connect(this.provider);

//   setProvider(this: EventController, provider: providers.Provider) {
//     this.provider = provider;
//   }

//   setCaller(this: EventController, caller: Signer) {
//     this.caller = caller;
//   }

//   // * context-based preloading *//

//   // setter getter for DDMFactory

//   async setDDMFactory(
//     this: EventController,
//     provider = this.provider,
//     caller = this.caller
//   ) {
//     if (this.DDMFactoryInstance === null) {
//       const DirectDonationManagerFactoryInstance =
//         new DirectDonationManagerFactoryInterface(
//           caller as Signer,
//           provider as providers.Provider
//         );
//       await DirectDonationManagerFactoryInstance.setContract(
//         import.meta.env.VITE_DIRECT_DONATION_FACTORY_ADDR
//       );
//       this.DDMFactoryInstance = DirectDonationManagerFactoryInstance;
//     }
//   }

//   async clearDDMFactory(this: EventController) {
//     this.DDMFactoryInstance = null;
//   }

//   //setter getter for DDManager

//   async setDDManager(
//     this: EventController,
//     managerAddress: string,
//     provider = this.provider,
//     caller = this.caller
//   ) {
//     if (this.DDManagerInstance === null) {
//       const DirectDonationManagerInstance = new DirectDonationManagerInterface(
//         caller as Signer,
//         provider as providers.Provider
//       );
//       await DirectDonationManagerInstance.setContract(managerAddress);
//       this.DDManagerInstance = DirectDonationManagerInstance;
//     }
//   }
//   async clearDDManager(this: EventController) {
//     this.DDMFactoryInstance = null;
//   }

//   //setter getter for DirectDonation

//   async setDirectDonation(
//     donationAddress: string,
//     provider = this.provider,
//     caller = this.caller
//   ) {
//     if (this.DirectDonationInstance === null) {
//       const DirectDonationInstance = new DirectDonationInterface(
//         caller as Signer,
//         provider as providers.Provider
//       );
//       await DirectDonationInstance.setContract(donationAddress);
//       this.DirectDonationInstance = DirectDonationInstance;
//     }
//   }
//   async clearDirectDonation(this: EventController) {
//     this.DDMFactoryInstance = null;
//   }

//   // * First Time User Page Function //

//   async myDirectDonationManagerExist(): Promise<boolean> {
//     return await (
//       this.DDMFactoryInstance as DirectDonationManagerFactoryInterface
//     ).myDirectDonationManagerExist();
//   }

//   async getMyDirectDonationManager() {
//     const data = await (
//       this.DDMFactoryInstance as DirectDonationManagerFactoryInterface
//     ).getMyDirectDonationManager();
//     return data;
//   }

//   async createMyDirectDonationManager(callback?) {
//     const DDMFactoryJson = await DirectDonationManagerFactoryMeta;
//     const DDMFactoryIface = new ethers.utils.Interface(DDMFactoryJson.abi);

//     const tx = await (
//       this.DDMFactoryInstance as DirectDonationManagerFactoryInterface
//     ).createMyDirectDonationManager();

//     if (callback !== undefined){
//       const contract = this.DDMFactoryInstance?._directDonationManagerFactoryContract;
//       const filter = (contract as Contract).filters.LogDDManagerCreation(this.caller?.getAddress(),null);
//       (contract as Contract).once(filter,(_contractOwner,_contractAddress)=>{
//         const data ={
//           _contractOwner,
//           _contractAddress,
//         }
//         callback(data);
//       });
//     }

//     // console.log(tx);
//     // const txReciept = await tx.wait();
//     // console.log(txReciept);
//     // const txLog = txReciept.logs[2];
//     // console.log(txLog);
//     // const eventLog = DDMFactoryIface.parseLog(txLog);
//     // console.log(eventLog);
//     // return {
//     //   contractAddress: eventLog.args._contractAddress,
//     //   ownerAddress: eventLog.args._contractAddress,
//     // };
//   }

//   // * Manager Page Function //

//   async getDirectDonationList() {
//     try {
//       //console.log(this.DDManagerInstance?._directDonationManagerContract);
//       const data = await (
//         this.DDManagerInstance as DirectDonationManagerInterface
//       ).getDirectDonationList();
//       return {
//         directDonationAddresses: data,
//       };
//     } catch (e) {
//       return {
//         errorMessage: e,
//       };
//     }
//   }
//   async createDirectDonation(callback?: Function) {
//     try {
//       const DDManagerJson = await DirectDonationManagerMeta;
//       const DDManagerIface = new ethers.utils.Interface(DDManagerJson.abi);
//       const tx = await (
//         this.DDManagerInstance as DirectDonationManagerInterface
//       ).createDirectDonation();
//       console.log(tx);
//       const txReciept = await tx.wait();
//       console.log(txReciept);
//       const txLog = txReciept.logs[2];
//       console.log(txLog);
//       const eventLog = DDManagerIface.parseLog(txLog);
//       console.log(eventLog);
//       return {
//         managerAddress: eventLog.args.sender,
//         directDonationAddress: eventLog.args.key,
//       };
//     } catch (e) {
//       return {
//         errorMessage: e,
//       };
//     }
//   }
//   async removeDirectDonation(address: string, callback?: Function) {
//     try {
//       const DDManagerJson = await DirectDonationManagerMeta;
//       const DDManagerIface = new ethers.utils.Interface(DDManagerJson.abi);
//       const tx = await (
//         this.DDManagerInstance as DirectDonationManagerInterface
//       ).removeDirectDonation(address);
//       console.log(tx);
//       const txReciept = await tx.wait();
//       console.log(txReciept);
//       const txLog = txReciept.logs[0];
//       console.log(txLog);
//       const eventLog = DDManagerIface.parseLog(txLog);
//       console.log(eventLog);
//       return {
//         managerAddress: eventLog.args.sender,
//         directDonationAddress: eventLog.args.key,
//       };
//     } catch (e) {
//       return {
//         errorMessage: e,
//       };
//     }
//   }

//   // * Donation Page Functions //

//   async getCustodianFeature() {
//     const data = await (
//       this.DirectDonationInstance as DirectDonationInterface
//     ).CustodianFeature();
//     return {
//       custodianFeature: data,
//     };
//   }
//   async setCustodianFeature(state: boolean, callback?:any) {
//     const DirectDonationJson = await DirectDonationMeta;
//     const DirectDonationIface = new ethers.utils.Interface(
//       DirectDonationJson.abi
//     );

//     const tx = await (
//       this.DirectDonationInstance as DirectDonationInterface
//     ).setCustodianFeature(state);

//     // if (callback !== undefined){
//     //   const contract = this.DirectDonationInstance?._directDonationContract;
//     //   const filter = (contract as Contract).filters.LogSetCustodianFeature(null);
//     //   (contract as Contract).once(filter,callback);
//     // }
//     console.log(tx);
//     console.log(`waiting for setCusotdian Transaction to complete.`)
//     const txReciept = await tx.wait();
//     console.log(txReciept);
//     const txLog = txReciept.logs;
//     console.log(txLog);
//     const eventLog = DirectDonationIface.parseLog(txLog);
//     console.log(eventLog);
//     return {
//       process: "completed",
//     };
//   }

//   async getSupportedTokenList() {
//     const data = await (
//       this.DirectDonationInstance as DirectDonationInterface
//     ).getAcceptedERC20List();
//     return {
//       tokenAddresses: data,
//     };
//   }

//   async getERC20Symbol(this: EventController, address: string) {
//     const ERC20Token = await new ethers.Contract(
//       address,
//       ERC20Meta.abi
//     ).connect(this.provider as providers.Provider);
//     const ERC20Symbol = await ERC20Token.Symbol();
//     return {
//       tokenAddress: address,
//       tokenSymbol: ERC20Symbol,
//     };
//   }

// }
