//App.js file

import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import { Notifications } from "react-push-notification";
import addNotification from "react-push-notification";
import ABIWDRIP from "./WDRIPONLYUP_ABI.json";

function App() {
  // State variables for wallet connection status and address
  // We transfer values from the client side to the server side
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [balanceInfo, setBalanceInfo] = useState("");
  const [numberUsers, setnumberUsers] = useState("");
  const [numberTxs, setnumberTxs] = useState("");
  const [underlyingSupply, setUnderlyingSupply] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [naam, setName] = useState("");

  // Initialise global variables needed in multiple functions
  const wdripOnlyUPAddress = "0xcC95f46652597e57a3F8A8836aE092d339264fD0";
  const wdripAddress = "0xF30224eB7104aca47235beb3362E331Ece70616A";
  let valueMintRedeem = 0;
  const decimals = 1000000000000000000;

  // Function to connect/disconnect the wallet
  async function connectWallet() {
    if (!connected) {
      // Connect the wallet using ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      setConnected(true);
      setWalletAddress(_walletAddress);
    } else {
      // Disconnect the wallet
      window.ethereum.selectedAddress = null;
      setConnected(false);
      setWalletAddress("");
    }
  }

  // Process the user input value for approve/mint/redeem
  // Here we assign the user input to inputValue State variable
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Here we are going to check whether the user input is viable
  function warningNotification() {
    addNotification({
      message: "Please submit a positive number!",
      theme: "red",
      closeButton: "X",
    });
  }

  function successNotification() {
    addNotification({
      message: "You have successfully submitted",
      theme: "light",
      closeButton: "X",
      backgroundTop: "green",
      backgroundBottom: "yellowgreen",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (inputValue <= 0 || inputValue === "") {
      warningNotification();
    } else successNotification();
    getUserInfo(inputValue);
  }

  async function getUserInfo(inputValue) {
    // Call the function with the input value
    valueMintRedeem = (inputValue * decimals).toString();
    console.log("Input Value:", valueMintRedeem);
    //const weiValue = 100000;
    //const ethValue = ethers.utils.formatEther(weiValue);
    // Reset the input field
    //setInputValue("");
  }

  async function approve() {
    if (connected & (valueMintRedeem > 0)) {
      // Connect the wallet using ethers.js
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();
        setConnected(true);
        setWalletAddress(_walletAddress);

        const wdripOnlyUPContract = new ethers.Contract(
          wdripOnlyUPAddress,
          ABIWDRIP,
          signer
        );

        let result = await wdripOnlyUPContract.approve(
          wdripOnlyUPAddress,
          valueMintRedeem,
          {
            from: _walletAddress,
          }
        );
        result = await result.wait();
        //console.log(result);
      } catch (err) {
        //  {code: 4100, message: 'The requested method and/or account has not been authorized by the user.'}
      }
    }
  }

  // Function to connect/disconnect the wallet
  async function mint() {
    if (connected & (valueMintRedeem > 0)) {
      try {
        // Connect the wallet using ethers.js
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();
        setConnected(true);
        setWalletAddress(_walletAddress);

        const wdripOnlyUPContract = new ethers.Contract(
          wdripOnlyUPAddress,
          ABIWDRIP,
          signer
        );

        let mintAmount = await wdripOnlyUPContract.mintWithBacking(
          valueMintRedeem,
          _walletAddress,
          {
            from: _walletAddress,
          }
        );
        let result = await result.wait();
      } catch (err) {
        //  {code: 4100, message: 'The requested method and/or account has not been authorized by the user.'}
      }
    }
  }

  // Function to connect/disconnect the wallet
  async function redeem() {
    if (connected & (valueMintRedeem > 0)) {
      try {
        // Connect the wallet using ethers.js
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();
        //setConnected(true);
        //setWalletAddress(_walletAddress);

        const wdripOnlyUPContract = new ethers.Contract(
          wdripOnlyUPAddress,
          ABIWDRIP,
          signer
        );

        let redeemAmount = await wdripOnlyUPContract.sell(valueMintRedeem, {
          from: _walletAddress,
        });

        let result = await result.wait();
      } catch (err) {
        //  {code: 4100, message: 'The requested method and/or account has not been authorized by the user.'}
      }
    }
  }

  async function getMyBalance() {
    /*
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance)
    });
    */

    //if (!connected) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const _walletAddress = await signer.getAddress();

    const wdripOnlyUPContract = new ethers.Contract(
      wdripOnlyUPAddress,
      ABIWDRIP,
      provider
    );

    // Balance of the user
    const _balanceInfo_tmp = await wdripOnlyUPContract.balanceOf(
      _walletAddress
    );
    const _balanceInfo = (_balanceInfo_tmp.toString() / decimals).toFixed(2);

    // Number of participants
    const statsCA = await wdripOnlyUPContract.getInfo();
    const _numberUsers = statsCA.users.toString();

    // Current price
    const _currentPrice = (statsCA.price.toString() / decimals).toFixed(2);

    // Number of transactions
    const _numberTxs = statsCA.txs.toString();

    // Number of backing supply
    const _underlyingSupply = (
      statsCA.underlyingSupply.toString() / decimals
    ).toFixed(2);

    const _totalSupply = (statsCA.supply.toString() / decimals).toFixed(2);

    //const _balanceInfo = 10;
    setBalanceInfo(_balanceInfo);
    setnumberUsers(_numberUsers);
    setnumberTxs(_numberTxs);
    setUnderlyingSupply(_underlyingSupply);
    setTotalSupply(_totalSupply);
    setCurrentPrice(_currentPrice);
  }
  //}

  function buy() {
    /*
    window.location.href =
      "https://pancakeswap.finance/swap?outputCurrency=0xF30224eB7104aca47235beb3362E331Ece70616A";
    return null;
    */
    window.open(
      "https://pancakeswap.finance/swap?outputCurrency=0xF30224eB7104aca47235beb3362E331Ece70616A",
      "_blank",
      "noopener"
    );
  }

  return (
    <div className="app">
      <div className="content">
        <Notifications />
        <button className="btn" onClick={connectWallet}>
          {connected ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
        <h4>Your Address:</h4>
        <h4 className="wal-add">{walletAddress}</h4>
        <form className="inputForm">
          <label htmlFor="inputValue"># Tokens to mint/redeem:</label>
          <input
            type="number"
            id="inputValue"
            name="inputValue"
            value={inputValue}
            onChange={handleInputChange} // Call handleInputChange when input changes
          />
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
        <button className="btn" onClick={approve}>
          {connected ? "Approve token" : "Approve token"}
        </button>
        <button className="btn" onClick={mint}>
          {connected ? "Mint token" : "Mint token"}
        </button>
        <button className="btn" onClick={redeem}>
          {connected ? "Redeem token" : "Redeem token"}
        </button>
      </div>

      <div className="content2">
        <button onClick={getMyBalance} type="submit" className="btn2">
          Read all relevant info from the blockchain
        </button>
        <h4>Your balance: {balanceInfo}</h4>
        <h4>Current price: {currentPrice}</h4>
        <h4># of users: {numberUsers}</h4>
        <h4># of txs: {numberTxs}</h4>
        <h4>Backed supply wDrip: {underlyingSupply}</h4>
        <h4>Current supply wDripMax: {totalSupply}</h4>
      </div>

      <div className="content3">
        <h3>Why Choose wDripMax?</h3>
        <h4>Secure, decentralized, no dev fees</h4>
        <h4>Contract is verified: PM</h4>
        <h4>It only goes up in terms of wDrip!</h4>
        <h4>
          You can buy wDrip here to start:
          <button className="btn3" onClick={buy}></button>{" "}
        </h4>
      </div>

      <div className="content4">
        <h3>But how?</h3>
        <h4>The minting and redeeming fee (5%) ensure that:</h4>
        <h4>supply wDrip in contract > total supply of wDripMax</h4>
        <h4>Price = backed wDrip balance in the contract divided by</h4>
        <h4>the total supply of wDripMax.</h4>
      </div>
    </div>
  );
}

export default App;
