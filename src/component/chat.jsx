import React, { useRef, useState, useEffect, useCallback } from "react";
import "./chat.css";
import io from "socket.io-client";
import axios from "axios";

const userPrompt = prompt("Please enter your id: ");
const socket = io("http://localhost:3001");
const Chat = (props) => {
  const [users, setUsers] = useState(null);
  const [usersF, setUsersF] = useState(null);
  const { isVisible } = props;
  const [userById ,setUserById] = useState({});
  const messagesEndRef = useRef(null);
  const [randomNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [image] = useState(`https://picsum.photos/200/300?${randomNumber}`);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(null);
  const [messagesR, setMessagesR] = useState(null);
  const [date, setDate] = useState();
  const [activeUserId, setActiveUserId] = useState({});
  const getUsers = async () => {
    const result = await axios.get("http://localhost:3001/api/user/all");
    return result.data.data;
  };
  const handleClickUser = (user) => {
    setActiveUserId(user);
    const filteredMessages = messagesR.filter(msg => msg.reciver === user._id || msg.sender === user._id || msg.sender._id === user._id);
    console.log(filteredMessages);
    setMessages(filteredMessages);
    console.log(activeUserId._id);
   
  };
  console.log(activeUserId._id);
  const fetchData = async () => {
    let user = await getUsers();
    setUserById(user.find((user) => user._id === userPrompt));
    setMessages(await getMessages(userPrompt));
    setMessagesR(await getMessages(userPrompt));
    
    const filteredUsers = user.filter(user => user._id !== userPrompt); // filter users array based on userById state
    setUsers(filteredUsers);
    setUsersF(filteredUsers);
  };
 
  const getMessages = async (id) => {
    const result = await axios.get(`http://localhost:3001/api/Messages/get/${id}`);
    console.log(result.data);
    return result.data;
  };

  useEffect(() => {
    fetchData();
   
  }, []);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const handleMessage = useCallback(
    (data) => {
      if (data.sender === userById._id) {
        return false;
      }
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessagesR((prevMessages) => [...prevMessages, data]);
      
    },
    [setMessages, userById._id]
  );

  useEffect(() => {
    socket.on("new-Course-message", handleMessage);
    return () => {
      socket.off("new-Course-message", handleMessage);
    };
  }, [handleMessage, socket]);

  function handleKeyDown(event) {
    if (event.keyCode === 13) {
      insertMessage();
      setInputValue("");
    }
  }

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function insertMessage() {
    if (inputValue.trim() === "") {
      return false;
    }

    const newMessage = {
      sender: userById._id,
      reciver : activeUserId._id,
      username: userById.name,
      message: inputValue,
      image: image,
    };
    
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessagesR((prevMessages) => [...prevMessages, newMessage]);
    setInputValue("");
    socket.emit("new-Course-message", newMessage);
    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    setDate(hours + ":" + minutes);
  }
  function handleClick() {
    insertMessage();
  }

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);
 
  const handleSearch = (event) => {
    const searchQuery = event.target.value.trim().toLowerCase(); // get the search input and convert to lowercase
    const filteredUsers = searchQuery
      ? usersF.filter(user => user.name.toLowerCase().includes(searchQuery)) // filter users array based on search input
      : [...usersF]; // reset the users array if search input is empty
    setUsers(filteredUsers); // update the users state with filtered array
  }


  return (
    <div className={isVisible ? "" : "invisible"}>
      <div className="chat">
        <div className="chat-title">
          <h1 id="user">{userById.name}</h1>
          <h2>user</h2>
          <figure className="avatar">
            <img
              alt="texting "
              src="https://st2.depositphotos.com/3867453/6986/v/600/depositphotos_69864645-stock-illustration-letter-m-logo-icon-design.jpg"
            />
          </figure>
        </div>
        <div style={{ display: "flex", height: "100%", width: "100%" }}>
          <div className="users">
            <div
              style={{
                width: "22%",
                position: "fixed",
                overflowY: "scroll",
                zIndex: 80,
                height: "90%",
              }}
            >
              <form className="search-form" >
                <input
                  type="text"
                  className="search-box"
                  placeholder="Search for user..."
                  onChange={handleSearch}
                />
              </form>
              <br></br>
              {users &&
                users.map((user) => (
                   <div key={user._id}   className={`user-box ${activeUserId._id === user._id ? "active" : ""}`}
                   onClick={() => handleClickUser(user)} >
                    <div style={{display: "flex",gap: "10px",}} >
                      <img className="user-av"  alt="img"  src={`${user.image}`} />
                      <div  style={{ color: "grey",   }}  >
                        {user.name}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="messages">
            <div
              className="messages-content"
              style={{ overflowY: "scroll", marginLeft: -3 }}
            >
                { activeUserId._id   ? (

messages && messages.map((msg, index) =>
  msg.sender._id === userById._id || msg.sender === userById._id ? (
    <div key={index} className="message message-personal new">
      <div className="message-text">{msg.message}</div>
      <div className="timestamp">{date}</div>
    </div>
  ) :   (msg.reciver === userById._id  && (msg.sender._id === activeUserId._id || msg.sender === activeUserId._id) ) ?
    <div key={index} className="message message new">
      <img className="avatar" alt="img" src={`${activeUserId.image}`} />
      <div className="user">{msg.username}</div>
      <div className="message-text">{msg.message}</div>
      <div className="timestamp2">{date}</div>
    </div> : null
  
)



                ) 
            :
            (<p className="heading-msg">
            Welcome to our course chat!<br /> Please keep the conversation respectful
             <br />
             and engaging. choose a user  <br />
             to engage in a conversation!
          </p>)
            }
             
            

              <div
                ref={messagesEndRef}
                style={{ float: "left", clear: "both" }}
              ></div>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="message-box">
            <input
              type="text"
              className="message-input"
              placeholder="Type message..."
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="message-submit"
              onClick={handleClick}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
