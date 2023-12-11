import { SearchParams } from "../utils/interface";
import dayjs from "dayjs";
import { prepareFetchingURL } from "./searchReservations";


jest.mock("rxjs/ajax");
describe("searchReservations", () => {

    it("should producing correct fetching URL, all null", () => {
        const searchParamsWithNull: SearchParams = {
            arrivaldate: dayjs("invalid-date-str"),
            departuredate: dayjs("invalid-date-str"),
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
        };
        const expectedQueryString = "arrivaldate=null&departuredate=null&firstname=null&lastname=null&email=null&phone=null";
        expect(prepareFetchingURL(searchParamsWithNull)).toBe(expectedQueryString);
    });

    it("should producing correct fetching URL", () => {
        const searchParamsWithNull: SearchParams = {
            arrivaldate: dayjs("2023-12-09"),
            departuredate: dayjs("2023-12-09"),
            firstname: "test",
            lastname: "testing",
            email: "test@testing.com",
            phone: "11111",
        };
        const expectedQueryString = "arrivaldate=2023-12-09T05:00:00.000Z&departuredate=2023-12-09T05:00:00.000Z&firstname=test&lastname=testing&email=test@testing.com&phone=11111";
        expect(prepareFetchingURL(searchParamsWithNull)).toBe(expectedQueryString);
    });


});