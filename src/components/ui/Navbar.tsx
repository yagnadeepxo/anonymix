import { Account } from '@/types/types';
import * as React from 'react';

interface INavbarProps {
    connectMetamask: () => void,
    account: Account
}

const Navbar: React.FunctionComponent<INavbarProps> = ({connectMetamask, account}) => {
  return (
    <>
    <nav className="bg-white dark:bg-[#000403] border-b border-[#94febf]">
    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-[#94febf]">ETH Mixer</span>
        </a>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
        </button>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <p
            className='px-6 py-2 cursor-pointer'
            onClick={connectMetamask}>
                {account ? 
                `${account.address.slice(0,8)}...${account.address.slice(32,40)}`
                : "Connect"}
            </p>
        </ul>
        </div>
    </div>
    </nav>
    <div className="py-2 text-center text-xs font-medium bg-gray-800 text-gray-200">
        <p className="flex items-center justify-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-8a1 1 0 11-2 0V7a1 1 0 112 0v3z" clipRule="evenodd" />
          </svg>
          <span>Using this mixer may violate laws of certain jurisdictions. For educational purposes only.</span>
        </p>
      </div>
    </>
  );
};

export default Navbar;
