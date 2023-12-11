import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import { mockClient } from "aws-sdk-client-mock";
const sfnMock = mockClient(SFNClient);
import { handler } from "./PrepareUpdateStatement";

describe("Lambda Function Tests", () => {


    it("should construct correct SQL UPDATE statement and call StartSyncExecutionCommand", async () => {
        let capturedParams: any = null;

        sfnMock.on(StartSyncExecutionCommand).callsFake((params: any) => {
            capturedParams = params;
            return Promise.resolve({
                output: JSON.stringify({ result: "success" })
            });
        });

        const mockEvent = {
            queryStringParameters: { firstname: "test", lastname: "test" },
            body: JSON.stringify({ lastname: "updated" })
        };
        await handler(mockEvent);

        const expectedQuery = `UPDATE ${process.env.DB_NAME}.${process.env.TABLE_NAME} SET lastname = 'updated' WHERE firstname = 'test' AND lastname = 'test'`;
        expect(capturedParams).toBeTruthy();
        expect(JSON.parse(capturedParams.input).preparedQuery).toEqual(expectedQuery);
    });

    it("should handle errors gracefully", async () => {
        const response = await handler({ queryStringParameters: { key1: "value1" } });

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ message: "Request Body Not Found" }));
    });

    it("should handle Step Functions execution errors", async () => {
        sfnMock.on(StartSyncExecutionCommand).rejects(new Error("Mocked error"));

        const mockEvent = {
            body: JSON.stringify({ firstname: "test" }),
            queryStringParameters: { firstname: "test" }
        };
        const response = await handler(mockEvent);

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ message: "Internal Server Error" }));
    });
});
