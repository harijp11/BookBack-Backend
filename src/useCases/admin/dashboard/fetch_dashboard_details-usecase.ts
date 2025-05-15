import { inject, injectable } from "tsyringe";
import { IFetchDashboardDetailsUseCase } from "../../../entities/useCaseInterfaces/admin/dashboard/fetch_dashboard_details_useacse-interface";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { ISaleRepository } from "../../../entities/repositoryInterface/common/sale_repository-interface";
import { IRentRepository } from "../../../entities/repositoryInterface/common/rent_repository-interface";
import { ICategoryRepository } from "../../../entities/repositoryInterface/common/category_repository-interface";
import { DashboardData, SalesData, DataPoint, User, Category } from "../../../entities/models/dashboard_entities";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subYears, parseISO } from "date-fns";

@injectable()
export class FetchDashboardDetailsUseCase implements IFetchDashboardDetailsUseCase {
  constructor(
    @inject("IUserRepository") private _userRepository: IUserRepository,
    @inject("ISaleRepository") private _saleRepository: ISaleRepository,
    @inject("IRentRepository") private _rentRepository: IRentRepository,
    @inject("ICategoryRepository") private _categoryRepository: ICategoryRepository
  ) {}

  async execute(
    startDate?: string,
    endDate?: string,
    view?: "daily" | "weekly" | "monthly" | "yearly",
    topLimit?: string
  ): Promise<DashboardData> {
    try {
      // Parse dates or default to last year
      const end = endDate ? parseISO(endDate) : new Date();
      const start = startDate ? parseISO(startDate) : subYears(end, 1);
      const limit = parseInt(topLimit || "5", 10) || 5;

      // Fetch total users
      const totalUsers = await this._userRepository.find({ isActive: true }, 0, 0).then((res) => res.total);

      // Fetch total sales and rentals
      const totalSales = await this._saleRepository.count({
        sale_date: { $gte: start, $lte: end },
      });
      const totalRentals = await this._rentRepository.count({
        rent_start_date: { $gte: start, $lte: end },
        status: { $in: ["On Rental", "Returned"] },
      });

      // Fetch salesData
      const salesData = await this.getSalesData(start, end);

      // Fetch top users
      const topUsers = await this.getTopUsers(start, end, limit);

      // Fetch top categories
      const topCategories = await this.getTopCategories(start, end, limit);

      return {
        totalSales,
        totalRentals,
        totalUsers,
        salesData,
        topUsers,
        topCategories,
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error}`);
    }
  }

  private async getSalesData(start: Date, end: Date): Promise<SalesData> {
    // Daily aggregation
    const dailySales = await this._saleRepository.aggregate([
      {
        $match: {
          sale_date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$sale_date" },
          sale: { $sum: "$price" },
          saleCount: { $sum: 1 },
        },
      },
      {
        $project: {
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sun" },
                { case: { $eq: ["$_id", 2] }, then: "Mon" },
                { case: { $eq: ["$_id", 3] }, then: "Tue" },
                { case: { $eq: ["$_id", 4] }, then: "Wed" },
                { case: { $eq: ["$_id", 5] }, then: "Thu" },
                { case: { $eq: ["$_id", 6] }, then: "Fri" },
                { case: { $eq: ["$_id", 7] }, then: "Sat" },
              ],
            },
          },
          sale: 1,
          saleCount: 1,
        },
      },
    ]);

    const dailyRentals = await this._rentRepository.aggregate([
      {
        $match: {
          rent_start_date: { $gte: start, $lte: end },
          status: { $in: ["On Rental", "Returned"] },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$rent_start_date" },
          rental: { $sum: "$rent_amount" },
          rentalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sun" },
                { case: { $eq: ["$_id", 2] }, then: "Mon" },
                { case: { $eq: ["$_id", 3] }, then: "Tue" },
                { case: { $eq: ["$_id", 4] }, then: "Wed" },
                { case: { $eq: ["$_id", 5] }, then: "Thu" },
                { case: { $eq: ["$_id", 6] }, then: "Fri" },
                { case: { $eq: ["$_id", 7] }, then: "Sat" },
              ],
            },
          },
          rental: 1,
          rentalCount: 1,
        },
      },
    ]);

    const dailyData: Array<{ day: string } & DataPoint> = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ].map((day) => {
      const saleEntry = dailySales.find((d) => d.day === day) || { sale: 0, saleCount: 0 };
      const rentalEntry = dailyRentals.find((d) => d.day === day) || { rental: 0, rentalCount: 0 };
      return {
        day,
        sale: saleEntry.sale,
        rental: rentalEntry.rental,
        saleCount: saleEntry.saleCount,
        rentalCount: rentalEntry.rentalCount,
      };
    });

    // Weekly aggregation
    const weeklySales = await this._saleRepository.aggregate([
      {
        $match: {
          sale_date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $week: "$sale_date" },
          sale: { $sum: "$price" },
          saleCount: { $sum: 1 },
        },
      },
      {
        $project: {
          week: { $concat: ["W", { $toString: "$_id" }] },
          sale: 1,
          saleCount: 1,
        },
      },
    ]);

    const weeklyRentals = await this._rentRepository.aggregate([
      {
        $match: {
          rent_start_date: { $gte: start, $lte: end },
          status: { $in: ["Returned"] },
        },
      },
      {
        $group: {
          _id: { $week: "$rent_start_date" },
          rental: { $sum: "$rent_amount" },
          rentalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          week: { $concat: ["W", { $toString: "$_id" }] },
          rental: 1,
          rentalCount: 1,
        },
      },
    ]);

    const weeklyData: Array<{ week: string } & DataPoint> = Array.from(
      { length: 52 },
      (_, i) => `W${i + 1}`
    )
      .map((week) => {
        const saleEntry = weeklySales.find((w) => w.week === week) || { sale: 0, saleCount: 0 };
        const rentalEntry = weeklyRentals.find((w) => w.week === week) || { rental: 0, rentalCount: 0 };
        return {
          week,
          sale: saleEntry.sale,
          rental: rentalEntry.rental,
          saleCount: saleEntry.saleCount,
          rentalCount: rentalEntry.rentalCount,
        };
      })
      .filter((w) => w.sale > 0 || w.rental > 0);

    // Monthly aggregation
    const monthlySales = await this._saleRepository.aggregate([
      {
        $match: {
          sale_date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $month: "$sale_date" },
          sale: { $sum: "$price" },
          saleCount: { $sum: 1 },
        },
      },
      {
        $project: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Jan" },
                { case: { $eq: ["$_id", 2] }, then: "Feb" },
                { case: { $eq: ["$_id", 3] }, then: "Mar" },
                { case: { $eq: ["$_id", 4] }, then: "Apr" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "Jun" },
                { case: { $eq: ["$_id", 7] }, then: "Jul" },
                { case: { $eq: ["$_id", 8] }, then: "Aug" },
                { case: { $eq: ["$_id", 9] }, then: "Sep" },
                { case: { $eq: ["$_id", 10] }, then: "Oct" },
                { case: { $eq: ["$_id", 11] }, then: "Nov" },
                { case: { $eq: ["$_id", 12] }, then: "Dec" },
              ],
            },
          },
          sale: 1,
          saleCount: 1,
        },
      },
    ]);

    const monthlyRentals = await this._rentRepository.aggregate([
      {
        $match: {
          rent_start_date: { $gte: start, $lte: end },
          status: { $in: ["Returned"] },
        },
      },
      {
        $group: {
          _id: { $month: "$rent_start_date" },
          rental: { $sum: "$rent_amount" },
          rentalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Jan" },
                { case: { $eq: ["$_id", 2] }, then: "Feb" },
                { case: { $eq: ["$_id", 3] }, then: "Mar" },
                { case: { $eq: ["$_id", 4] }, then: "Apr" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "Jun" },
                { case: { $eq: ["$_id", 7] }, then: "Jul" },
                { case: { $eq: ["$_id", 8] }, then: "Aug" },
                { case: { $eq: ["$_id", 9] }, then: "Sep" },
                { case: { $eq: ["$_id", 10] }, then: "Oct" },
                { case: { $eq: ["$_id", 11] }, then: "Nov" },
                { case: { $eq: ["$_id", 12] }, then: "Dec" },
              ],
            },
          },
          rental: 1,
          rentalCount: 1,
        },
      },
    ]);

    const monthlyData: Array<{ month: string } & DataPoint> = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
      .map((month) => {
        const saleEntry = monthlySales.find((m) => m.month === month) || { sale: 0, saleCount: 0 };
        const rentalEntry = monthlyRentals.find((m) => m.month === month) || { rental: 0, rentalCount: 0 };
        return {
          month,
          sale: saleEntry.sale,
          rental: rentalEntry.rental,
          saleCount: saleEntry.saleCount,
          rentalCount: rentalEntry.rentalCount,
        };
      })
      .filter((m) => m.sale > 0 || m.rental > 0);

    // Yearly aggregation
    const yearlySales = await this._saleRepository.aggregate([
      {
        $match: {
          sale_date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { $year: "$sale_date" },
          sale: { $sum: "$price" },
          saleCount: { $sum: 1 },
        },
      },
      {
        $project: {
          year: { $toString: "$_id" },
          sale: 1,
          saleCount: 1,
        },
      },
    ]);

    const yearlyRentals = await this._rentRepository.aggregate([
      {
        $match: {
          rent_start_date: { $gte: start, $lte: end },
          status: { $in: ["Returned"] },
        },
      },
      {
        $group: {
          _id: { $year: "$rent_start_date" },
          rental: { $sum: "$rent_amount" },
          rentalCount: { $sum: 1 },
        },
      },
      {
        $project: {
          year: { $toString: "$_id" },
          rental: 1,
          rentalCount: 1,
        },
      },
    ]);

    const yearlyData: Array<{ year: string } & DataPoint> = Array.from(
      { length: end.getFullYear() - start.getFullYear() + 1 },
      (_, i) => (start.getFullYear() + i).toString()
    )
      .map((year) => {
        const saleEntry = yearlySales.find((y) => y.year === year) || { sale: 0, saleCount: 0 };
        const rentalEntry = yearlyRentals.find((y) => y.year === year) || { rental: 0, rentalCount: 0 };
        return {
          year,
          sale: saleEntry.sale,
          rental: rentalEntry.rental,
          saleCount: saleEntry.saleCount,
          rentalCount: rentalEntry.rentalCount,
        };
      })
      .filter((y) => y.sale > 0 || y.rental > 0);

    return { daily: dailyData, weekly: weeklyData, monthly: monthlyData, yearly: yearlyData };
  }

  private async getTopUsers(start: Date, end: Date, limit: number): Promise<User[]> {
    const sales = await this._saleRepository.aggregate([
      {
        $match: {
          sale_date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$buyerId",
          transactions: { $sum: 1 },
          amount: { $sum: "$price" },
        },
      },
    ]);

    const rentals = await this._rentRepository.aggregate([
      {
        $match: {
          rent_start_date: { $gte: start, $lte: end },
          status: { $in: [ "Returned"] },
        },
      },
      {
        $group: {
          _id: "$borrowerId",
          transactions: { $sum: 1 },
          amount: { $sum: "$rent_amount" },
        },
      },
    ]);

    // Combine sales and rentals by user
    const userMap = new Map<string, { transactions: number; amount: number }>();
    sales.forEach((sale) => {
      userMap.set(sale._id.toString(), {
        transactions: sale.transactions,
        amount: sale.amount,
      });
    });
    rentals.forEach((rental) => {
      const existing = userMap.get(rental._id.toString()) || { transactions: 0, amount: 0 };
      userMap.set(rental._id.toString(), {
        transactions: existing.transactions + rental.transactions,
        amount: existing.amount + rental.amount,
      });
    });

    // Fetch user details
    const topUsers = await Promise.all(
      Array.from(userMap.entries())
        .sort((a, b) => b[1].amount - a[1].amount)
        .slice(0, limit)
        .map(async ([userId, { transactions, amount }], index) => {
          const user = await this._userRepository.findById(userId);
          return {
            id: index + 1,
            name: user?.Name || "Unknown",
            transactions,
            amount,
          };
        })
    );

    return topUsers;
  }

  private async getTopCategories(start: Date, end: Date, limit: number): Promise<Category[]> {
    const sales = await this._saleRepository.aggregate([
      {
        $match: {
          sale_date: { $gte: start, $lte: end },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      {
        $match: {
          "book.status": "Sold Out",
        },
      },
      {
        $group: {
          _id: "$book.categoryId",
          sales: { $sum: 1 },
          amount: { $sum: "$price" },
        },
      },
    ]);

    const topCategories = await Promise.all(
      sales
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit)
        .map(async (cat, index) => {
          const category = await this._categoryRepository.findById(cat._id.toString());
          return {
            id: index + 1,
            name: category?.name || "Unknown",
            sales: cat.sales,
            amount: cat.amount,
          };
        })
    );

    return topCategories;
  }
}