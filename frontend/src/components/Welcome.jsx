import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const callIt = async () => {
      setUserName(
        await JSON.parse(localStorage.getItem("chat-app-current-user")).username
      );
    };
    callIt();
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <div className="info">
        <h1>
          Welcome, <span>{userName}!</span>
        </h1>
        <h3>Please select a chat to Start messaging.</h3>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  @media (max-width: 720px) {
    display: block;
    .info {
      width: 100%;
    }
  }
`;
