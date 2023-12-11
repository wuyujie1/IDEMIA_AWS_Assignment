// Importing aws-sdk-mock to mock AWS services
const AWSMock = require("aws-sdk-mock");
const AWS_test = require("aws-sdk");
AWSMock.setSDKInstance(AWS_test);

const lambdaHandler = require("./AwaitQueryEnds").handler;
describe("Await Athena Query ENds", () => {
    it("should return success when the query execution succeeds", async () => {
        AWSMock.mock("Athena", "getQueryExecution", (params: any, callback: (arg0: null, arg1: { QueryExecution: { Status: { State: string; }; }; }) => void) => {
            callback(null, {
                QueryExecution: {
                    Status: {
                        State: "SUCCEEDED"
                    }
                }
            });
        });
        const event = { queryInfo: "test", operation: "test-operation" };
        const response = await lambdaHandler(event);
        expect(response).toEqual({
            queryInfo: event.queryInfo,
            operation: event.operation
        });
        AWSMock.restore();
    });

    it("should return error when the query execution fails", async () => {
        AWSMock.mock("Athena", "getQueryExecution", (params: any, callback: (arg0: null, arg1: { QueryExecution: { Status: { State: string; }; }; }) => void) => {
            callback(null, {
                QueryExecution: {
                    Status: {
                        State: "FAILED"
                    }
                }
            });
        });

        const event = { queryInfo: "test", operation: "test-operation" };
        const response = await lambdaHandler(event);

        expect(response).toEqual({
            statusCode: 500,
            body: JSON.stringify("Query execution failed."),
        });
        AWSMock.restore();
    });
});

