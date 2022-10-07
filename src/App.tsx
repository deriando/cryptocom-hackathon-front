import { createContext, useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Button } from "@mui/material";
import { ethers } from "ethers";

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
// @ts-ignore window.ethereum type not available
const provider = new ethers.providers.Web3Provider(window.ethereum);

// MetaMask requires requesting permission to connect users accounts
async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
}
// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner();

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Button id="wallet-connect" onClick={connectWallet}>
          Wallet Connect
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
