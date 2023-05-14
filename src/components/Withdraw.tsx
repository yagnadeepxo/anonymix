import { Account } from '@/types/types';
import { tornadoAddress, tornadoInterface } from '@/utils/contracts';
import utils from '@/utils/utils';
import * as React from 'react';
import { useState } from 'react';
import Spinner from './ui/Spinner';

interface IWithdrawProps {
    account: Account
}

const Withdraw: React.FunctionComponent<IWithdrawProps> = ({account}) => {

    const [inputValue, setInputValue] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [withdrawSuccess, updateWithdrawSuccess] = useState(false);
    const [error, setError] = useState({message: null})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const withdraw = async () => {
        if (!canWithdraw) return
        
        setError({message: null})

        try{
            if (account) {

                setIsLoading(true)

                const Snarkjs: any = (window as any)['snarkjs'];
                const atob = (base64: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }) => Buffer.from(base64, 'base64').toString('binary');
                const input = JSON.parse(atob(inputValue))
        
                var receipt = await (window as any).ethereum.request({ method: "eth_getTransactionReceipt", params: [input.txHash] });

                const log = receipt.logs[0];
                
                const decodedData = tornadoInterface.decodeEventLog("Deposit", log.data, log.topics);

                const proofInput = await {
                    "root": utils.BNToDecimal(decodedData.root),
                    "nullifierHash": input.nullifierHash,
                    "recipient": utils.BNToDecimal(account.address),
                    "secret": utils.BN256ToBin(input.secret).split(""),
                    "nullifier": utils.BN256ToBin(input.nullifier).split(""),
                    "hashPairings": decodedData.hashPairings.map((n: string) => (utils.BNToDecimal(n))),
                    "hashDirections": decodedData.pairDirection
                };
                
                const { proof, publicSignals } = await Snarkjs.groth16.fullProve(proofInput, "/withdraw.wasm", "/setup_final.zkey");
                
                const callInputs = [
                    proof.pi_a.slice(0, 2).map(utils.BN256ToHex),
                    proof.pi_b.slice(0, 2).map((row: { map: (arg0: (n: number) => string) => number[]; }) => (utils.reverseCoordinate(row.map(utils.BN256ToHex)))),
                    proof.pi_c.slice(0, 2).map(utils.BN256ToHex),
                    publicSignals.slice(0, 2).map(utils.BN256ToHex)
                ];
        
                const callData = tornadoInterface.encodeFunctionData("withdraw", callInputs);
                const tx = {
                    to: tornadoAddress,
                    from: account.address,
                    data: callData
                };


                const txHash = await (window as any).ethereum.request({ method: "eth_sendTransaction", params: [tx] });
                var final_res;
                while(!final_res){
                    final_res = await (window as any).ethereum.request({ method: "eth_getTransactionReceipt", params: [txHash] });
                    await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
                }
                if(final_res){
                    updateWithdrawSuccess(true);
                }
                setIsLoading(false)
            }
        } catch(e: any){
            console.log(e)
            setError(e)
            setIsLoading(false)
        }
    }

    let canWithdraw = !!account && inputValue.length > 0

    return (
        <>
        <p className="text-lg py-3">Base64 Secret</p>
        <input 
        placeholder="Enter Base64 secret"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        className="w-full inline-flex items-start justify-start py-2 pl-4 bg-white bg-opacity-0 shadow-inner border rounded border-gray-700"/>
    
    
        <p className="py-6 text-lg">Recipient</p>
    
        <input 
        placeholder='Please paste address here'
        value={account?.address}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full inline-flex items-start justify-start py-2 pl-4 bg-white bg-opacity-0 shadow-inner border rounded border-gray-700"/>

        {error.message &&
            <p className='pt-4 text-red-400'>
            Error: {error?.message}
            </p>
        }
        {withdrawSuccess &&
        <p className='pt-3'>Withdrawal Successful</p>}
        <button 
            onClick={withdraw}
            className={canWithdraw ? "inline-flex justify-center pt-2 pb-2.5 bg-green-200 rounded mt-8 w-full cursor-pointer" :
            "inline-flex justify-center pt-2 pb-2.5 bg-gray-400 rounded mt-8 w-full cursor-not-allowed"}>
            <div className="text-sm font-bold leading-tight text-center text-black">
                {isLoading ?
                <Spinner />
            : "Withdraw"}
            </div>
        </button>
        </>
      );
};

export default Withdraw;