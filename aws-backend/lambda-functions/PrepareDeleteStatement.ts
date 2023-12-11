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
  queryStringParameters: {
    [key: string]: any;
  };
}

const responseHeader = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Headers":"Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept",
    "Access-Control-Allow-Credentials" : true,
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET,OPTIONS,DELETE,PUT,POST"
};
export const handler = async (event: Event): Promise<any> => {
    try {
        const queryParams = event.queryStringParameters;

        let query: string = `DELETE FROM ${dbName}.${tableName} WHERE`;
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value === "null") {
                return;
            } else if (key == "roomquantity") {
                value = parseInt(value, 10);
            } else if (["reminder", "newsletter", "confirm"].includes(key)) {
                value = value === "true";
            }
            const formattedValue = typeof value === "string" ? `'${value}'` : value;
            query += ` ${key} = ${formattedValue} AND`;
        });

        // Remove the last 'AND'
        query = query.slice(0, -4);

        const params: StartSyncExecutionCommand = new StartSyncExecutionCommand({
            "input": JSON.stringify({ "preparedQuery": query, "operation": "delete" }),
            "name": "Delete",
            "stateMachineArn": stateMachineArn
        });

        const stepFunctions: SFNClient = new SFNClient({ region: region });
        const response = await stepFunctions.send(params);

        return { headers: responseHeader, statusCode: 200, body: response.output };
    } catch (error) {
        return { headers: responseHeader, statusCode: 500, body: JSON.stringify({ message: "Internal Server Error" }) };
    }
};