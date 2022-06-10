import React from "react";
import "./about.css";
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Typography } from "@mui/material";
import { Avatar } from "@mui/material";
import { Button } from "@mui/material";
const About = () => {
  const visitLinkedIn = () => {
    window.location = "https://www.linkedin.com/in/swapnil-manke-3aa8821a1/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://media-exp1.licdn.com/dms/image/C5103AQFmJ3g9t1lfzg/profile-displayphoto-shrink_400_400/0/1580994841337?e=1659571200&v=beta&t=cPfloebG7UYMJmDEX4YOEifuyx0IinYEYaS7O58gmKs"
              alt="Founder"
            />
            <Typography>Swapnil Manke</Typography>
            <Button onClick={visitLinkedIn} color="primary">
              Visit LinkedIn
            </Button>
            <span>
              This is a sample wesbite made by Swapnil Manke
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Social Media Handles</Typography>
            <a
              href="hhttps://www.linkedin.com/in/swapnil-manke-3aa8821a1/"
              target="blank"
            >
              <LinkedInIcon className="linkedinSvgIcon" />
            </a>

            <a href="https://github.com/mankeswapnil0" target="blank">
              <GitHubIcon className="githubSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;