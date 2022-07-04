import React, { Component } from "react";
import Web3 from "web3";
import Meme from "../abis/Meme.json";
import { create } from "ipfs-http-client";
import "./App.css";
// import { version } from "chai";

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
         remeHash: "",
         semeHash: "",
         contract: null,
         // web3: null,
         buffer: null,
         account: "",
         hold: 0,
         hold1: 0,
         hold2: 0,
         hold3: -1,
         hold4: -1,
         todos: [],
         files: {},
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

   onClick = (movie) => {
      this.setState({ hold2: 1, remeHash: movie });
      console.log("remeHash", movie);
   };

   onClick1 = (flag) => {
      this.setState({ hold4: flag });
      console.log("hold4", flag);
   };

   // Example hash: QmfZw214xRkJhovh2xNcrHWJLHLMjsfYTxmVZ1KG88qvPZ
   // Example url: https://ipfs.io/ipfs/QmVRWe4thCBXwfPWB1piYCXX2uet7qSp9yYWyFFGBuTffR
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

      this.setState({ hold: 1 });
      let nowDate = new Date();
      this.setState({
         todos: [...this.state.todos, memeHash],
         files: {
            ...this.state.files,
            [memeHash]: [{ has: memeHash, time: nowDate }],
         },
      });
      console.log("memeHash: ", this.state.memeHash);
      console.log("flag1", this.state.todos);
      console.log("flag", this.state.files);
   };

   onSubmit1 = async (event) => {
      event.preventDefault();
      console.log("Submitting the form...");
      const result = await ipfs.add(this.state.buffer);
      console.log("IPFS Result", result);
      const memeHash = result.path;

      this.setState({ hold1: 1, semeHash: memeHash });
      console.log("memeHash1: ", this.state.semeHash);
   };

   onSubmit2 = async (event, i) => {
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

      // this.setState({ hold: 1 });
      let nowDate = new Date();
      const red = this.state.todos[i];
      console.log("hell", red);

      this.setState({
         todos: [
            ...this.state.todos.slice(0, i),
            memeHash,
            ...this.state.todos.slice(i + 1),
         ],
         files: {
            ...this.state.files,
            [memeHash]: [
               ...this.state.files[red],
               { has: memeHash, time: nowDate },
            ],
         },
         hold3: -1,
      });
      console.log("memeHash: ", this.state.memeHash);
      console.log("flag", this.state.files);
      console.log("flag1", this.state.todos);
   };

   render() {
      return (
         <div>
            {/* landing page */}

            <div class='hero' id='landing'>
               <div class='navbar'>
                  <a href='#landing' class='account'>
                     account: {this.state.account}
                  </a>
                  {/* <a href='#landing'>landing</a> */}
                  <a href='#section1'>Uploading</a>
                  <a href='#section2'>Verifying</a>
                  <a href='#section3'>Tracing</a>
               </div>
               <div class='content'>
                  <small>Welcome to our</small>
                  <h1>
                     Distributed <br />
                     Storage System
                  </h1>
                  <small className='ur'>powered by Blockchain</small>
               </div>

               <div class='bubbles'>
                  <img src={require("./prop/bubble.png")} alt='' />
                  <img src={require("./prop/bubble.png")} alt='' />
                  <img src={require("./prop/bubble.png")} alt='' />
                  <img src={require("./prop/bubble.png")} alt='' />
                  <img src={require("./prop/bubble.png")} alt='' />
                  <img src={require("./prop/bubble.png")} alt='' />
                  <img src={require("./prop/bubble.png")} alt='' />
               </div>
            </div>

            {/* landing page end */}

            {/* <nav className='navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow'>
               <a
                  className='navbar-brand col-sm-3 col-md-2 mr-0'
                  href=''
                  target='_blank'
                  rel='noopener noreferrer'>
                  Distributed Storage System
               </a>
               <ul className='navbar-nav px-3'>
                  <li
                     style={{ paddingRight: "0px" }}
                     className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                     <small
                        style={{ marginLeft: "200px" }}
                        className='text-white'>
                        account: {this.state.account}
                     </small>
                  </li>
               </ul>
            </nav> */}

            <div id='section1'>
               {this.state.hold === 1 ? (
                  <div>
                     <h1>Uploaded Files</h1>
                     <h2 style={{ display: "inline" }}>
                        <b>Disclaimer:</b>
                     </h2>{" "}
                     <h4 style={{ display: "inline" }}>
                        Save hash for future access while server is down!
                     </h4>
                  </div>
               ) : null}
               <ol>
                  {this.state.todos.map((movie, i) => {
                     return (
                        <li
                           key={movie}
                           style={{
                              marginLeft: "500px",
                              marginTop: "10px",
                           }}>
                           {movie}
                           {"           "}
                           <a
                              href={`https://ipfs.io/ipfs/${movie}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              style={{ marginLeft: "50px", color: "white" }}>
                              Fetch Data
                           </a>
                           <button
                              style={{ marginLeft: "50px" }}
                              onClick={() => this.setState({ hold3: i })}>
                              <span>Update</span>
                           </button>
                           {this.state.hold3 === i ? (
                              <form
                                 onSubmit={(e) => this.onSubmit2(e, i)}
                                 style={{ marginTop: "30px" }}>
                                 <input
                                    className='hell'
                                    type='file'
                                    onChange={this.captureFile}
                                 />
                                 <input className='hell1' type='submit' />
                              </form>
                           ) : null}
                        </li>
                     );
                  })}
               </ol>

               <p>&nbsp;</p>
               {/* </div>
                     </main>
                  </div>
               </div> */}

               <h2>Upload File</h2>
               <form onSubmit={this.onSubmit} style={{ marginTop: "30px" }}>
                  <input
                     className='hell'
                     type='file'
                     onChange={this.captureFile}
                  />
                  <input className='hell1' type='submit' />
               </form>
            </div>

            <div id='section2'>
               <h2 style={{ marginTop: "50px" }}>Verify File data</h2>
               <ol
                  style={{
                     marginLeft: "300px",
                     marginTop: "10px",
                  }}>
                  {this.state.todos.map((movie, i) => {
                     return (
                        <li
                           key={movie}
                           style={{
                              marginLeft: "350px",
                              marginTop: "20px",
                              width: "500px",
                           }}>
                           File{i + 1}
                           {"           "}
                           <button
                              style={{
                                 marginLeft: "50px",
                              }}
                              onClick={() => this.onClick(movie)}>
                              <span>Fetch & Verify</span>
                           </button>
                        </li>
                     );
                  })}
               </ol>

               {this.state.hold2 === 1 ? (
                  <form onSubmit={this.onSubmit1} style={{ marginTop: "30px" }}>
                     <input
                        className='hell'
                        type='file'
                        onChange={this.captureFile}
                     />
                     <input className='hell1' type='submit' />
                  </form>
               ) : null}

               {this.state.hold1 === 1 ? (
                  this.state.semeHash === this.state.remeHash ? (
                     <div
                        onClick={() => this.setState({ hold1: 0 })}
                        style={{
                           marginTop: "10px",
                           color: "orange",
                           fontSize: "35px",
                        }}>
                        Both files are same
                     </div>
                  ) : (
                     <div
                        onClick={() => this.setState({ hold1: 0 })}
                        style={{
                           marginTop: "30px",
                           color: "red",
                           fontSize: "35px",
                        }}>
                        Both files are different
                     </div>
                  )
               ) : null}
            </div>

            <div id='section3'>
               <h2 style={{ marginTop: "50px" }}>Tracing File Version</h2>
               <ol
                  style={{
                     marginLeft: "300px",
                     marginTop: "10px",
                  }}>
                  {this.state.todos.map((movie, i) => {
                     return (
                        <li
                           key={movie}
                           style={{
                              marginLeft: "350px",
                              marginTop: "20px",
                              width: "500px",
                           }}>
                           File{i + 1}
                           {"           "}
                           <button
                              style={{
                                 marginLeft: "50px",
                              }}
                              onClick={() => this.onClick1(i)}>
                              <span>Trace file history</span>
                           </button>
                        </li>
                     );
                  })}
                  {this.state.hold4 !== -1
                     ? this.state.files[this.state.todos[this.state.hold4]].map(
                          (movie, i) => {
                             return (
                                <div
                                   key={movie.has}
                                   style={{
                                      marginLeft: "50px",
                                      marginTop: "20px",
                                   }}>
                                   {i}. {movie.time.toString()}
                                   {"           "}
                                   <span
                                      onClick={() =>
                                         this.setState({ hold4: -1 })
                                      }>
                                      version{i + 1}
                                   </span>
                                   <a
                                      href={`https://ipfs.io/ipfs/${movie.has}`}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      style={{
                                         marginLeft: "50px",
                                         color: "white",
                                      }}>
                                      Fetch Data
                                   </a>
                                </div>
                             );
                          }
                       )
                     : null}
               </ol>
            </div>
         </div>
      );
   }
}

export default App;
