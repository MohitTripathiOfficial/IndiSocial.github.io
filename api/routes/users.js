import express from "express";
import { getAllUser, getUser, updateUser } from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.get("/allUsers", getAllUser)
router.put("/", updateUser)


export default router