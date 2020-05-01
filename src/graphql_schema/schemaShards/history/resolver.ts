import { Model } from './../../../mongo_schema';
import { helper } from './../../../utils/helper';

const { LiveReading, History, Machine, User } = Model;

const updatePendingStatus = async (process, args, context, info) => {
  const { id } = args;
  if (!id) {
    helper.handleCustomError('Input param missing', 404);
  }
  try {
    const liveReading = await LiveReading.findById(id);
    const machine = await Machine.findById(liveReading.machine.toString());
    const user = await User.findById(liveReading.creator.toString());
    if (!machine || !user) {
      helper.handleCustomError('Invalid params', 400);
    }
    const history = new History({
      machine,
      creator: user
    });
    const savedHistory = await history.save();
    await LiveReading.findByIdAndDelete(id);
    return {
      ...savedHistory._doc,
      _id: savedHistory._id.toString(),
      createdAt: savedHistory.createdAt.toISOString(),
      updatedAt: savedHistory.updatedAt.toISOString()
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const getHistoryCount = async (process, args, context, info) => {
  try {
    const count = await History.find().countDocuments();
    return count;
  } catch (exception) {
    helper.handleError(exception);
  }
};

export const historyResolver = {
  Query: {
    getHistoryCount
  },
  Mutation: {
    updatePendingStatus
  }
};
