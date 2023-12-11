var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { SFNClient, StartSyncExecutionCommand } from "@aws-sdk/client-sfn";
function getEnvVariable(name) {
    var value = process.env[name];
    if (!value) {
        throw new Error("Environment variable ".concat(name, " is not set"));
    }
    return value;
}
var dbName = getEnvVariable("DB_NAME");
var tableName = getEnvVariable("TABLE_NAME");
var region = getEnvVariable("REGION");
var stateMachineArn = getEnvVariable("STATE_MACHINE_ARN");
var responseHeader = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json"
};
export var handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var queryParams, jsonData, setValues, query_1, params, stepFunctions, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!event.body)
                    return [2 /*return*/, { headers: responseHeader, statusCode: 500, body: JSON.stringify({ message: "Request Body Not Found" }) }];
                queryParams = event.queryStringParameters;
                jsonData = JSON.parse(event.body);
                setValues = Object.entries(jsonData).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    var formattedValue = typeof value === "string" && key != "id" ? "'".concat(value, "'") : value;
                    return "".concat(key, " = ").concat(formattedValue);
                }).join(", ");
                query_1 = "UPDATE ".concat(dbName, ".").concat(tableName, " SET ").concat(setValues, " WHERE");
                Object.entries(queryParams).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (key === "roomquantity") {
                        value = parseInt(value, 10);
                    }
                    else if (["reminder", "newsletter", "confirm"].includes(key)) {
                        value = value === "true";
                    }
                    else if (value === "null") {
                        return;
                    }
                    var formattedValue = typeof value === "string" ? "'".concat(value, "'") : value;
                    query_1 += " ".concat(key, " = ").concat(formattedValue, " AND");
                });
                // Remove the last 'AND'
                query_1 = query_1.slice(0, -4);
                params = new StartSyncExecutionCommand({
                    "input": JSON.stringify({ "preparedQuery": query_1, "operation": "update" }),
                    "name": "Update",
                    "stateMachineArn": stateMachineArn
                });
                stepFunctions = new SFNClient({ region: region });
                return [4 /*yield*/, stepFunctions.send(params)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, { headers: responseHeader, statusCode: 200, body: response.output }];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, { headers: responseHeader, statusCode: 500, body: JSON.stringify({ message: "Internal Server Error" }) }];
            case 3: return [2 /*return*/];
        }
    });
}); };
