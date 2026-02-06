import cron from "node-cron";
import FollowUp from "../models/followUp.model.js";

const followUpCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();

    await FollowUp.updateMany(
      {
        dueDate: { $lt: now },
        status: "pending",
      },
      {
        status: "missed",
      },
    );

    console.log("Follow-up status check completed");
  });
};

export default followUpCron;
