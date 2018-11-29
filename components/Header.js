import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default () => {
  return (
    <Menu style={{ marginTop: "20px" }}>
      <Menu.Item>CrowdCoin</Menu.Item>

      <Menu.Menu position="right" />
      <Link route="/">
        <a className="item">Campaigns</a>
      </Link>

      <Link route="/campaigns/new">
        <a className="item">+</a>
      </Link>
    </Menu>
  );
};
