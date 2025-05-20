import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { app } from "../../startup/apps";

const secretManagerClient = new SecretManagerServiceClient();

export const getSecretFromManager = async (secretName: string): Promise<string> => {
    try {
        // Access the latest version of the secret
        const projectId = app.options.projectId
        console.log("getSecretFromManager", projectId);
        const [accessResponse] = await secretManagerClient.accessSecretVersion({
            name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
        });
        const secret = accessResponse.payload?.data?.toString();
        if (!secret) { throw new Error("Secret payload is empty or undefined."); }
        return secret;
    } catch (error) {
        console.error("Error accessing secret:", error);
        throw new Error(`Failed to retrieve secret: ${error}`);
    }
};
