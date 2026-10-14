import cron from "node-cron";
import { Op } from "sequelize";
import { Task } from "../models";
export function startReminderJob() {
  cron.schedule("* * * * *", async () => {
    try {
      const dueTasks = await Task.findAll({
        where: {
          done: false,
          reminded: false,
          remindAt: { [Op.lte]: new Date() },
        },
      });

      for (const task of dueTasks) {
        console.log(`REMINDER for user ${task.userId}: "${task.title}"`);
        await task.update({ reminded: true });
      }
    } catch (error) {
      console.error("Reminder job failed", error);
    }
  });

  console.log("Reminder job started (runs every minute)");
}
