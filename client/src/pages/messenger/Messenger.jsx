import "./messenger.css";
// import "./ms.scss";
// import Topbar from "../../components/topbar/Topbar";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import Conversation from "../../components/conversations/Conversation";
import { io } from "socket.io-client";

export default function Messenger({ userId }) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { currentUser } = useContext(AuthContext);
  const scrollRef = useRef();
  const [darkMode, setDarkMode] = useState(false);
  const [cId, setCId] = useState([]);



  const { isLoading, data } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + currentUser.id).then((res) => {
        return res.data;
      })
  );


  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    socket.current.emit("addUser", currentUser.id);
    socket.current.on("getUsers", (users) => {

      setOnlineUsers(
        data.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [currentUser]);


  useEffect(() => {
    arrivalMessage &&
      currentChat?.recieverId === (arrivalMessage.senderId) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await makeRequest.get("/conversations?senderId=" + currentUser.id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser.id]);
  // console.log(messages.find((u) => u.text))

  useEffect(() => {
    const getMessages = async () => {
      try {

        const res = await makeRequest.get("/messages?conversationId=" + currentChat.id);
        // console.log(res.data)
        setMessages(res.data);
        // console.log(res)
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);
  console.log(messages)


  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((currentChat.recieverId) == currentUser.id) {
      currentChat.recieverId = currentChat.senderId
      const message = {
        conversationId: currentChat.id,
        senderId: currentUser.id,
        reciever: currentChat.recieverId,
        text: newMessage,
        // createdAt: Date.now(),
      };

      socket.current.emit("sendMessage", {
        senderId: currentUser.id,
        receiverId: currentChat.recieverId,
        text: newMessage,
      });

      try {
        const res = await makeRequest.post("/messages/", message);
        setMessages([...messages, res.data]);
        setNewMessage("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // console.log(currentChat.id)
  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {conversations.map((conversation) => (
              <div onClick={() => setCurrentChat(conversation)}>
                <Conversation
                  conversation={conversation}
                  currentUser={currentUser} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {
                    messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message message={m} own={m.senderId == currentUser.id}
                        // Id={currentChat?.id}
                        />
                      </div>
                    ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className={darkMode ? "chatMessageInputDark" : "chatMessageInputLight"}
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton"
                    onClick={handleSubmit}
                  // onsubmit={handleClick}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="chatBoxTop">
                  <span className="noConversationText">
                    Open a conversation to start a chat.
                  </span>
                  {/* {
                    // msData
                    messages.map((m) => (
                      <div ref={scrollRef}>
                        <Message message={m} own={m.senderId === currentUser.id} />
                      </div>
                    ))} */}
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          <h2 style={{ marginLeft: "40%", marginTop: "22px" }}>Online Friends</h2>
          <label className="switch">
            <input type="checkbox" onChange={() => setDarkMode(!darkMode)} />
            <span className="slider round"> </span>
          </label>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={currentUser.id}
              setCurrentChat={setCurrentChat}
              conversations={conversations}
            />
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}
