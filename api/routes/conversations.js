import express from "express";
import { getConversation, addConversation } from "../controllers/conversations.js";

const router = express.Router()

router.get("/", getConversation)
router.post("/", addConversation)
router.delete("/",)


export default router