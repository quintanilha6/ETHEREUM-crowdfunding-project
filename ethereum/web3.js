import Web3 from "web3";

// assuming that metamask already injected a provider into the app
// this would fail in case the web3 instance is initialized in the server side
// const web3 = new Web3(window.web3.currentProvider);

let web3;
// Destinguishes browser from server side
if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // we are in the browser and metamask injected a provider and is running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // we are in the server side and metmask is not available
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/73da23cca49949919a2f69b1191a5042"
  );
  web3 = new Web3(provider);
}




export default web3;
