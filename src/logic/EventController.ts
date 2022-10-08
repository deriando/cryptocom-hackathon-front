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

  //* connecting to blockchain provider *//

  //   this.provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_RPC);
  //   this.caller = new ethers.Wallet(process.env.USER_ADDRESS_PVT_KEY).connect(this.provider);

  setProvider(this: EventController, provider: providers.Provider) {
    this.provider = provider;
  }

  setCaller(this: EventController, caller: Signer) {
    this.caller = caller;
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
      DirectDonationManagerFactoryInstance.setContract(
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
      DirectDonationManagerInstance.setContract(managerAddress);
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
      DirectDonationInstance.setContract(donationAddress);
      this.DirectDonationInstance = DirectDonationInstance;
    }
  }

  async clearDirectDonation(this: EventController) {
    this.DDMFactoryInstance = null;
  }

  // * First Time User Page Function //

  async myDirectDonationManagerExist(): Promise<boolean> {
    return await (
      this.DDMFactoryInstance as DirectDonationManagerFactoryInterface
    ).myDirectDonationManagerExist();
  }

  async getMyDirectDonationManager() {
    return await (
      this.DDMFactoryInstance as DirectDonationManagerFactoryInterface
    ).getMyDirectDonationManager();
  }

  async createMyDirectDonationManager() {
    const DDMFactoryJson = await DirectDonationManagerFactoryMeta;
    const DDMFactoryIface = new ethers.utils.Interface(DDMFactoryJson.abi);

    const tx = await (
      this.DDMFactoryInstance as DirectDonationManagerFactoryInterface
    ).createMyDirectDonationManager();
    // const txReciept = tx.wait();
    // const txLog = txReciept.logs[0];
    // const eventLog = DDMFactoryIface.parseLog(txLog);
    console.log(tx);
    //! need to test for return before returning //
    // return address of DDManager
  }

  // * Manager Page Function//

  //   this.purchaseGiftCard = async (ctx) => {
  //     //getting api parameters from request body
  //     const callingFields = ctx.request.body;

  //     const giftCardAmount = callingFields.token_amount;
  //     const denorminatedTokenAddress = callingFields.peg_token_address;
  //     const userAddress = callingFields.user_address;

  //     //using private key to create wallet instance
  //     const userPrivateKey = callingFields.user_private_key;
  //     const userWallet = new ethers.Wallet(userPrivateKey).connect(this.provider);

  //     // setup interface to parse log datat
  //     const ierc777Json= await IERC777Meta;
  //     const ierc777Iface = new ethers.utils.Interface(ierc777Json.abi);

  //     const giftCardFactoryJson = await GiftCardFactoryMeta;
  //     const giftCardFactoryIface = new ethers.utils.Interface(giftCardFactoryJson.abi);

  //     // core functions //
  //     // create gift card contract
  //     const giftCardFactoryInstance = new GiftCardFactoryManager(this.caller,this.provider);
  //     await giftCardFactoryInstance.setContract(process.env.GIFTCARD_FACTORY);

  //     const createGiftCardTx = await giftCardFactoryInstance.createGiftCard(denorminatedTokenAddress);
  //     const createGiftCardTxReciept = await createGiftCardTx.wait();
  //     const createGiftCardTxLogs = createGiftCardTxReciept.logs[2];
  //     const createEventDecodeData = giftCardFactoryIface.parseLog(createGiftCardTxLogs);// .parseLog(createGiftCardTxLogs);
  //    //console.log(createEventDecodeData);
  //     const giftCardAddress = createEventDecodeData.args.giftCardAddress;
  //     //console.log(giftCardAddress);

  //     // mint to manager
  //     const pegTokenInstance = new PegTokenManager(this.caller,this.provider);
  //     await pegTokenInstance.setContract(denorminatedTokenAddress);

  //     const mintTokenToCallerTx = await pegTokenInstance.mintTokensToCaller(giftCardAmount);
  //     const mintTokenToCallerTxReciept = await mintTokenToCallerTx.wait();
  //     const mintTokenToCallerTxLogs = mintTokenToCallerTxReciept.logs[0];
  //     const mintEventDecodeData = ierc777Iface.parseLog(mintTokenToCallerTxLogs);
  //     //console.log(mintEventDecodeData);

  //     // operator send tokens to new gift card
  //     const operatorSendTokenTx = await pegTokenInstance.operatorSendTokens(this.caller.address,giftCardAddress,giftCardAmount);
  //     const operatorSendTokenTxReciept = await operatorSendTokenTx.wait();
  //     const operatorSendTokenTxLogs = operatorSendTokenTxReciept.logs[0];
  //     const sentEventDecodeData = ierc777Iface.parseLog(operatorSendTokenTxLogs);
  //     //console.log(sentEventDecodeData);

  //     // authorised new owner as operator
  //     const giftCardInstance = new GiftCardManager(this.caller,this.provider,giftCardAddress);
  //     await giftCardInstance.setContract(giftCardAddress);

  //     const authoriseOperatorTx = await giftCardInstance.authoriseOperator(userAddress);
  //     const authoriseOperatorTxReciept = await authoriseOperatorTx.wait();
  //     const authoriseOperatorTxLogs = authoriseOperatorTxReciept.logs[0];
  //     const authoriseEventDecodeData = ierc777Iface.parseLog(authoriseOperatorTxLogs);
  //     //console.log(authoriseEventDecodeData);

  //     ctx.body = {
  //       "token_amount" : giftCardAmount,
  //       "wallet_address" : userAddress,
  //       "gift_card_address": giftCardAddress,
  //       "message" : "new giftcard created and assigned to user",
  //     }
  //     ctx.status = 200;

  //   };

  //   this.transferGiftCard = async (ctx) => {
  //     //getting api parameters from request body
  //     const callingFields = ctx.request.body;
  //     const newOwnerAddress = callingFields.new_owner_address;
  //     const currentOwnerAddress  = callingFields.user_address;
  //     //using private key to create wallet instance
  //     const userPrivateKey = callingFields.user_private_key;
  //     const userWallet = new ethers.Wallet(userPrivateKey).connect(this.provider);

  //     //using giftCard address to instantiate pegTokenManager
  //     const giftCardAddress = callingFields.gift_card_address;
  //     const giftCardInstance = new GiftCardManager(this.caller,this.provider);
  //     await giftCardInstance.setContract(giftCardAddress);

  //     // setup interface to parse log data
  //     const ierc777Json= await IERC777Meta;
  //     const ierc777Iface = new ethers.utils.Interface(ierc777Json.abi);

  //     // core function calls //

  //     // get Token Peg of Giftcard to check user is the owner;
  //     const pegTokenAddress = await giftCardInstance._giftCardContract.TokenAddress();
  //     const pegTokenInstance = new PegTokenManager(this.caller,this.provider);
  //     await pegTokenInstance.setContract(pegTokenAddress);

  //     const isOperatorBool = await pegTokenInstance._currencyPegContract.isOperatorFor(currentOwnerAddress,giftCardAddress);

  //     if (isOperatorBool){
  //       //get address of tokenPeg from giftcard
  //       const authoriseOperatorTx = await giftCardInstance.authoriseOperator(newOwnerAddress);
  //       const authoriseOperatorTxReceipt = await authoriseOperatorTx.wait();
  //       const authoriseOperatorTxLogs = authoriseOperatorTxReceipt.logs[0];
  //       const authoriseEventDecodeData = ierc777Iface.parseLog(authoriseOperatorTxLogs);
  //       console.log(authoriseEventDecodeData);

  //       if (currentOwnerAddress !== newOwnerAddress){
  //         const revokeOperatorTx = await giftCardInstance.revokeOperator(currentOwnerAddress);
  //         const revokeOperatorTxReceipt = await revokeOperatorTx.wait();
  //         const revokeOperatorTxLogs = revokeOperatorTxReceipt.logs[0];
  //         const revokeEventDecodeData = ierc777Iface.parseLog(revokeOperatorTxLogs);
  //         console.log(revokeEventDecodeData);
  //       }

  //       ctx.body = {
  //         "new_owner_address" : newOwnerAddress,
  //         "gift_card_address": giftCardAddress,
  //         "message" : "gift card transferred",
  //       }
  //       ctx.status = 200;
  //     }
  //   };

  //   this.topUpGiftCard = async (ctx) => {
  //         //getting api parameters from request body
  //         const callingFields = ctx.request.body;
  //         const topUpAmount = callingFields.token_amount;
  //         const userAddress  = callingFields.user_address;
  //         //using private key to create wallet instance
  //         const userPrivateKey = callingFields.user_private_key;
  //         const userWallet = new ethers.Wallet(userPrivateKey).connect(this.provider);

  //         //using giftCard address to instantiate pegTokenManager
  //         const giftCardAddress = callingFields.gift_card_address;
  //         const giftCardInstance = new GiftCardManager(this.caller,this.provider);
  //         await giftCardInstance.setContract(giftCardAddress);

  //         // setup interface to parse log data
  //         const ierc777Json= await IERC777Meta;
  //         const ierc777Iface = new ethers.utils.Interface(ierc777Json.abi);

  //         //Core Functions//

  //         // get Token Peg of Giftcard to check user is the owner;
  //         const pegTokenAddress = await giftCardInstance._giftCardContract.TokenAddress();
  //         const pegTokenInstance = new PegTokenManager(this.caller,this.provider);
  //         await pegTokenInstance.setContract(pegTokenAddress);

  //         const isOperatorBool = await pegTokenInstance._currencyPegContract.isOperatorFor(userAddress,giftCardAddress);

  //         if( isOperatorBool){
  //           //mint new token
  //           const mintTokenToCallerTx = await pegTokenInstance.mintTokensToCaller(topUpAmount);
  //           const mintTokenToCallerTxReciept = await mintTokenToCallerTx.wait();
  //           const mintTokenToCallerTxLogs = mintTokenToCallerTxReciept.logs[0];
  //           const mintEventDecodeData = ierc777Iface.parseLog(mintTokenToCallerTxLogs);
  //           console.log(mintEventDecodeData);

  //           //send tokens to top up gift card
  //           const operatorSendTokenTx = await pegTokenInstance.operatorSendTokens(this.caller.address,giftCardAddress,topUpAmount);
  //           const operatorSendTokenTxReciept = await operatorSendTokenTx.wait();
  //           const operatorSendTokenTxLogs = operatorSendTokenTxReciept.logs[0];
  //           const sentEventDecodeData = ierc777Iface.parseLog(operatorSendTokenTxLogs);
  //           console.log(sentEventDecodeData);

  //           ctx.body = {
  //             "token_amount" : topUpAmount,
  //             "gift_card_address": giftCardAddress,
  //             "message" : "gift card topupped",
  //           }
  //           ctx.status = 200;

  //         }

  //   };

  //   this.spendGiftCard = async (ctx) => {
  //     //getting api parameters from request body
  //     const callingFields = ctx.request.body;
  //     const transferAmount = callingFields.token_amount;
  //     const userAddress  = callingFields.user_address;
  //     const recipentAddress = callingFields.recipent_address;
  //     //using private key to create wallet instance
  //     const userPrivateKey = callingFields.user_private_key;
  //     const userWallet = new ethers.Wallet(userPrivateKey).connect(this.provider);

  //     //using giftCard address to instantiate pegTokenManager
  //     const giftCardAddress = callingFields.gift_card_address;
  //     const giftCardInstance = new GiftCardManager(this.caller,this.provider);
  //     await giftCardInstance.setContract(giftCardAddress);

  //     // setup interface to parse log data
  //     const ierc777Json= await IERC777Meta;
  //     const ierc777Iface = new ethers.utils.Interface(ierc777Json.abi);

  //     //Core Functions//

  //     // get Token Peg of Giftcard to check user is the owner;
  //     const pegTokenAddress = await giftCardInstance._giftCardContract.TokenAddress();
  //     const pegTokenInstance = new PegTokenManager(this.caller,this.provider);
  //     await pegTokenInstance.setContract(pegTokenAddress);

  //     const isOperatorBool = await pegTokenInstance._currencyPegContract.isOperatorFor(userAddress,giftCardAddress);

  //     if(isOperatorBool) {
  //         // transfer token from gift card to address token value
  //         const operatorSendTokenTx = await pegTokenInstance.operatorSendTokens(giftCardAddress,recipentAddress,transferAmount);
  //         const operatorSendTokenTxReciept = await operatorSendTokenTx.wait();
  //         const operatorSendTokenTxLogs = operatorSendTokenTxReciept.logs[0];
  //         const sentEventDecodeData = ierc777Iface.parseLog(operatorSendTokenTxLogs);
  //         console.log(sentEventDecodeData);

  //         ctx.body = {
  //           "token_amount" : transferAmount,
  //           "gift_card_address": giftCardAddress,
  //           "recipent_address": giftCardAddress,
  //           "message" : "gift card's value spent",
  //         }
  //         ctx.status = 200;
  //     }

  //   };

  //   this.createWallet = (ctx) => {
  //     // All createRandom Wallets are generated from random mnemonics
  //     let wallet = createNewWallet(this.provider);
  //     ctx.body = {
  //       "mnemonic" : wallet.mnemonic,
  //       "address" : wallet.address,
  //       "public_key" : wallet.publicKey,
  //       "private_key" : wallet.privateKey

  //     }
  //     ctx.status = 200;

  //   };
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
