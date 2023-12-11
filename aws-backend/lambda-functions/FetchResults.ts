const AWS = require("aws-sdk");

const getQueryResults = async (queryExecutionId: string) => {
    const athena = new AWS.Athena();
    return await athena.getQueryResults({ QueryExecutionId: queryExecutionId }).promise();
};

exports.handler = async (event: { [x: string]: any; }) => {
    try {
        const queryExecutionId = event["queryInfo"];

        const results = await getQueryResults(queryExecutionId);
        return {
            statusCode: 200,
            body: JSON.stringify(results["ResultSet"]["Rows"]),
        };

    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred during query execution." }),
        };
    }
};