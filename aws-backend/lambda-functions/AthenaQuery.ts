
import { Athena } from "@aws-sdk/client-athena";

interface EnvVariables {
    REGION: string;
    DB_NAME: string;
    OUTPUT_LOCATION: string;
}

function getEnvVariable(name: keyof EnvVariables): string {
    const value: string | undefined = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is not set`);
    }
    return value;
}

const region: string = getEnvVariable("REGION");
const db: string = getEnvVariable("DB_NAME");
const outputLoc: string = getEnvVariable("OUTPUT_LOCATION");

interface AthenaEvent {
    preparedQuery: string;
    operation: string;
}

export const handler = async (event: AthenaEvent): Promise<any> => {
    try {
        const athena: Athena = new Athena({ region: region });

        const params = {
            QueryString: event.preparedQuery,
            QueryExecutionContext: { Database: db },
            ResultConfiguration: {
                OutputLocation: outputLoc
            }
        };

        const queryExecutionId = await athena.startQueryExecution(params);

        return {
            queryInfo: queryExecutionId.QueryExecutionId,
            operation: event.operation
        };
    } catch (error) {
        console.error("Error executing Athena query:", error);
        throw new Error("Error executing Athena query");
    }
};