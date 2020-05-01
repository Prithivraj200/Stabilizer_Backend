import { Model } from '../../../mongo_schema';
import { helper } from './../../../utils/helper';
import { authMiddleware } from './../../../middleware/auth';

const { User, LiveReading } = Model;

const getDashboardOverview = async (process, args, context, info) => {
  try {
    await authMiddleware.verifyUser(context, true);
    const pendingCount = await LiveReading.countDocuments();
    const dealerCount = await User.find({ type: 'DEALER' }).countDocuments();
    const userCount = await User.find({ type: 'USER' }).countDocuments();
    return {
      pendingCount,
      dealerCount,
      userCount
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

export const overviewResolver = {
  Query: {
    getDashboardOverview
  }
};
