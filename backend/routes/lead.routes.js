import express from "express";
import { createLead, getAllLeads, getSingleLead, updateLead, deleteLead } from "../controllers/lead.controllers.js";
import ownerLogin from "../middlewares/ownerLogin.js";

const router = express.Router();

router.post("/create", ownerLogin, createLead);
router.get("/getAll", ownerLogin, getAllLeads);
router.get("/get/:id", ownerLogin, getSingleLead);
router.patch("/update/:id", ownerLogin, updateLead);
router.delete("/delete/:id", ownerLogin, deleteLead);

export default router;
