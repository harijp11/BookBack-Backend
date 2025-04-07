import { BaseRoute } from "../base_route";

import { UserRoutes } from "../user/user_route";
import { AdminRoutes } from "../admin/admin_routes";

export class PrivateRoutes extends BaseRoute {
	constructor() {
		super();
	}
	protected initializeRoutes(): void {
		this.router.use("/_us", new UserRoutes().router);
		this.router.use("/_ad", new AdminRoutes().router);
	}
}