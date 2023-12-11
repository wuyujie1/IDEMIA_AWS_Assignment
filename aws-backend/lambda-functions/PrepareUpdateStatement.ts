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
        const queryParams = event.queryStringParameters;
        const jsonData = JSON.parse(event.body);

        const setValues = Object.entries(jsonData).map(([key, value]) => {
            const formattedValue = typeof value === "string" && key != "id" ? `'${value}'` : value;
            return `${key} = ${formattedValue}`;
        }).join(", ");

        let query: string = `UPDATE ${dbName}.${tableName} SET ${setValues} WHERE`;
        Object.entries(queryParams).forEach(([key, value]) => {
            if (key === "roomquantity") {
                value = parseInt(value, 10);
            } else if (["reminder", "newsletter", "confirm"].includes(key)) {
                value = value === "true";
            } else if (value === "null") {
                return;
            }
            const formattedValue = typeof value === "string" ? `'${value}'` : value;
            query += ` ${key} = ${formattedValue} AND`;
        });

        // Remove the last 'AND'
        query = query.slice(0, -4);

        const params: StartSyncExecutionCommand = new StartSyncExecutionCommand({
            "input": JSON.stringify({ "preparedQuery": query, "operation": "update" }),
            "name": "Update",
            "stateMachineArn": stateMachineArn
        });

        const stepFunctions: SFNClient = new SFNClient({ region: region });
        const response = await stepFunctions.send(params);

        return { headers: responseHeader, statusCode: 200, body: response.output };
    } catch (error) {
        return { headers: responseHeader, statusCode: 500, body: JSON.stringify({ message: "Internal Server Error" }) };
    }
};