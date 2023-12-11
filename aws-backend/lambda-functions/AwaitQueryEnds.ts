"use strict";
const aws = require("aws-sdk");

const checkQueryExecution = async (queryExecutionId: string) => {
    const athenaDb = new aws.Athena();
    const queryExecution = await athenaDb.getQueryExecution({ QueryExecutionId: queryExecutionId }).promise();
    return queryExecution.QueryExecution.Status.State;
};
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

exports.handler = async (event: { [x: string]: any; }) => {
    try {
        const queryExecutionId = event["queryInfo"];
        let status: string = "";

        while (status !== "SUCCEEDED" && status !== "FAILED") {
            status = await checkQueryExecution(queryExecutionId);
            if (status === "RUNNING") {
                await sleep(500);
            }
        }

        if (status === "SUCCEEDED") {
            return {
                queryInfo: queryExecutionId,
                operation: event.operation
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify("Query execution failed."),
            };
        }
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred during query execution." }),
        };
    }
};