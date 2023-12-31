import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput.jsx";
import Logout from "./components/Logout.jsx";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/ApiRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [writing, setWriting] = useState(false);
  const [renderWriting, setRenderWriting] = useState(false);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const callIt = async () => {
      const data = await JSON.parse(
        localStorage.getItem("chat-app-current-user")
      );
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    callIt();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(localStorage.getItem("chat-app-current-user"))._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  // writing messages loader... ####################
  useEffect(() => {
    const callIt = async () => {
      const data = await JSON.parse(
        localStorage.getItem("chat-app-current-user")
      );
      if (writing) {
        socket.current.emit("writing-msg", {
          to: currentChat._id,
          from: data._id,
        });
      }
    };
    callIt();
  }, [writing, currentChat._id, socket]);
  useEffect(() => {
    const callIt = async () => {
      const data = await JSON.parse(
        localStorage.getItem("chat-app-current-user")
      );
      if (!writing) {
        socket.current.emit("not-writing-msg", {
          to: currentChat._id,
          from: data._id,
        });
      }
    };
    callIt();
  }, [writing, currentChat._id, socket]);

  socket.current.on("other-writing-msg", () => {
    setRenderWriting(true);
  });
  socket.current.on("other-not-writing-msg", () => {
    setRenderWriting(false);
  });

  //################################################

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem("chat-app-current-user")
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // #################################
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>
              {currentChat.username.length > 7
                ? currentChat.username.slice(0, 7) + ".."
                : currentChat.username}
            </h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className="writing">{renderWriting ? <h1>....</h1> : null}</div>
      </div>
      <ChatInput data={{ handleSendMsg, setWriting }} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 2rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.5rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    @media (max-width: 720px) {
      &::-webkit-scrollbar {
        width: 0;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
        @media (max-width: 720px) {
          max-width: 90%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: blue;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
    .writing {
      background-color: #9900ff20;
      width: fit-content;
      border-radius: 20%;
      display: flex;
      justify-content: space-between;
      h1 {
        padding: 1rem;
        max-width: 40%;
        font-size: 20px;
        color: white;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
        @media (max-width: 720px) {
          max-width: 90%;
        }
      }
    }
  }
`;
