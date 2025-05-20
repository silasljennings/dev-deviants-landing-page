import { SecretManagerServiceClient } from "@google-cloud/secret-manager"

const secretClient: SecretManagerServiceClient = new SecretManagerServiceClient()

const getSecret = async (req, projectId: string): Promise<string> => {
    const secretName = req.data.secret;

    if (!secretName) {
        throw new Error('Secret name not provided');
    }

    const secretPath = `projects/${projectId}/secrets/${secretName}/versions/latest`;

    try {
        const [version] = await secretClient.accessSecretVersion({name: secretPath});

        if (!version.payload || !version.payload.data) {
            throw new Error('Secret payload is empty or missing');
        }

        return version.payload.data.toString();
    } catch (error) {
        console.error('Failed to access secret:', error);
        throw new Error('Failed to retrieve secret');
    }
}

export {
    getSecret,
}