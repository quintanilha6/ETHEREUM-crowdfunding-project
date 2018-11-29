import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x9dF2B3fe2EB023E6b247de4847C89b17a9B60a71"
);

export default instance;
