import express from "express";
const router = express.Router();
import { getUserInfo, updateUser } from "../controllers/user.js";
//The GET /me route allows users to view their profile information, and the PUT /me/u route lets them update their information, ensuring the user can keep their account details current.
router.get("/me", getUserInfo);
//http://localhost:8000/api/users/me
router.put("/me/u", updateUser)
//http://localhost:8000/api/users/me/u



export default router;