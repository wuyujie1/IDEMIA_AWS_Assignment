import { handler } from "./AthenaQuery";
import { Athena } from "@aws-sdk/client-athena";

jest.mock("@aws-sdk/client-athena", () => ({
    Athena: jest.fn().mockImplementation(() => ({
        startQueryExecution: jest.fn().mockResolvedValue({ QueryExecutionId: "testExecutionId" }),
    })),
}));

describe("handler", () => {
    const mockEvent = {
        preparedQuery: "SELECT * FROM test_table;",
        operation: "search"
    };

    beforeEach(() => {
        (Athena as unknown as jest.Mock).mockClear();
    });

    it("should execute a query and return the execution ID and operation", async () => {
        const result = await handler(mockEvent);

        expect(result).toEqual({
            queryInfo: "testExecutionId",
            operation: "search"
        });

        expect(Athena).toHaveBeenCalledTimes(1);
    });

    it("should handle errors when query execution fails", async () => {
        (Athena as unknown as jest.Mock).mockImplementationOnce(() => ({
            startQueryExecution: jest.fn().mockRejectedValue(new Error("Query execution failed")),
        }));

        await expect(handler(mockEvent)).rejects.toThrow("Error executing Athena query");
    });
});