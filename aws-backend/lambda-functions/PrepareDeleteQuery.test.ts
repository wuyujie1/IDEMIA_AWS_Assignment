const { SFNClient, StartSyncExecutionCommand } = require("@aws-sdk/client-sfn");
const { mockClient } = require("aws-sdk-client-mock");

const sfnMock_delete = mockClient(SFNClient);

const lambdaHandler_delete = require("./PrepareDeleteQuery").handler;
describe("Prepare Delete Statement", () => {

    it("should process valid query parameters and start a sync execution", async () => {
        sfnMock_delete.on(StartSyncExecutionCommand).resolves({
            output: JSON.stringify({ result: "success" })
        });

        const mockEvent = {
            queryStringParameters: { firstname: "test", lastname: "test" }
        };
        const response = await lambdaHandler_delete(mockEvent);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({ result: "success" });
    });

    it("should handle errors gracefully", async () => {
        sfnMock_delete.on(StartSyncExecutionCommand).rejects(new Error("Error in Step Function Execution"));

        const mockEvent = {
            queryStringParameters: { firstname: "test" }
        };
        const response = await lambdaHandler_delete(mockEvent);

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ message: "Internal Server Error" }));
    });

    it("should call StartSyncExecutionCommand with correct SQL statement for DELETE operation", async () => {
        let capturedParams: any = null;

        sfnMock_delete.on(StartSyncExecutionCommand).callsFake((params: any) => {
            capturedParams = params;
            return Promise.resolve({
                output: JSON.stringify({ result: "success" })
            });
        });

        const mockEvent = {
            queryStringParameters: { firstname: "test", lastname: "testlastname" }
        };
        await lambdaHandler_delete(mockEvent);

        const expectedQuery = `DELETE FROM ${process.env.DB_NAME}.${process.env.TABLE_NAME} WHERE firstname = 'test' AND lastname = 'testlastname'`;

        expect(capturedParams).toBeTruthy();
        expect(JSON.parse(capturedParams.input).preparedQuery).toEqual(expectedQuery);
    });
});

export {};
