import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
//add
export const getMessages1 = (req, res) => {
  const q = `SELECT * FROM  messages WHERE senderId=? OR reciever=?`;

  db.query(q, [req.query.senderId, req.query.senderId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};



export const getMessages = (req, res) => {
  const q = `SELECT * FROM  messages WHERE conversationId=?`;

  db.query(q, [req.query.conversationId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};




export const addMessages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO messages(`conversationId`, `senderId`,`reciever`,`text`,`createdAt`) VALUES (?)";
    const values = [
      req.body.conversationId,
      req.body.senderId,
      req.body.reciever,
      req.body.text,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// router.post("/", async (req, res) => {
//   const newMessage = new Message(req.body);

//   try {
//     const savedMessage = await newMessage.save();
//     res.status(200).json(savedMessage);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //get

// router.get("/:conversationId", async (req, res) => {
//   try {
//     const messages = await Message.find({
//       conversationId: req.params.conversationId,
//     });
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
