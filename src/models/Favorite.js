import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure a user can only favorite a specific video once
FavoriteSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
