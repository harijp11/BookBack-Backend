

// src/cronJobs/rentStatusUpdater.js
import cron from 'node-cron'
import { RentModel } from "../../frameworks/database/models/rent_model";


async function updateRentStatus() {
    try {
      console.log('[CRON] Running rent status update check: ' + new Date().toISOString());
  
      const currentDate = new Date();
  
      // Find all rentals with status 'On Rental' and end date in the past
      const overdueRentals = await RentModel.find({
        status: 'On Rental',
        rent_end_date: { $lt: currentDate }
      });
  
      console.log(`[CRON] Found ${overdueRentals.length} overdue rentals`);
  
      let updatedCount = 0;
      for (const rental of overdueRentals) {
        try {
          rental.status = 'Contract Date Exceeded';
          await rental.save();
          updatedCount++;
          console.log(`[CRON] Updated rental ${rental._id} to 'Contract Date Exceeded'`);
        } catch (error) {
          console.error(`[CRON] Error updating rental ${rental._id}:`, error);
        }
      }
  
      console.log(`[CRON] Completed. ${updatedCount} rentals updated.`);
    } catch (error) {
      console.error(`[CRON] Error during rent status update:`, error);
    }
  }
  


  function startRentStatusCron() {
    cron.schedule('0 */6 * * *', updateRentStatus);
    console.log('[CRON] Rent status update scheduled to run every 2 minutes');
  
    // updateRentStatus().catch(error =>
    //   console.error(`[CRON] Error running initial update: ${error.message}`)
    // );
  }

export default startRentStatusCron