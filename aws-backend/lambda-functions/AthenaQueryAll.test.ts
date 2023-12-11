import { handler } from "./AthenaQueryAll";
import { Athena } from "@aws-sdk/client-athena";

jest.mock("@aws-sdk/client-athena");

describe("Athena Query Execution", () => {
    beforeEach(() => {
        (Athena as unknown as jest.Mock).mockClear();
    });
    
    it("should handle errors during query execution", async () => {
        (Athena as unknown as jest.Mock).mockImplementation(() => ({
            startQueryExecution: jest.fn().mockRejectedValue(new Error("Query execution failed")),
        }));
        await expect(handler()).rejects.toThrow("Error executing Athena query");
    });

    it("should throw an error if environment variables are not set", async () => {
        delete process.env.DB_NAME;
        await expect(handler()).rejects.toThrow();
    });
});