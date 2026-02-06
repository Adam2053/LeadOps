import Lead from "../models/lead.model.js";
import FollowUp from "../models/followUp.model.js";

export const createFollowUp = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const leadId = req.body.lead;

    const leadExists = await Lead.findOne({
      _id: leadId,
      owner: ownerId,
    });

    if (!leadExists)
      return res.status(403).json({
        succesS: false,
        message: "Cannot add followup to this lead",
      });

    const followUp = await FollowUp.create({
      ...req.body,
      owner: ownerId,
    });

    res.status(201).json({
      success: false,
      message: "FollowUp Added to the lead successfully",
      data: followUp,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllFollowUp = async (req, res) => {
  // get all followups for particular status

  try {
    const filter = { owner: req.user.id };
    const status = req.query.status;

    if (status) {
      filter.status = status;
    }

    const followUps = await FollowUp.find(filter)
      .populate("lead", "name stage")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      message: "Followups fetched successfully",
      data: followUps,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const markDone = async (req, res) => {
  try {
    const followUp = await FollowUp.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { status: "done" },
      { new: true },
    );

    if (!followUp)
      return res.status(404).json({
        success: false,
        message: "FollowUp not found",
      });

    res.status(200).json({
      success: true,
      message: "FollowUp marked done successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleFollowUp = async (req, res) => {};

export const deleteFollowUp = async (req, res) => {};
