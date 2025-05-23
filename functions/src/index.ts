import {onDocumentCreated} from "firebase-functions/firestore";
import {getSecretFromManager} from "./environment/getSecretFromManager";
import {ConfirmEmail} from "./emails/confirm-email";

export const SINGLE_SENDER_EMAIL = "silasljennings@gmail.com"

/**
 * function triggered to send a welcome email when new subscriber created in the subscribers collection
 */
export const sendWelcomeEmail = onDocumentCreated('email_verifications/{email_verification_id}', async (event) => {
    try {
        const newValue = event.data?.data();
        if (!newValue) { throw new Error('No email address found in the document'); }

        const subscriberEmail = newValue?.email;
        if (!subscriberEmail) { throw new Error('No email address found in the document'); }

        const token = newValue?.token;
        if(!token) { throw new Error('No token found in the document'); }

        const SEND_GRID_API_KEY = await getSecretFromManager("SEND_GRID_API_KEY");
        if (!SEND_GRID_API_KEY) { throw new Error("SendGrid API key was not set successfully"); }

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(SEND_GRID_API_KEY);
        const html = ConfirmEmail.getHtml(token);

        const msg = {
            to: subscriberEmail, // recipient email
            from: SINGLE_SENDER_EMAIL, // sender email (your verified SendGrid email)
            subject: 'Welcome to Dev Deviants!',
            html: html,
        };

        sgMail.send(msg).then(async () => {
            console.info(`Welcome email sent. Saving Email Verification Doc...`);
        });
    } catch (error) { console.error(error); }
});