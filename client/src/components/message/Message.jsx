import "./message.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import moment from "moment";

export default function Message({ message, own }) {
  const [user, setUser] = useState([]);
  const { currentUser } = useContext(AuthContext);

  // console.log(own)
  useEffect(() => {
    const fetchUser = async () => {
      const res = await makeRequest.get("/users/find/" + currentUser.id);
      setUser(res.data);
    };
    fetchUser();
  }, [currentUser.id]);

  return (
    <>
      {
        user?.map((u) => (
          <div className={own ? "message own" : "message"}>
            {/* <div className={"message own"}> */}
            <div className="messageTop">
              <img
                className="messageImg"
                src={
                  "/upload/" + u.profilePic
                    ? "/upload/" + u.profilePic
                    : "/upload/" + "person/noAvatar.png"
                }
                alt=""
              />
              <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
          </div>
        ))
      }
    </>
  );
}
