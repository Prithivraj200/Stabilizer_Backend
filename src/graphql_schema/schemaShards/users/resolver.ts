import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { Model } from '../../../mongo_schema';
import { IUser } from './../../../types/user';
import { helper } from '../../../utils/helper';
import { sendMail } from './../../../utils/send-mail';
import { countPerPage } from './../../../utils/constants';
import { authMiddleware } from './../../../middleware/auth';
import { SucessMessage } from '../../../utils/success-message';

const { User, Machine, History, LiveReading } = Model;

const createUser = async (process, args, context, info) => {
  try {
    await authMiddleware.verifyUser(context, true);
    const {
      userInput: { name, password, email, type, address = '', phone }
    } = args;
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name,
      password: hashedPassword,
      email,
      type,
      address,
      phone
    });
    const savedUser = await user.save();
    sendMail.onNewUser(email);
    return {
      ...savedUser._doc,
      _id: savedUser._id.toString(),
      createdAt: savedUser.createdAt.toISOString(),
      updatedAt: savedUser.updatedAt.toISOString()
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const loginUser = async (process, args, context, info) => {
  const {
    loginInput: { email, password }
  } = args;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      helper.handleCustomError('Invalid user', 401);
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      helper.handleCustomError('Invalid user', 401);
    }
    const { SIGNATURE } = helper.getEnvVariables();
    const token = jwt.sign(
      { _id: user._id.toString(), email: user.email },
      SIGNATURE
    );
    return { token, name: user.name, type: user.type };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const editUser = async (process, args, context, info) => {
  const {
    id,
    userInput: { name, password, email, type, address = '', phone }
  } = args;
  if (!id) {
    helper.handleCustomError('User not found', 404);
  }
  try {
    await authMiddleware.verifyUser(context, true);
    const user = await User.findById(id);
    user.name = name;
    user.email = email;
    user.type = type;
    user.address = address;
    user.phone = phone;
    const savedUser = await user.save();
    return {
      ...savedUser._doc,
      _id: savedUser._id.toString(),
      createdAt: savedUser.createdAt.toISOString(),
      updatedAt: savedUser.updatedAt.toISOString()
    }
  } catch (exception) {
    helper.handleError(exception);
  }
};

const deleteUser = async (process, args, context, info) => {
  const { id } = args;
  if (!id) {
    helper.handleCustomError('User not found', 404);
  }
  try {
    await authMiddleware.verifyUser(context, true);
    await Machine.deleteMany({ creator: helper.getObjectId(id) });
    await LiveReading.deleteMany({ creator: helper.getObjectId(id) });
    await History.deleteMany({ creator: helper.getObjectId(id) });
    await User.findByIdAndDelete(id);
    return {
      message: SucessMessage.deleteUser
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const getUsersByRole = async (process, args, context, info) => {
  const { role, page } = args;
  let userList;
  let userCount;
  if (!role) {
    helper.handleCustomError('Inputs are missing', 400);
  }
  try {
    if (page) {
      userCount = await User.find({ type: role }).countDocuments();
      const users = await User.find({ type: role })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * countPerPage)
        .limit(countPerPage);
      userList = users.map(user => {
        return {
          ...user._doc,
          _id: user._id.toString(),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        };
      });
    } else {
      const users = await User.find({ type: role }).sort({ updatedAt: -1 });
      userCount = users.length;
      userList = users.map(user => {
        return {
          ...user._doc,
          _id: user._id.toString(),
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString()
        };
      });
    }
    return {
      users: userList,
      totalCount: userCount
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const getUser = async (process, args, context, info) => {
  const userId = args.id || context.userId;
  try {
    await authMiddleware.verifyUser(context);
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

export const userResolver = {
  Query: {
    loginUser,
    getUsersByRole,
    getUser
  },
  Mutation: {
    createUser,
    editUser,
    deleteUser
  }
};
