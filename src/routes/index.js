import express from "express";
import { authRoutes } from "./authRoutes.js";

const Routes = express.Router()

Routes.use('/auth' , authRoutes);


export {Routes}


