import { Account } from '@/types/types.js';
import { tornadoAddress, tornadoInterface } from '@/utils/contracts';
import utils from '@/utils/utils';
import { ethers } from 'ethers';
import React, { useState } from 'react';
import wc from '../circuit/witness_calculator.js'
import Spinner from './ui/Spinner';

interface IDepositProps {
    account: Account
}

const Deposit: React.FunctionComponent<IDepositProps> = ({account}) => {

    const [proofElements, updateProofElements] = useState(''); 
    const [error, setError] = useState({message: null})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [ETHAmount, setETHAmount] = useState<number>(0.1)

    const depositEther = async () => {

        if (!canDeposit) return

        //updateDepositButtonState(ButtonState.Disabled);
        setIsLoading(true)

        const secret = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
        const nullifier = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();

        const input = {
            secret: utils.BN256ToBin(secret).split(""),
            nullifier: utils.BN256ToBin(nullifier).split("")
        };

        var res = await fetch("/deposit.wasm");
        var buffer = await res.arrayBuffer();
        var depositwc = await wc(buffer); 
        const r = await depositwc.calculateWitness(input, 0);

        const commitment = r[1];
        const bigNumber = ethers.BigNumber.from(commitment);
        const uint256Value = ethers.utils.hexZeroPad(bigNumber.toHexString(), 32); 
        const nullifierHash = r[2];
        const value = ethers.BigNumber.from("10000000000000000").toHexString();
        try{
            if (account) {
                const tx = {
                    to: tornadoAddress,
                    from: account.address,
                    value: value,
                    data: tornadoInterface.encodeFunctionData("deposit", [uint256Value])
                };
                
                // const alchemyApiKey = '';
                // const provider = new ethers.providers.AlchemyProvider('goerli', alchemyApiKey);
                // const privkey = ''
                // const signer = new ethers.Wallet(privkey, provider);
                // const transactionResponse = await signer.sendTransaction(tx);
                // const transactionReceipt = await transactionResponse.wait();
                // console.log(transactionReceipt)
                const txHash = await (window as any).ethereum.request({ method: "eth_sendTransaction", params: [tx] });
                const proofElements = {
                    nullifierHash: `${nullifierHash}`,
                    secret: secret,
                    nullifier: nullifier,
                    commitment: `${commitment}`,
                    txHash: txHash
                };
                // const proofElementsString = JSON.stringify(proofElements); // Convert the object to a JSON string
                // const proofElementsBuffer = Buffer.from(proofElementsString, 'utf-8'); // Convert the string to a buffer using utf-8 encoding
                // const proofElementsBase64 = proofElementsBuffer.toString('base64'); 
                // updateProofElements(proofElementsBase64)
                const btoa = (text: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) => Buffer.from(text, 'binary').toString('base64');
                updateProofElements(btoa(JSON.stringify(proofElements)))

                setIsLoading(false)
            }
        } catch(e){
            console.log(e);
            setIsLoading(false)
        }
    }

    let canDeposit = !!account 

    const [isCopied, setIsCopied] = useState(false);

    async function copyTextToClipboard(text: string) {
      if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
      } else {
        return document.execCommand('copy', true, text);
      }
    }
  
    // onClick handler function for the copy button
    const handleCopyClick = (text: string) => {
      // Asynchronously call copyTextToClipboard
      copyTextToClipboard(text)
        .then(() => {
          // If successful, update the isCopied state value
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }

  return (
    <>
    <p className="text-lg py-3">Token</p>
    <input 
        value={"ETH"}
        onChange={() => console.log()}
        className="w-full inline-flex items-start justify-start py-2 pl-4 bg-white bg-opacity-0 shadow-inner border rounded border-gray-700"/>

    <p className="py-6 text-lg">Amount</p>

    <div className="flex">
        <p>All deposits are 0.01 ETH</p>
        {/* <div className="inline-flex flex-col space-y-4 items-center justify-start px-6 pb-1">
        <input
            type="radio"
            name="ethAmount" 
            onChange={(e) => setETHAmount(parseFloat(e.target.value))}
            value={0.1}
            className="w-4 h-4 rounded focus:ring-gray-700 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
            />
            <p className="text-md font-bold text-center text-green-200">0.01 ETH</p>
        </div> */}
        {/* <div className="inline-flex flex-col space-y-4 items-center justify-start w-1/4 h-full pr-8 pb-1">
        <input
            type="radio"
            name="ethAmount" 
            onChange={(e) => setETHAmount(parseFloat(e.target.value))}
            value={1}
            className="w-4 h-4 rounded focus:ring-gray-700 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
                />
            <p className="text-md font-bold text-center text-gray-100">1 ETH</p>
        </div> */}
        {/* <div className="inline-flex flex-col space-y-4 items-center justify-start w-1/4 h-full pr-7 pb-1 relative">
        <input
            type="radio"
            name="ethAmount" 
            onChange={(e) => setETHAmount(parseFloat(e.target.value))}
            value={10}
            className="w-4 h-4 rounded focus:ring-gray-700 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
                />
            <div className="w-[22rem] h-0.5 bg-green-200 absolute mr-20 -top-2 -z-10"/>
            <p className="text-md font-bold text-center text-gray-100">10 ETH</p>
        </div> */}
        {/* <div className="flex items-start justify-start">
            <div className="inline-flex flex-col space-y-4 items-center justify-start px-6 pb-1">
            <input
                onChange={(e) => setETHAmount(parseFloat(e.target.value))}
                value={100}
                type="radio"
                name="ethAmount" 
                className="w-4 h-4 rounded focus:ring-gray-700 ring-offset-gray-700 focus:ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
                />
                <p className="text-md font-bold text-center text-gray-100">100 ETH</p>
            </div>
        </div> */}
    </div>

    {proofElements &&
    <>
    <p className='truncate mt-6'>
        <span className='text-sm font-semibold'>Secret: </span>
        <span className='text-sm text-gray-300 cursor-copy' onClick={() => handleCopyClick(proofElements)}>{proofElements}</span>
    </p>
    {isCopied && <p className='text-center text-sm pt-2'>Copied!</p>}
    </>
    }


        <button 
            onClick={depositEther}
            className={canDeposit ? "inline-flex justify-center pt-2 pb-2.5 bg-green-200 rounded mt-8 w-full cursor-pointer" :
            "inline-flex justify-center pt-2 pb-2.5 bg-gray-400 rounded mt-8 w-full cursor-not-allowed"}>
            <p className="text-sm font-bold leading-tight text-center text-black">
                {isLoading ?
                <Spinner />
            : "Deposit"}
            </p>
        </button>
    </>
  );
};

export default Deposit;
