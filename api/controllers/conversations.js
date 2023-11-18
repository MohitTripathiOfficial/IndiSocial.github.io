import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getConversation = (req, res) => {
  const q = `SELECT * FROM  conversations WHERE senderId=? OR recieverId=?`;

  db.query(q, [req.query.senderId, req.query.senderId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addConversation = (req, res) => {

  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");


    const q1 = `SELECT * FROM  conversations WHERE (senderId=? AND recieverId=?) OR (recieverId=? AND senderId=?)`;

    // const q2 = `SELECT * FROM  conversations WHERE recieverId=? AND senderId=?`;

    db.query(q1, [req.body.senderId, req.body.recieverId, req.body.senderId, req.body.recieverId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(200).json(data);


      const q = "INSERT INTO conversations(`senderId`, `recieverId`,`createdAt`) VALUES (?)";
      const values = [
        req.body.senderId,
        req.body.recieverId,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      ];

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("msg");
      });
    });
  });


};

//new conv

// router.post("/", async (req, res) => {
//   const newConversation = new Conversation({
//     members: [req.body.senderId, req.body.receiverId],
//   });

//   try {
//     const savedConversation = await newConversation.save();
//     res.status(200).json(savedConversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// //get conv of a user

// router.get("/:userId", async (req, res) => {
//   try {
//     const conversation = await Conversation.find({
//       members: { $in: [req.params.userId] },
//     });
//     res.status(200).json(conversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// // get conv includes two userId

// router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
//   try {
//     const conversation = await Conversation.findOne({
//       members: { $all: [req.params.firstUserId, req.params.secondUserId] },
//     });
//     res.status(200).json(conversation)
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// module.exports = router;
