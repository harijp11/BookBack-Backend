import { injectable } from "tsyringe";
import { IRedisTokenRepository } from "../../../entities/repositoryInterface/redis/redis_token_repository-interface";
import user from "../../../frameworks/cache/redis_client";

@injectable()
export class RedisTokenRepository implements IRedisTokenRepository {
	async blackListToken(token: string, expiresIn: number): Promise<void> {
		await user.set(token, "blacklisted", { EX: expiresIn });
	}

	async isTokenBlackListed(token: string): Promise<boolean> {
		const result = await user.get(token);
		return result === "blacklisted";
	}

	async storeResetToken(userId: string, token: string): Promise<void> {
		const key = `reset_token:${userId}`;
		await user.setEx(key, 300, token);
	}

	async verifyResetToken(userId: string, token: string): Promise<boolean> {
		const key = `reset_token:${userId}`;
		const storedToken = await user.get(key);
		return storedToken === token;
	}

	async deleteResetToken(userId: string) {
		const key = `reset_token:${userId}`;
		await user.del(key);
	}
}