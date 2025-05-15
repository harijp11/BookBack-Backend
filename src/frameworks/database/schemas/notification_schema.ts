import { Schema } from 'mongoose';
import { INotificationModel } from '../models/notification_model';

export const NotificationSchema = new Schema<INotificationModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['warning', 'info', 'fault', 'good', 'normal'],
      required: true,
    },
    isRead: { type: Boolean, default: false },
    navlink: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);


