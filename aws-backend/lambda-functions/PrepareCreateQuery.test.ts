const { SFNClient, StartSyncExecutionCommand } = require("@aws-sdk/client-sfn");
const { mockClient } = require("aws-sdk-client-mock");
const sfnMock = mockClient(SFNClient);
const lambdaHandler_create = require("./PrepareCreateQuery").handler;

describe("Prepare Create Statement", () => {
    it("should process valid input and start a sync execution", async () => {
        sfnMock.on(StartSyncExecutionCommand).resolves({
            output: JSON.stringify({ result: "success" })
        });

        const mockEvent = {
            body: JSON.stringify({ firstname: "test", lastname: "test" })
        };
        const response = await lambdaHandler_create(mockEvent);
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({ result: "success" });
    });

    it("should return an error when body is missing", async () => {
        const mockEvent = {};
        const response = await lambdaHandler_create(mockEvent);

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ message: "Request Body Not Found" }));
    });

    it("should handle errors gracefully", async () => {
        const mockEvent = {
            body: "invalid test body"
        };
        const response = await lambdaHandler_create(mockEvent);

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ message: "Internal Server Error" }));
    });

    it("should call StartSyncExecutionCommand with correct SQL statement for INSERT operation", async () => {
        let capturedParams: any = null;

        sfnMock.on(StartSyncExecutionCommand).callsFake((params: any) => {
            capturedParams = params;
            return Promise.resolve({
                output: JSON.stringify({ result: "success" })
            });
        });

        const mockEvent = {
            body: JSON.stringify({ firstname: "test", lastname: "testlast" })
        };
        await lambdaHandler_create(mockEvent);

        const expectedQuery = `INSERT INTO ${process.env.DB_NAME}.${process.env.TABLE_NAME} (firstname, lastname) VALUES ('test', 'testlast')`;
        expect(capturedParams).toBeTruthy();
        expect(JSON.parse(capturedParams.input).preparedQuery).toEqual(expectedQuery);
    });
});

export {};