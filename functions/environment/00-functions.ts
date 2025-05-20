import { onRequest, onCall } from "firebase-functions/v2/https";
import { getSecretOnCall } from "./getSecretOnCall";
import { getSecretOnRequest } from "./getSecretOnRequest";

const onCallGetSecret = onCall(async (req) => {
    const secret = await getSecretOnCall(req)
    console.log('onCallGetSecret function finished execution.');
    return secret;
});

const onRequestGetSecret = onRequest(async (req, res) => {
    const secret = await getSecretOnRequest(req);
    console.log('onRequestGetSecret function finished execution.');
    res.status(200).json(secret);
});


/***
 Exporting the Environment functions under the group name ENV
 ***/
export const ENV = {
    onCallGetSecret,
    onRequestGetSecret,
}