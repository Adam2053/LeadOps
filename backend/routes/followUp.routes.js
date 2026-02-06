import express from "express";
import ownerLogin from "../middlewares/ownerLogin.js";
import {
  createFollowUp,
  getAllFollowUp,
  getSingleFollowUp,
  markDone,
  deleteFollowUp,
} from "../controllers/followUp.controllers.js";

const router = express.Router();

router.post("/create", ownerLogin, createFollowUp);
router.get("/get", ownerLogin, getAllFollowUp);
router.get("/get/:id", ownerLogin, getSingleFollowUp);
router.patch("/:id/done", ownerLogin, markDone);
router.delete("/delete", ownerLogin, deleteFollowUp);


export default router;