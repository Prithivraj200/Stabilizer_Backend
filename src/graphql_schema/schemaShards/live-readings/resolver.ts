import { Model } from '../../../mongo_schema';
import { helper } from './../../../utils/helper';
import { countPerPage } from './../../../utils/constants';
import { authMiddleware } from './../../../middleware/auth';
import { pubsub } from '../../../utils/subscription-manager';
import { SucessMessage } from './../../../utils/success-message';

const LIVE_TRACKING = 'live-readings';
const { LiveReading, Machine, User } = Model;

const getLiveReadingById = {
  subscribe: () => pubsub.asyncIterator([LIVE_TRACKING])
};

const getPendingList = async (process, args, context, info) => {
  const { page } = args;
  try {
    await authMiddleware.verifyUser(context, true);
    const pendingCount = await LiveReading.find().countDocuments();
    const pendingList = await LiveReading.find()
      .populate('machine creator')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * countPerPage)
      .limit(countPerPage);
    const modifiedList = pendingList.map(pendingItem => {
      return {
        ...pendingItem._doc,
        _id: pendingItem._id.toString(),
        createdAt: pendingItem.createdAt.toISOString(),
        updatedAt: pendingItem.updatedAt.toISOString()
      };
    });
    return {
      pendingReadings: modifiedList,
      totalCount: pendingCount
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const addLiveReadings = async (process, args, context, info) => {
  const {
    liveInput: { readings, machineId }
  } = args;
  const { userId } = context;
  if (!readings || !machineId || !userId) {
    helper.handleCustomError('Invalid inputs!', 401);
  }
  try {
    const machine = await Machine.findById(machineId);
    if (!machine) {
      helper.handleCustomError('Invalid operation', 404);
    }
    const user = await User.findById(userId);
    if (!user) {
      helper.handleCustomError(`Invalid operation`, 401);
    }
    const liveTracking = new LiveReading({
      readings,
      machine,
      creator: user
    });
    const savedTracking = await liveTracking.save();
    pubsub.publish(LIVE_TRACKING, {
      getLiveReadingById: {
        readings,
        machine,
        _id: savedTracking._id.toString(),
        createdAt: savedTracking.createdAt.toISOString(),
        updatedAt: savedTracking.updatedAt.toISOString()
      }
    });
    return {
      message: SucessMessage.addReadings
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

export const liveReadingResolver = {
  Query: {
    getPendingList
  },
  Mutation: {
    addLiveReadings
  },
  Subscription: {
    getLiveReadingById
  }
};
