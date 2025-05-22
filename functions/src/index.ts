import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import * as admin from "firebase-admin";
import {setApiKey, send} from "@sendgrid/mail";
import {getSecretFromManager} from "./environment/getSecretFromManager";
import {v4 as uuidv4} from "uuid"
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin SDK
export const adminApp = admin.initializeApp();
export const db = admin.firestore();
export const SINGLE_SENDER_EMAIL = "silasljennings@gmail.com"


const confirmEmailTemplatePath = path.join(
    __dirname,    // points at functions/lib or functions/src (depending on your build)
    '../emails/confirm-email.html'
);

// Read it once at startup
const confirmEmailHtml = fs.readFileSync(
    confirmEmailTemplatePath,
    'utf8'
);

/**
 * function triggered to send a welcome email when new subscriber written to the subscribers collection
 */
export const sendWelcomeEmail = onDocumentWritten('subscribers/{subscriberId}', async (event) => {
   try {
       const newValue = event.data?.after.data();
       if (!newValue) { throw new Error('No email address found in the document'); }

       const subscriberEmail = newValue?.email;
       if (!subscriberEmail) { throw new Error('No email address found in the document'); }

       const SEND_GRID_API_KEY = await getSecretFromManager("SEND_GRID_API_KEY");
       if (!SEND_GRID_API_KEY) { throw new Error("SendGrid API key was not set successfully"); }

       setApiKey(SEND_GRID_API_KEY);

       const verificationToken = uuidv4();
       const html = confirmEmailHtml.replace(/{{VERIFICATION_TOKEN}}/g, verificationToken);

       const msg = {
           to: subscriberEmail, // recipient email
           from: SINGLE_SENDER_EMAIL, // sender email (your verified SendGrid email)
           subject: 'Welcome to Dev Deviants!',
           html: html,
       };

       send(msg).then(async () => {
           logger.info(`Welcome email sent. Saving Email Verification Doc...`);
           const emailVerificationId = uuidv4()
           const stamp = new Date().getTime();

           const emailVerification = {
               uid: emailVerificationId,
               token: verificationToken,
               created_stamp: stamp,
               updated_stamp: stamp,
               expired_stamp: new Date(stamp + 7 * 24 * 60 * 60 * 1000).getTime(),
               email: subscriberEmail
           }

           await db.collection('email_verifications').doc(emailVerificationId).set(emailVerification).then(() => {
               logger.info("Email verification doc set successfully.");
           })
       });
   } catch (error) { logger.error(error); }
});
