import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import WebSocket from 'ws';

import { Model } from './../mongo_schema';
import { helper } from './../utils/helper';
import { CustomError } from '../types/error';
import { IContext } from '../types/middleware';

const { User } = Model;

function createContext(authHeader: string): IContext {
  let isAuth = false;
  let userId = null;
  let isAdmin = false;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const { SIGNATURE } = helper.getEnvVariables();
        const decodedToken: any = jwt.verify(token, SIGNATURE);
        if (decodedToken) {
          isAuth = true;
          ({ _id: userId } = decodedToken);
        }
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return {
    isAuth,
    userId,
  };
}

const handleGraphQLContext = (ctx: {
  connection?: any;
  req?: Request;
  res?: Response;
}): IContext => {
  const { req, connection } = ctx;
  if (connection) {
    return connection.context;
  }
  const header = req.get('Authorization');
  return createContext(header);
};

const handleGraphQLSubscriptionContext = (
  connectionParams: { authToken: string },
  webSocket: WebSocket
): IContext => {
  const token = connectionParams.authToken;
  return createContext(token);
};

const verifyUser = async (
  context: IContext,
  checkRole: boolean = false
): Promise<void> => {
  try {
    if (checkRole) {
      const user = await User.findById(context.userId);
      if (!user) {
        helper.handleCustomError('User not authorized', 403);
      }
      const isAdmin = user.type === 'ADMIN';
      checkAuthorzation(isAdmin, context);
    }
    checkAuthorzation(true, context);
  } catch (exception) {
    helper.handleError(exception);
  }
};

function checkAuthorzation(
  canAllow: boolean,
  context: IContext
): string | never {
  if (!context.isAuth || !context.userId || !canAllow) {
    const error: CustomError = new Error(
      'Not Authorized to perform this operation'
    );
    error.status = 401;
    throw error;
  }
  return 'valid user';
}

export const authMiddleware = {
  verifyUser,
  handleGraphQLContext,
  handleGraphQLSubscriptionContext,
};
