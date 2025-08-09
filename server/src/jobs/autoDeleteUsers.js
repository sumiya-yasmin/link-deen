import cron from 'node-cron';
import User from '../models/user.js';

export const startAutoDeleteJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();

      const result = await User.deleteMany({
        isDeleted: true,
        deletionScheduledAt: { $lte: now },
      });

      console.log(`Auto deleted ${result.deletedCount} users at ${now.toISOString()}`);
    } catch (error) {
      console.error('Error auto deleting users:', error);
    }
  });
};
