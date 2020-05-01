import bcrypt from "bcryptjs";
import { helper } from "../../../utils/helper";
import { Model } from "./../../../mongo_schema";
import { sendMail } from "./../../../utils/send-mail";
import { countPerPage } from "./../../../utils/constants";
import { authMiddleware } from "./../../../middleware/auth";
import { SucessMessage } from "./../../../utils/success-message";

const { Machine, User, History, LiveReading } = Model;

const getMachines = async (process, args, context, info) => {
  const { page } = args;
  try {
    await authMiddleware.verifyUser(context, true);
    const machineCount = await Machine.find({}).countDocuments();
    const machines = await Machine.find({})
      .populate("creator")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * countPerPage)
      .limit(countPerPage);
    const machineList = machines.map(machine => {
      return {
        ...machine._doc,
        _id: machine._id.toString(),
        createdAt: machine.createdAt.toISOString(),
        updatedAt: machine.updatedAt.toISOString()
      };
    });
    return {
      machines: machineList,
      totalCount: machineCount
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const getMachinesByUser = async (process, args, context, info) => {
  const { page, id } = args;
  const userId = id || context.userId;
  try {
    await authMiddleware.verifyUser(context);
    const machineCount = await Machine.find({
      creator: helper.getObjectId(userId)
    }).countDocuments();
    const machines = await Machine.find({
      creator: helper.getObjectId(userId)
    })
      .populate("creator")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * countPerPage)
      .limit(countPerPage);
    const machineList = machines.map(machine => {
      return {
        ...machine._doc,
        _id: machine._id.toString(),
        createdAt: machine.createdAt.toISOString(),
        updatedAt: machine.updatedAt.toISOString()
      };
    });
    return {
      machines: machineList,
      totalCount: machineCount
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const getMachine = async (process, args, context, info) => {
  const { id } = args;
  if (!id) {
    helper.handleCustomError("Input param is missing", 400);
  }
  try {
    await authMiddleware.verifyUser(context);
    const machine = await Machine.findById(id).populate("creator");
    return {
      ...machine._doc,
      _id: machine._id.toString(),
      createdAt: machine.createdAt.toISOString(),
      updatedAt: machine.updatedAt.toISOString()
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const createMachineByUser = async (process, args, context, info) => {
  const {
    machineInput: {
      name: machineName,
      description,
      machineType,
      loadCapacity,
      userInput: { name, password, type, phone, email, address }
    }
  } = args;
  try {
    await authMiddleware.verifyUser(context, true);
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
    const machine = new Machine({
      name: machineName,
      description,
      machineType,
      loadCapacity,
      creator: savedUser
    });
    const savedMachine = await machine.save();
    sendMail.onNewUser(email);
    return {
      message: "MACHINE ADDED WITH USER"
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const createMachineByDealer = async (process, args, context, info) => {
  const {
    machineInput: { name, description, creator, machineType, loadCapacity }
  } = args;
  try {
    await authMiddleware.verifyUser(context, true);
    const user = await User.findById(creator);
    if (!user) {
      helper.handleCustomError("Dealer not found", 404);
    }
    const machine = new Machine({
      name,
      description,
      machineType,
      loadCapacity,
      creator: user
    });
    const savedMachine = await machine.save();
    return {
      message: "MACHINE ADDED WITH DEALER"
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const editMachine = async (process, args, context, info) => {
  const {
    id,
    machineInput: { name, description, machineType, loadCapacity }
  } = args;
  if (!id) {
    helper.handleCustomError("Input param is missing", 404);
  }
  try {
    await authMiddleware.verifyUser(context, true);
    const machine = await Machine.findById(id).populate("creator");
    if (!machine) {
      helper.handleCustomError("Machine not found", 404);
    }
    machine.name = name;
    machine.description = description;
    machine.machineType = machineType;
    machine.loadCapacity = loadCapacity;
    await machine.save();
    return {
      ...machine._doc,
      _id: machine._id.toString(),
      createdAt: machine.createdAt.toISOString(),
      updatedAt: machine.updatedAt.toISOString()
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

const deleteMachine = async (process, args, context, info) => {
  const { id } = args;
  if (!id) {
    helper.handleCustomError("Input param is missing", 404);
  }
  try {
    await authMiddleware.verifyUser(context, true);
    await History.deleteMany({ machine: helper.getObjectId(id) });
    await LiveReading.deleteMany({ machine: helper.getObjectId(id) });
    await Machine.findByIdAndDelete(id);
    return {
      message: SucessMessage.deleteMachine
    };
  } catch (exception) {
    helper.handleError(exception);
  }
};

export const machineResolver = {
  Query: {
    getMachine,
    getMachines,
    getMachinesByUser
  },
  Mutation: {
    createMachineByUser,
    createMachineByDealer,
    editMachine,
    deleteMachine
  }
};
