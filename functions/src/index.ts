import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import {setApiKey, send} from "@sendgrid/mail";
import {getSecretFromManager} from "./environment/getSecretFromManager";

// Initialize Firebase Admin SDK
export const adminApp = admin.initializeApp();
export const SINGLE_SENDER_EMAIL = "silasljennings@gmail.com"

/**
 * function triggered to send a welcome email when new subscriber written to the subscribers collection
 */
export const sendWelcomeEmail = onDocumentWritten('subscribers/{subscriberId}', async (event) => {
   try {
       const newValue = event.data?.after.data();

       if (!newValue) {
           throw new Error('No email address found in the document');
       }

       const subscriberEmail = newValue?.email;

       if (!subscriberEmail) {
           throw new Error('No email address found in the document');
       }

       const SEND_GRID_API_KEY = await getSecretFromManager("SEND_GRID_API_KEY");

       if (!SEND_GRID_API_KEY) {
           throw new Error("SendGrid API key was not set successfully");
       }

       setApiKey(SEND_GRID_API_KEY)

       const msg = {
           to: subscriberEmail, // recipient email
           from: SINGLE_SENDER_EMAIL, // sender email (your verified SendGrid email)
           subject: 'Welcome to Dev Deviants!',
           text: `Hi there, thank you for subscribing to Dev Deviants! We are excited to have you on board.`,
           html: `<strong>Hi there,</strong><br><br>Thank you for subscribing to Dev Deviants! We are excited to have you on board.`,
       };

       send(msg).then(() => { logger.info(`Welcome email sent`); });

   } catch (error) {
       logger.error(error);
   }
});
