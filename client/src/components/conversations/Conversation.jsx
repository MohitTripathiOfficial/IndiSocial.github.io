import { useEffect, useState } from "react";
import "./conversation.css";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState([]);
  const [ww, setWw] = useState([]);

  const { isLoading, data } = useQuery(
    ["relationship"],
    () =>
      makeRequest.get("/relationships?followedUserId=" + currentUser.id).then((res) => {
        return res.data;
      })
  );
  useEffect(() => {
    setWw(data.filter((f) => conversation === (f)));
  }, [data, conversation]);
  // console.log(conversation)

  useEffect(() => {
    let friendId = conversation.recieverId;
    if (friendId == currentUser.id) {
      friendId = conversation.senderId;
    }
    const getUser = async () => {
      try {
        const res = await makeRequest.get("/users/find/" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);
  // console.log(conversation)
  return (
    <>
      {
        user?.map((u) => (
          <div className="conversation">
            <img
              className="conversationImg"
              src={
                "/upload/" + u.profilePic
                  ? "/upload/" + u.profilePic
                  : "/upload/" + "person/noAvatar.png"
              }
              alt=""
            />
            <span className="conversationName">{u.username}</span>
          </div>
        ))
      }
    </>
  );
}
