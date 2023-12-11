import { Athena } from "@aws-sdk/client-athena";

interface EnvVariables {
    REGION: string;
    DB_NAME: string;
    TABLE_NAME: string;
    OUTPUT_LOCATION: string;
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
const outputLoc: string = getEnvVariable("OUTPUT_LOCATION");
const region: string = getEnvVariable("REGION");

const athenaDB: Athena = new Athena({ region: region });

export const handler = async (): Promise<any> => {
    try {
        const query: string = `SELECT * FROM ${dbName}.${tableName}`;
        const params = {
            QueryString: query,
            QueryExecutionContext: { Database: dbName },
            ResultConfiguration: { OutputLocation: outputLoc }
        };

        const queryExecutionId = await athenaDB.startQueryExecution(params);
        return {
            queryInfo: queryExecutionId.QueryExecutionId,
        };
    } catch (error) {
        console.error("Error executing Athena query:", error);
        throw new Error("Error executing Athena query");
    }
};