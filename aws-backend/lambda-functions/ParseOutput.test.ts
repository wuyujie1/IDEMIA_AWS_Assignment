// Importing your Lambda function
const lambdaHandler_parse_output = require("./ParseOutput").handler;

describe("Parse Output Test", () => {
    it("should correctly process valid input with various field conversions", async () => {
        const mockEvent = {
            body: JSON.stringify([
                { Data: [{ VarCharValue: "roomquantity" }, { VarCharValue: "reminder" }, { VarCharValue: "name" }] },
                { Data: [{ VarCharValue: "3" }, { VarCharValue: "false" }, { VarCharValue: "Test" }] }
            ])
        };
        const response = await lambdaHandler_parse_output(mockEvent);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ roomquantity: 3, reminder: false, name: "Test" }]);
    });

    it("should filter out empty fields", async () => {
        const mockEvent = {
            body: JSON.stringify([
                { Data: [{ VarCharValue: "roomquantity" }] },
                { Data: [{ VarCharValue: "" }] }
            ])
        };
        const response = await lambdaHandler_parse_output(mockEvent);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([{ roomquantity: 0 }]);
    });

    it("should return an error for invalid or missing input", async () => {
        const mockEvent = { body: null };
        const response = await lambdaHandler_parse_output(mockEvent);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: "Error processing Athena query result" });
    });

    it("should return an error for failed fetch result", async () => {
        const mockEvent = { statusCode: 500 };
        const response = await lambdaHandler_parse_output(mockEvent);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({ error: "Error processing Athena query result" });
    });
});
