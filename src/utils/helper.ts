import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

import { ENV } from '../types/env';
import { CustomError } from './../types/error';

const { ObjectId } = mongoose.Types;
let envVariables: ENV;

const handleError = (exception): never => {
  const error: CustomError = new Error(exception.message);
  error.status = exception.status || 400;
  throw error;
};

const handleCustomError = (message: string, statusCode: number): never => {
  const error: CustomError = new Error(message);
  error.status = statusCode;
  throw error;
};

const getObjectId = (id: string): mongoose.Types.ObjectId => {
  return new ObjectId(id);
};

const loadEnvVariables = (): void => {
  try {
    const envPath = path.join(__dirname, '..', '..', '.env');
    const data = fs.readFileSync(envPath, { encoding: 'utf-8' });
    const envDataPairs = data.split('\n');

    envVariables = envDataPairs.reduce((obj, pair) => {
      const arr = pair.split('=');
      obj[arr[0]] = arr[1];
      return obj;
    }, {}) as ENV;
  } catch (e) {
    handleCustomError('Unable to read env file', 500);
  }
};

const getEnvVariables = (): ENV => envVariables;

export const helper = {
  handleError,
  handleCustomError,
  getObjectId,
  loadEnvVariables,
  getEnvVariables
};
