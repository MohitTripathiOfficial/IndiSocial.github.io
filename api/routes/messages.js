import express from "express";
import { getMessages, addMessages } from "../controllers/messages.js";

const router = express.Router()

router.get("/", getMessages)
router.post("/", addMessages)
router.delete("/",)


export default router