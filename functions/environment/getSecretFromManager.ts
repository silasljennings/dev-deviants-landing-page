import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import {adminApp} from "../src";

const secretManagerClient = new SecretManagerServiceClient();

export const getSecretFromManager = async (secretName: string): Promise<string> => {
    try {
        const projectId = adminApp.options.projectId
        const [accessResponse] = await secretManagerClient.accessSecretVersion({
            name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
        });

        const secret = accessResponse.payload?.data?.toString();

        if (!secret) {
            throw new Error("Secret payload is empty or undefined.");
        }

        return secret;
    } catch (error) {
        console.error("Error accessing secret:", error);
        throw new Error(`Failed to retrieve secret: ${error}`);
    }
};
