import { injectable } from "tsyringe";
import { IUserRepository } from "../../../entities/repositoryInterface/user/user_repository-interface";
import { UserModel } from "../../../frameworks/database/models/User_model";
import { IUserEntity } from "../../../entities/models/user_entity";

@injectable()
export class UserRepository implements IUserRepository {
    async save(data: Partial<IUserEntity>): Promise<IUserEntity> {
        return await UserModel.create(data);
    }

    async findByEmail(email: string): Promise<IUserEntity | null> {
        const User = await UserModel.findOne({ email }).lean();
        if (!User) return null;

        return {
            ...User,
            id: User._id.toString(),
        } as IUserEntity;
    }
  
    async findById(id: any): Promise<IUserEntity | null> {
        const User = await UserModel.findById(id).lean();
        if (!User) return null;

        return {
            ...User,
            id: User._id.toString(),
        } as IUserEntity;
    }

    async find(
        filter: any,
        skip: number,
        limit: number
    ): Promise<{ user: IUserEntity[] | []; total: number }> {
        const [users, total] = await Promise.all([
            UserModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            UserModel.countDocuments(filter),
        ]);
    
        const transformedUsers = users.map(user => ({
            ...user,
            id: user._id.toString(), // Add an additional 'id' field
            // Ensure _id is preserved as an ObjectId
        })) as IUserEntity[];
    
        return {
            user: transformedUsers,
            total,
        };
    }

    async updateByEmail(
        email: string,
        updates: Partial<IUserEntity>
    ): Promise<IUserEntity | null> {
        const User = await UserModel.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true }
        ).lean();
        if (!User) return null;

        return {
            ...User,
            id: User._id.toString(),
        } as IUserEntity;
    }

    async findByIdAndUpdate(
        id: any,
        updateData: Partial<IUserEntity>
    ): Promise<IUserEntity | null> {
        const User = await UserModel.findByIdAndUpdate(
            {_id:id},
            { $set: updateData },
            { new: true }
        ).lean();
        if (!User) return null;
        return {
            ...User,
            id: User._id.toString(),
        } as IUserEntity;
    }

    async findByIdAndChangePassword(_id: any, newPassword: string): Promise<IUserEntity | void> {
        const User = await UserModel.findByIdAndUpdate(
            _id,
            {$set:{password:newPassword}},
            {new:true}
        )
        return User as IUserEntity
    }
}