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
var _a = require("@aws-sdk/client-sfn"), SFNClient = _a.SFNClient, StartSyncExecutionCommand = _a.StartSyncExecutionCommand;
var mockClient = require("aws-sdk-client-mock").mockClient;
var sfnMock_delete = mockClient(SFNClient);
var lambdaHandler_delete = require("./PrepareDeleteQuery").handler;
describe("Prepare Delete Statement", function () {
    it("should process valid query parameters and start a sync execution", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockEvent, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sfnMock_delete.on(StartSyncExecutionCommand).resolves({
                        output: JSON.stringify({ result: "success" })
                    });
                    mockEvent = {
                        queryStringParameters: { firstname: "test", lastname: "test" }
                    };
                    return [4 /*yield*/, lambdaHandler_delete(mockEvent)];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(JSON.parse(response.body)).toEqual({ result: "success" });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle errors gracefully", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockEvent, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sfnMock_delete.on(StartSyncExecutionCommand).rejects(new Error("Error in Step Function Execution"));
                    mockEvent = {
                        queryStringParameters: { firstname: "test" }
                    };
                    return [4 /*yield*/, lambdaHandler_delete(mockEvent)];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(500);
                    expect(response.body).toBe(JSON.stringify({ message: "Internal Server Error" }));
                    return [2 /*return*/];
            }
        });
    }); });
    it("should call StartSyncExecutionCommand with correct SQL statement for DELETE operation", function () { return __awaiter(void 0, void 0, void 0, function () {
        var capturedParams, mockEvent, expectedQuery;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    capturedParams = null;
                    sfnMock_delete.on(StartSyncExecutionCommand).callsFake(function (params) {
                        capturedParams = params;
                        return Promise.resolve({
                            output: JSON.stringify({ result: "success" })
                        });
                    });
                    mockEvent = {
                        queryStringParameters: { firstname: "test", lastname: "testlastname" }
                    };
                    return [4 /*yield*/, lambdaHandler_delete(mockEvent)];
                case 1:
                    _a.sent();
                    expectedQuery = "DELETE FROM ".concat(process.env.DB_NAME, ".").concat(process.env.TABLE_NAME, " WHERE firstname = 'test' AND lastname = 'testlastname'");
                    expect(capturedParams).toBeTruthy();
                    expect(JSON.parse(capturedParams.input).preparedQuery).toEqual(expectedQuery);
                    return [2 /*return*/];
            }
        });
    }); });
});
export {};
