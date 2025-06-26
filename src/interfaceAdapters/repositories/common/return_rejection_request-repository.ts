import { injectable } from "tsyringe";
import { IReturnRejectionRequestRepository } from "../../../entities/repositoryInterface/common/return_rejection_request_repository-interface";
import { IReturnRejectionRequestcreateDTO } from "../../../entities/models/return_rejection_request_input_data_entity";
import { IReturnRejectionRequestModel, ReturnRejectionRequestModel } from "../../../frameworks/database/models/return_rejection_request_model";
import { Schema } from "mongoose";
import { BaseRepository } from "../baseRepo/base_repository";

@injectable()
export class ReturnRejectionRequestRepository extends BaseRepository<IReturnRejectionRequestModel,IReturnRejectionRequestcreateDTO> implements IReturnRejectionRequestRepository {
  constructor(){
    super(ReturnRejectionRequestModel); 
  }
   
 async findById(retRejId: string): Promise<IReturnRejectionRequestModel | null> {
    return  await ReturnRejectionRequestModel.findOne({_id:retRejId})
  }

 

  async findAllReturnRejectionRequestAnalysis(baseFilter: object, skip: number, limit: number): Promise<{
    returnRejectionRequest: IReturnRejectionRequestModel[];
    totalReturnRejectionRequest: number;
    topFiveMostComplainted: Array<{
      _id: Schema.Types.ObjectId;
      count: number;
      user: {
        name: string;
        email: string;
      }
    }>;
    topFiveMostComplaintedTo: Array<{
      _id: Schema.Types.ObjectId;
      count: number;
      user: {
        name: string;
        email: string;
      }
    }>;
    totalPages: number;
    currentPage: number;
  }> {

    const returnRejectionRequestsQuery = await ReturnRejectionRequestModel.find(baseFilter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate({
    path: 'rentId',
    populate: {
      path: 'bookId',
      model: 'Book', 
    },
  })
  .populate('ownerId')
  .populate('borrowerId');

  
  // 2. Total count for pagination
  const totalCountQuery =await ReturnRejectionRequestModel.countDocuments(baseFilter);

  // 3. Top five users who complained the most (borrowers who submitted the most return rejection requests)

 
  const topFiveMostComplaintedQuery = await ReturnRejectionRequestModel.aggregate( [
    { $group: { 
      _id: "$ownerId", 
      count: { $sum: 1 },
      userName: { $first: "$ownerId" }
    }},
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }},
    { $unwind: "$user" },
    { $project: {
      _id: 1,
      count: 1,
      user: { name: "$user.name", email: "$user.email" }
    }}
  ]);

  const topFiveMostComplaintedToQuery = await ReturnRejectionRequestModel.aggregate([
    { $group: { 
      _id: "$borrowerId", 
      count: { $sum: 1 },
      userName: { $first: "$borrowerId" }
    }},
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }},
    { $unwind: "$user" },
    { $project: {
      _id: 1,
      count: 1,
      user: { name: "$user.name", email: "$user.email" }
    }}
  ]);
  
  const [
    returnRejectionRequest,
    totalReturnRejectionRequest,
    topFiveMostComplainted,
    topFiveMostComplaintedTo
  ] = await Promise.all([
    returnRejectionRequestsQuery,
    totalCountQuery,
    topFiveMostComplaintedQuery,
    topFiveMostComplaintedToQuery
  ]);

 
 
 

  return {
    returnRejectionRequest,
    
    totalReturnRejectionRequest,
    
    topFiveMostComplainted,
    
    topFiveMostComplaintedTo,
    
    totalPages: Math.ceil(totalReturnRejectionRequest / limit),

    currentPage:Math.floor(skip / limit) + 1
  };
  }



  // async updateStatus(retRejId: string, status: string): Promise<void> {
  //   await ReturnRejectionRequestModel.findByIdAndUpdate(
  //     {_id:retRejId},
  //     {$set:{status}},
  //     {new:true}
  //   )
  // }
}