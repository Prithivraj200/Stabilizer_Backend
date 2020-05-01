import { google } from 'googleapis';
import nodemailer, { Transporter } from 'nodemailer';

import { helper } from './helper';
import { GetAccessTokenResponse } from './../types/mail';

let transporter: Transporter;

const getAccessToken = (): Promise<GetAccessTokenResponse> => {
  const {
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    REFRESH_TOKEN
  } = helper.getEnvVariables();
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
  });
  return oauth2Client.getAccessToken();
};

const createTransporter = async (): Promise<Transporter> => {
  try {
    const accessTokenResponse = await getAccessToken();
    const {
      CLIENT_ID,
      CLIENT_SECRET,
      SENDER_EMAIL,
      REFRESH_TOKEN
    } = helper.getEnvVariables();
    const newTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessTokenResponse.token
      }
    });
    transporter = newTransporter;
    return transporter;
  } catch (exception) {
    console.log(exception);
  }
};

const getTransporter = async (): Promise<Transporter> => {
  if (transporter) {
    return transporter;
  }
  return createTransporter();
};

const onNewUser = async (email: string): Promise<boolean> => {
  const { SENDER_EMAIL } = helper.getEnvVariables();
  const mailOptions = {
    from: SENDER_EMAIL,
    to: email,
    subject: 'Sending Email using Node.js',
    html: `<b>Test</b>`
  };
  try {
    const transporter = await getTransporter();
    await transporter.sendMail(mailOptions);
    return true;
  } catch (exception) {
    return false;
  }
};

export const sendMail = {
  onNewUser
};
