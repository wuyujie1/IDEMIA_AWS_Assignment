import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";

interface EnvVariables {
    DB_NAME: string;
    TABLE_NAME: string;
    REGION: string;
    STATE_MACHINE_ARN: string;
}

function getEnvVariable(name: keyof EnvVariables): string {
    const value: string | undefined = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set`);
    }
    return value;
}

const dbName: string = getEnvVariable("DB_NAME");
const tableName: string = getEnvVariable("TABLE_NAME");
const region: string = getEnvVariable("REGION");
const stateMachineArn: string = getEnvVariable("STATE_MACHINE_ARN");

interface Event {
    body?: string;
}

const responseHeader = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Credentials" : true,
    "Content-Type": "application/json"
};
export const handler = async (event: Event): Promise<any> => {
    try {
        if (!event.body) return { headers: responseHeader, statusCode: 500, body: JSON.stringify({ message: "Request Body Not Found" }) };
        const jsonData = JSON.parse(event.body);

        const columns: string = Object.keys(jsonData).join(", ");
        const values: string = Object.values(jsonData).map(value => {
            return typeof value === "string" ? `'${value}'` : value;
        }).filter(value => value !== null).join(", ");

        const query: string = `INSERT INTO ${dbName}.${tableName} (${columns}) VALUES (${values})`;

        const params: StartSyncExecutionCommand = new StartSyncExecutionCommand({
            input: JSON.stringify({ "preparedQuery": query, "operation": "create" }),
            name: "Create",
            stateMachineArn: stateMachineArn
        });

        const stepFunctions: SFNClient = new SFNClient({ region: region });
        const response = await stepFunctions.send(params);

        return { headers: responseHeader, statusCode: 200, body: response.output };
    } catch (error) {
        console.error(error);
        return { headers: responseHeader, statusCode: 500, body: JSON.stringify({ message: "Internal Server Error" }) };
    }
};