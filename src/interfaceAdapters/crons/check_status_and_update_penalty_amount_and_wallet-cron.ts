import cron from "node-cron";
import { RentModel } from "../../frameworks/database/models/rent_model";
import { PurseModel } from "../../frameworks/database/models/purse_model";
import { generateUniqueTrsasactionId } from "../../frameworks/security/uniqueid_bcrypt";
import { NotificationModel } from "../../frameworks/database/models/notification_model";

async function handleContractPenalties() {
  try {
    const now = new Date();

    const contracts = await RentModel.find({
      status: "Contract Date Exceeded",
    }).populate("bookId");

    for (const contract of contracts) {
      const {
        rent_end_date,
        rent_amount,
        period_of_contract,
        borrowerId,
        ownerId,
        penalty_amount,
        original_amount,
      } = contract;

      //   const daysExceeded = Math.floor((now.getTime() - rent_end_date.getTime()) / (1000 * 60 * 60 * 24));
      //   if (daysExceeded <= 0) continue;

      const totalDue = rent_amount + penalty_amount;
      console.log("totalDue", totalDue, "original_amount", original_amount);
      if (totalDue >= original_amount) {
        console.log(
          `[CRON-penalty] Skipping contract ${contract._id} - total due exceeds or equals original amount`
        );
        continue;
      }

      const dailyPenalty = rent_amount / period_of_contract;

      let borrowerWallet = await PurseModel.findOne({ userId: borrowerId });
      let ownerWallet = await PurseModel.findOne({ userId: ownerId });

      if (!ownerWallet) {
        ownerWallet = new PurseModel({
          userId: ownerId,
          balance: 0,
          transactions: [],
        });
        await ownerWallet.save();
        console.log(`[CRON-penalty] Created new wallet for owner ${ownerId}`);
      }

      if (!borrowerWallet || borrowerWallet.balance < rent_amount) continue;

      // Transfer rent on first day of overdue
      if (penalty_amount === 0) {
        const tsId = generateUniqueTrsasactionId();

        borrowerWallet.balance -= rent_amount;
        borrowerWallet.hold_amount -= rent_amount;
        borrowerWallet.transactions.push({
          tsId,
          type: "debit",
          amount: Number(rent_amount),
          status: "completed",
          description: `Amount debited through rent of book`,
          createdAt: new Date(),
        });

        ownerWallet.balance += rent_amount;
        ownerWallet.transactions.push({
          tsId,
          type: "credit",
          amount: Number(rent_amount),
          status: "completed",
          description: `Amount credited through rent of book`,
          createdAt: new Date(),
        });

        await borrowerWallet.save();
        await ownerWallet.save();

        console.log(
          `[CRON-penalty] Rent amount transferred for contract ${contract._id}`
        );
      }

      // Recalculate totalDue after rent transfer
      const newTotalDue = rent_amount + penalty_amount + dailyPenalty;
      if (newTotalDue > original_amount) {
        console.log(
          `[CRON-penalty] Skipping penalty update for contract ${contract._id} - would exceed original amount`
        );
        continue;
      }

      const newPenalty = penalty_amount + dailyPenalty;
      contract.penalty_amount = newPenalty;
      await contract.save(); 

      const tsId = generateUniqueTrsasactionId();

      borrowerWallet.balance -= dailyPenalty;
      borrowerWallet.hold_amount -= dailyPenalty;
      borrowerWallet.transactions.push({
        tsId,
        type: "debit",
        amount: Number(dailyPenalty),
        status: "completed",
        description: `Penalty debited for overdue book`,
        createdAt: new Date(),
      });

      ownerWallet.balance += dailyPenalty;
      ownerWallet.transactions.push({
        tsId,
        type: "credit",
        amount: Number(dailyPenalty),
        status: "completed",
        description: `Penalty credited for overdue book`,
        createdAt: new Date(),
      });

      await borrowerWallet.save();
      await ownerWallet.save();

     

      console.log(
        `[CRON-penalty] Updated penalty for contract ${contract._id}: ${newPenalty}`
      );
    }
  } catch (error) {
    console.error("[CRON-penalty] Error in contract penalty handler:", error);
  }
}

function startContractPenaltyCron() {
  cron.schedule("0 0,12 * * *", handleContractPenalties);
  console.log(
    "[CRON-penalty] Contract penalty handler scheduled every 11.59 PM in a day"
  );

  // handleContractPenalties().catch(err =>
  //   console.error('[CRON-penalty] Initial contract penalty run error:', err.message)
  // );
}

export default startContractPenaltyCron;
