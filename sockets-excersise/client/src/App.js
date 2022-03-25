import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
  const [state, setState] = useState({ message: "", name: "", room: "" });
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io("/");
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("message", ({ name, message, room }) => {
      console.log("i hit");
      setChat([...chat, { name, message, room }]);
    });
    socketRef.current.on("user_join", function ({ name, room }) {
      console.log("i hit");
      setChat([
        ...chat,
        {
          name: "ChatBot",
          message: `${name} has joined chatroom ${room}`,
          room,
        },
      ]);
    });
  }, [chat]);

  const userjoin = (name, room) => {
    // setChat([
    //   {
    //     name: "ChatBot",
    //     message: `${name} has joined chatroom ${room}`,
    //     room,
    //   },
    // ]);
    socketRef.current.emit("user_join", { name, room });
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    setState({ ...state, [msgEle.name]: msgEle.value });
    setChat([
      ...chat,
      { name: state.name, message: msgEle.value, room: state.room },
    ]);
    socketRef.current.emit("message", {
      name: state.name,
      message: msgEle.value,
      room: state.room,
    });
    e.preventDefault();
    setState({ message: "", name: state.name, room: state.room });
    msgEle.value = "";
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <>
        <div key={index}>
          <h3>
            {name}: <span>{message}</span>
          </h3>
        </div>
      </>
    ));
  };

  return (
    <div>
      {state.name && (
        <div className="card">
          <div className="render-chat">
            <h1>Chat Log Room {state.room} </h1>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name="message"
                id="message"
                variant="outlined"
                label="Message"
              />
            </div>
            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className="form"
          onSubmit={(e) => {
            console.log(document.getElementById("username_input").value);
            console.log(document.getElementById("room_input").value);
            e.preventDefault();
            setState({
              ...state,
              name: document.getElementById("username_input").value,
              room: document.getElementById("room_input").value,
            });
            userjoin(
              document.getElementById("username_input").value,
              document.getElementById("room_input").value
            );
            // userName.value = '';
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input id="username_input" />
            </label>
          </div>
          <div className="form-group">
            <label>
              Chat Room Name:
              <br />
              <input id="room_input" />
            </label>
          </div>
          <br />

          <br />
          <br />
          <button type="submit"> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default App;
