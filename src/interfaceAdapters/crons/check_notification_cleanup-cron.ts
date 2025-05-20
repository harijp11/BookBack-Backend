import cron from "node-cron";
import { inject, injectable } from "tsyringe";
import { INotificationRepository } from "../../entities/repositoryInterface/user/notification_repository-interface";
import { INotificationCleanupJob } from "../../entities/cronInterface/notification_cron_cleanup_job-interface";

@injectable()
class NotificationCleanupJob implements INotificationCleanupJob {

constructor(
  @inject("INotificationRepository")
  private _notificationRepository: INotificationRepository
) {
}

  start() {
    cron.schedule("10 9,21 * * *", async () => {
      try {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const deleted = await this._notificationRepository.deleteDateExceeded(threeDaysAgo);
        console.log(`[${new Date().toISOString()}] Notification cleanup completed. ${deleted.deletedCount}`);
      } catch (error) {
        console.error("Error running notification cleanup cron:", error);
      }
    });

    console.log("Notification cleanup cron job started.");
  }
}

export default NotificationCleanupJob;
