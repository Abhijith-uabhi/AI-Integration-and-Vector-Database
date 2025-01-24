import { Router } from "express";
import { agentAutoResponse } from "../controller/agentController.js";

const router=Router()

router.get("/auto_response",agentAutoResponse)

export default router