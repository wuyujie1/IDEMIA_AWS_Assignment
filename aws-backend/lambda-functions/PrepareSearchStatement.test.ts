import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
import { mockClient } from "aws-sdk-client-mock";
const sfnMock = mockClient(SFNClient);
import { handler } from "./PrepareSearchStatement";


describe("Prepare Search Statement", () => {

    it("should call StartSyncExecutionCommand with correct SQL statement for SEARCH operation", async () => {
        let capturedParams: any = null;

        sfnMock.on(StartSyncExecutionCommand).callsFake((params: any) => {
            capturedParams = params;
            return Promise.resolve({
                output: JSON.stringify({ result: "success" })
            });
        });
        const mockEvent = {
            queryStringParameters: { firstname: "test", lastname: "testlastname" }
        };
        await handler(mockEvent);

        const expectedQuery = `SELECT * FROM ${process.env.DB_NAME}.${process.env.TABLE_NAME} WHERE 1=1 AND upper(firstname) LIKE upper('test') AND upper(lastname) LIKE upper('testlastname')`;

        expect(capturedParams).toBeTruthy();
        expect(JSON.parse(capturedParams.input).preparedQuery).toEqual(expectedQuery);
    });

    it("should handle errors gracefully", async () => {
        sfnMock.on(StartSyncExecutionCommand).rejects(new Error("Mocked error"));

        const response = await handler({ queryStringParameters: { test: "test" } });

        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ message: "Internal Server Error" }));
    });
});

export{};