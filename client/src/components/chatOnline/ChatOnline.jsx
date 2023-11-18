import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat, conversations }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [user, setUser] = useState([]);



  useEffect(() => {
    const getFriends = async () => {
      const res = await makeRequest.get("/relationships?followedUserId=" + currentId);
      setFriends(res.data);
    };
    getFriends();
  }, [currentId]);


  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f)));
  }, [friends, onlineUsers]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await makeRequest.get("/users/find/" + onlineFriends);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [onlineFriends]);


  const handleClick = async (user) => {
    try {
      const res = await makeRequest.get("/conversations?senderId=" + user.id
        // `/conversations/find/${currentId}/${user.id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  // console.log(setCurrentChat)
  return (
    <div className="chatOnline">
      {user?.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                "/upload/" + o.profilePic
                  ? "/upload/" + o.profilePic
                  : "/upload/" + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}
    </div>
  );
}
