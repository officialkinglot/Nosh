import express from "express";
import { loginUser, registerUser, adminLogin, dispatchLogin, registerDispatch, forgotPassword, resetPassword } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin-login", adminLogin);
userRouter.post("/dispatch-login", dispatchLogin);
userRouter.post("/register-dispatch", registerDispatch);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
