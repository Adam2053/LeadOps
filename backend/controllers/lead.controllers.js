import Lead from "../models/lead.model.js";

export const createLead = async (req, res) => {
  try {
    const loggedInUser = req.user;

    const { name, email, phone, stage, address, expectedValue } = req.body;

    if (!name || !email || !phone || !stage)
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });

    const ifExistingLead = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (ifExistingLead)
      return res
        .status(409)
        .json({ success: false, message: "Duplicate lead found" });

    const lead = await Lead.create({
      name,
      email,
      phone,
      stage,
      address,
      expected_value: expectedValue,
      owner: loggedInUser,
    });

    return res.status(201).json({
      success: true,
      message: "Lead Created Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllLeads = async (req, res) => {
  try {
    const ownerId = req.user;

    const leads = await Lead.find({ owner: ownerId });

    if (!leads)
      return res.status(404).json({
        success: false,
        message: "No leads found",
      });

    return res.status(200).json({
      success: true,
      message: "All Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleLead = async (req, res) => {
  try {
    const owner = req.user;
    const leadId = req.params.id;

    const lead = await Lead.findById(leadId);

    if (!lead)
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });

    if (lead.owner !== owner)
      return res.status(403).json({
        success: false,
        message: "Forbidden: User not allowed",
      });

    return res.status(200).json({
      success: true,
      message: "Lead found successfully",
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateLead = async (req, res) => {
  try {
    const owner = req.user;
    const updates = req.body;
    const leadId = req.params.id;

    if (!updates)
      return res.json(400).json({
        success: false,
        message: "Missing update fields",
      });

    const updatedLead = await Lead.findByIdAndUpdate(leadId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedLead || updateLead.owner !== owner)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    return res.status(200).json({
      success: true,
      message: "Lead Updated Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const owner = req.user;
    const leadId = req.params.id;

    const lead = await Lead.findById(leadId);

    if (lead.owner !== owner)
      return res.status(400).json({
        success: false,
        message: "User not authorized",
      });

    await Lead.findByIdAndDelete(leadId);

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
