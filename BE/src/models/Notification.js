import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // The job seeker who receives this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The newly posted job related to this notification
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    // Notification message (e.g., "New React Developer job posted by Infosys")
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt to show newest first
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
