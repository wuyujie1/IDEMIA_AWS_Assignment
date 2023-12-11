interface AthenaQueryResult {
  Data: Array<{ VarCharValue?: string }>;
}

interface LambdaEvent {
  body: string;
}

const convertField = (key: string, value: string): string | number | boolean => {
    if (key === "roomquantity") {
        return Number(value);
    } else if (key === "reminder" || key === "newsletter" || key === "confirm") {
        return value.toLowerCase() === "true";
    }
    return value;
};

export const handler = async (event: LambdaEvent): Promise<{ statusCode: number; body: any }> => {
    try {
        const body = event.body;
        if (!body) {
            return {
                statusCode: 500,
                body: { error: "Error processing Athena query result" }
            };
        }
        const parsedResult: AthenaQueryResult[] = JSON.parse(body);

        const columnNames: string[] = parsedResult[0].Data.map(column => column.VarCharValue || "");

        const rows = parsedResult.slice(1).map(row => {
            const rowData: { [key: string]: string | number | boolean } = {};
            row.Data.forEach((cell, index) => {
                const key: string = columnNames[index];
                const cellValue: string = cell.VarCharValue || "";
                rowData[key] = convertField(key, cellValue);
            });
            return rowData;
        });

        return {
            statusCode: 200,
            body: rows
        };
    } catch (error) {
        console.error("Error processing Athena query result:", error);
        return {
            statusCode: 500,
            body: { error: "Error processing Athena query result" }
        };
    }
};
