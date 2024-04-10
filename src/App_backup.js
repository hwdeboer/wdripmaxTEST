//App.js file

import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import { Notifications } from "react-push-notification";
import addNotification from "react-push-notification";
import ABIWDRIP from "./WDRIPONLYUP_ABI.json";

function App() {
  // State variables for wallet connection status and address
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
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const getUserInfo = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    // Call the function with the input value
    valueMintRedeem = (inputValue * decimals).toString();
    console.log("Input Value:", valueMintRedeem);
    //const weiValue = 100000;
    //const ethValue = ethers.utils.formatEther(weiValue);
    // Reset the input field
    //setInputValue("");
  };

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

  function warningNotification() {
    addNotification({
      message: "You to submit a positive number!",
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
    if (naam <= 0 || naam === "") warningNotification();
    else successNotification();
  }
  return (
    <div className="app">
      <div className="content">
        <Notifications />
        <button className="btn" onClick={connectWallet}>
          {connected ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
        <h3>Your Address:</h3>
        <h3 className="wal-add">{walletAddress}</h3>
        <form className="inputForm">
          <label htmlFor="inputValue"># Tokens to mint/redeem:</label>
          <input
            type="number"
            id="inputValue"
            name="inputValue"
            value={inputValue}
            onChange={handleInputChange} // Call handleInputChange when input changes
          />
          <button type="submit" onClick={getUserInfo}>
            Submit
          </button>
        </form>
        <form>
          <label>Name:</label>
          <input
            type="number"
            name="naam"
            value={naam}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSubmit} type="submit">
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
        <div className="infoOutput">
          <button onClick={getMyBalance} type="submit" className="btn">
            Get all relevant info
          </button>
          <h3>Your balance: {balanceInfo}</h3>
          <h3>Current price: {currentPrice}</h3>
          <h3># of users: {numberUsers}</h3>
          <h3># of txs: {numberTxs}</h3>
          <h3>Backed supply wDrip: {underlyingSupply}</h3>
          <h3>Current supply wDripOnlyUp: {totalSupply}</h3>
        </div>
      </div>
    </div>
  );
}

export default App;
