import ethers from 'ethers'
import tornadoJSON from "../json/Tornado.json"

//let tornadoAddress = "0xba6168adB7157180987F6A84D8f6B0939695e690";
const tornadoInterface = new ethers.utils.Interface(tornadoJSON);

var txHash = "0xe22a14aa37d6026725b07b1c5b5b859b5a1b577ebba2d1dbb9784acb796b694f";
const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const provider = new ethers.providers.AlchemyProvider('goerli', alchemyApiKey);

async function check(){
    var receipt = await provider.getTransactionReceipt(txHash);
    console.log(receipt.logs[0])
    var log = receipt.logs[0]
    const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);
    console.log(decodedData)
}

check();
