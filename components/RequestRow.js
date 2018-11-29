import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

class RequestRow extends Component {
  onApprove = async () => {
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });

    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    const accounts = await web3.eth.getAccounts();
    const campaign = Campaign(this.props.address);
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });

    Router.pushRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const readyToFinalize =
      this.props.request.approvalCount > this.props.approversCount / 2;

    return (
      <Row
        disabled={this.props.request.complete}
        positive={readyToFinalize && !this.props.request.complete}
      >
        <Cell>{this.props.id}</Cell>
        <Cell>{this.props.request.description}</Cell>
        <Cell>{web3.utils.fromWei(this.props.request.value, "ether")}</Cell>
        <Cell>{this.props.request.recipient}</Cell>
        <Cell>
          {this.props.request.approvalCount}/{this.props.approversCount}
        </Cell>

        <Cell>
          {this.props.request.complete ? (
            <Button disabled basic color="green">
              Approve
            </Button>
          ) : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>

        <Cell>
          {this.props.request.complete ? (
            <Button disabled color="teal" basic>
              Finalized!
            </Button>
          ) : (
            <Button color="teal" basic onClick={this.onFinalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
