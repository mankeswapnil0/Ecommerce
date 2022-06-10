import React from "react";
import { Button } from "@mui/material";
import "./contact.css";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:mymailforabhi@gmail.com">
        <Button variant="contained">Contact: mankeswapnil0@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;