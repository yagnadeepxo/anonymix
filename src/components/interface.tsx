import { useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import Navbar from "./ui/Navbar";
import { Account } from "@/types/types";

const Interface = ()=>{
    const [tab, setTab] = useState<string>('deposit')
    const [account, updateAccount] = useState<Account>(); 
 
    const connectMetamask = async () => {
        try{
            if(!(window as any).ethereum){
                alert("Please install Metamask to use this app.");
                throw "no-metamask";
            }

            let accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
            let chainId = (window as any).ethereum.networkVersion;

            if(chainId != "5"){
                alert("Please switch to Goerli Testnet");
                throw "wrong-chain";
            }

            let activeAccount = accounts[0];
            let newAccountState = {
                chainId: chainId,
                address: activeAccount,
            };
            updateAccount(newAccountState);
        }catch(e){
            console.log(e);
        }
    };

    // const copyLink = (proofElements) => {
    //     navigator.clipboard.writeText(proofElements)
    //         .then(() => {
    //         console.log(`Copied to clipboard: ${proofElements}`);
    //         alert("copied")
    //         })
    //         .catch((err) => {
    //         console.error(`Failed to copy to clipboard: ${err}`);
    //         });
    // }

    return(
        <div>
            <Navbar connectMetamask={connectMetamask} account={account}/>
            <div className="flex flex-col mt-32 items-center justify-center">
                <div className="flex space-x-28">
                    <p 
                    onClick={() => setTab("deposit")}
                    className={tab === "deposit" ? "bg-[#94febf] text-black font-semibold py-3 px-14 mr-1 text-lg cursor-pointer" : 
                    "bg-[#94febe3b] border border-[#94febf] text-[#94febf] font-semibold py-3 px-14 mr-1 text-lg cursor-pointer"}>
                        Deposit
                    </p>
                    <p 
                    onClick={() => setTab("withdraw")}
                    className={tab === "deposit" ? "pr-12 bg-[#94febe3b] border border-[#94febf] text-[#94febf] font-semibold py-3 px-14 text-lg cursor-pointer":
                    "pr-12 bg-[#94febf] text-black font-semibold py-3 px-14 text-lg cursor-pointer"}>
                        Withdraw
                    </p>
                </div>
                    <div className="pb-6 border-2 w-[30rem] border-[#94febf] px-6 pt-4">
                    {tab === "deposit" ? <Deposit account={account}/> : <Withdraw account={account}/>}
                    </div>
            </div>
        </div>
    )
}

export default Interface;