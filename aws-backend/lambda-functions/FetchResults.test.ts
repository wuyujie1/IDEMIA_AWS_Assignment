// Importing aws-sdk-mock to mock AWS services
const AWSMock_fetch_result = require("aws-sdk-mock");
const AWS_fetch_result = require("aws-sdk");
AWSMock_fetch_result.setSDKInstance(AWS_fetch_result);

const lambdaHandler_fetch_result = require("./FetchResults").handler;


describe("Fetch Results", () => {
    it("should return query results successfully", async () => {
        AWSMock_fetch_result.mock("Athena", "getQueryResults", (params: any, callback: (arg0: null, arg1: { ResultSet: { Rows: string[]; }; }) => void) => {
            callback(null, {
                ResultSet: {
                    Rows: ["row1", "row2", "row3"]
                }
            });
        });
        const event = { queryInfo: "test" };
        const response = await lambdaHandler_fetch_result(event);

        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify(
                ["row1", "row2", "row3"]),
        });
        AWSMock_fetch_result.restore();
    });

    it("should handle errors during query result retrieval", async () => {
        AWSMock_fetch_result.mock("Athena", "getQueryResults", (params: any, callback: (arg0: Error) => void) => {
            callback(new Error("An error occurred during query execution."));
        });
        const event = { queryInfo: "test" };
        const response = await lambdaHandler_fetch_result(event);

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred during query execution." }),
        });
        AWSMock_fetch_result.restore();
    });
});
