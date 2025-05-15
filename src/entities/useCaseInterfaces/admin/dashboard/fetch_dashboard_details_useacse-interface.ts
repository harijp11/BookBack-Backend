import { DashboardData } from "../../../models/dashboard_entities";


export interface IFetchDashboardDetailsUseCase {
    execute(
        startDate?: string,
        endDate?: string,
        view?: 'daily' | 'weekly' | 'monthly' | 'yearly',
        topLimit?: string
      ): Promise<DashboardData>
}