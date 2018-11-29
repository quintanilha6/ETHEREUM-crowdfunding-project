const assert = require("assert"); //assertion module for testing
const ganache = require("ganache-cli"); //ganache module for easy providers
const Web3 = require("web3"); //web3 constructor from module web3
const web3 = new Web3(ganache.provider()); //instance of web3

// Path to CampaignFactory.json
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

// Path to Campaign.json
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // Fetch accounts provided ganache provider
  accounts = await web3.eth.getAccounts();

  // Creates a factory to create different Campaigns
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  // Deploys a Campaign
  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  // Return address of first deployed Campaign
  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  // Assigns the actual compaign we are dealing with
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("person is marked as contributer when successfuly contribute", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "101" });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();

    assert(isContributor);
  });
  it("can not contribute an ammount smaller than the minimum", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[1], value: "99" });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a manager to create a payment request", async () => {
    //createRequest(string description, uint value, address address)
    await campaign.methods
      .createRequest("Buy some batteries", "1000", accounts[0])
      .send({ from: accounts[0], gas: 1000000 });

    const request = await campaign.methods.requests(0).call();

    assert.equal("Buy some batteries", request.description);
  });

  it("processes request", async () => {
    //gets balance before the transaction
    let balanceBefore = await web3.eth.getBalance(accounts[1]);
    balanceBefore = web3.utils.fromWei(balanceBefore, "ether");
    balanceBefore = parseFloat(balanceBefore);

    // Contribute with 10 ether
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether")
    });

    // creates a payment request
    // createRequest(string description, uint value, address address)
    await campaign.methods
      .createRequest("A request", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: 1000000 });

    // vote on the request with someone who contributed
    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    // finalize the resquest
    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000"
    });

    //gets balance after the transaction
    let balanceAfter = await web3.eth.getBalance(accounts[1]);
    balanceAfter = web3.utils.fromWei(balanceAfter, "ether");
    balanceAfter = parseFloat(balanceAfter);

    assert(balanceAfter > balanceBefore);
  });
});
