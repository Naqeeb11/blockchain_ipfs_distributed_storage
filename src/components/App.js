import React, { Component } from "react";
import Web3 from "web3";
import Meme from "../abis/Meme.json";
import { create } from "ipfs-http-client";
import "./App.css";

// const ipfsClient = require("ipfs-http-client");
const ipfs = create({
   host: "ipfs.infura.io",
   port: 5001,
   protocol: "https",
}); // leaving out the arguments will default to these values

class App extends Component {
   async componentWillMount() {
      await this.loadWeb3();
      await this.loadBlockchainData();
   }

   // Get the account
   // Get the network
   // Get Smart Contract
   // ---> ABI: Meme.abi
   // ---> Address: networkData.address
   // Get Meme Hash

   async loadBlockchainData() {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });
      const networkId = await web3.eth.net.getId();
      // console.log(networkId);
      const networkData = Meme.networks[networkId];
      if (networkData) {
         const abi = Meme.abi;
         const address = networkData.address;
         const contract = web3.eth.Contract(abi, address);
         this.setState({ contract });
         const memeHash = await contract.methods.get().call();
         this.setState({ memeHash });
      } else {
         window.alert("Smart contract not deployed to detected network!");
      }
   }

   constructor(props) {
      super(props);

      this.state = {
         memeHash: "",
         contract: null,
         // web3: null,
         buffer: null,
         account: "",
      };
   }

   async loadWeb3() {
      if (window.ethereum) {
         window.web3 = new Web3(window.ethereum);
         await window.ethereum.enable();
      }
      if (window.web3) {
         window.web3 = new Web3(window.web3.currentProvider);
      } else {
         window.alert("Please use metamask!");
      }
   }

   captureFile = (event) => {
      event.preventDefault();
      console.log("hello");
      const file = event.target.files[0];
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
         this.setState({ buffer: Buffer(reader.result) });
         console.log("buffer", this.state.buffer);
      };
   };

   // Example hash: QmfZw214xRkJhovh2xNcrHWJLHLMjsfYTxmVZ1KG88qvPZ
   // Example url: https://ipfs.io/ipfs/QmcsXpk8bhbnuwNyyWxLdHGUFbmJFh9vPgLF19WZJsWzj9
   // Example url: https://dweb.link/ipfs/QmV5LZz48D18diRz7YKavazEHgFuXd3au3uhgTMsFtVW5d
   onSubmit = async (event) => {
      event.preventDefault();
      console.log("Submitting the form...");
      const result = await ipfs.add(this.state.buffer);
      console.log("IPFS Result", result);
      const memeHash = result.path;
      this.state.contract.methods
         .set(memeHash)
         .send({ from: this.state.account })
         .then((r) => {
            this.setState({ memeHash: result.path });
         });
      // const memeHash = result[0].hash;
      // this.setState({ memeHash });
      // if (error) {
      //    console.error(error);
      //    return;
      // }
   };

   render() {
      return (
         <div>
            <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
               <a
                  className='navbar-brand col-sm-3 col-md-2 mr-0'
                  href='http://www.dappuniversity.com/bootcamp'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Meme of the Day
               </a>
               <ul className='navbar-nav px-3'>
                  <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                     <small className='text-white'>{this.state.account}</small>
                  </li>
               </ul>
            </nav>
            <div className='container-fluid mt-5'>
               <div className='row'>
                  <main role='main' className='col-lg-12 d-flex text-center'>
                     <div className='content mr-auto ml-auto'>
                        <a
                           href='http://www.dappuniversity.com/bootcamp'
                           target='_blank'
                           rel='noopener noreferrer'>
                           <img
                              src={`https://ipfs.io/ipfs/${this.state.memeHash}`}
                              alt=''
                           />
                        </a>
                        <p>&nbsp;</p>
                        <h2>Change Meme</h2>
                        <form onSubmit={this.onSubmit}>
                           <input type='file' onChange={this.captureFile} />
                           <input type='submit' />
                        </form>
                     </div>
                  </main>
               </div>
            </div>
         </div>
      );
   }
}

export default App;
