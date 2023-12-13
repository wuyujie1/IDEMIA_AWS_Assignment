import { prepareCreateUpdate } from "./createUpdateReservation";
import { Reservation } from "../utils/interface";
import {  initNewRow, initRowWithData } from "../utils/utils";

jest.mock("rxjs/fetch", () => ({
    fromFetch: jest.fn()
}));

describe("createUpdateReservation", () => {
    it("should producing correct fetching URL for update", () => {
        const updateQueryParameters: Reservation = initNewRow();
        const updatedData: Reservation = initRowWithData();
        const expectedQueryString = "arrivaldate=null&departuredate=null&roomsize=null&roomquantity=1&firstname=null&lastname=null&email=null&phone=null&streetname=null&streetnumber=null&zipcode=null&state=null&city=null&extras=null&payment=null&note=null&tags=null&reminder=null&newsletter=null&confirm=null";
        const {query, body} = prepareCreateUpdate("update", updatedData, updateQueryParameters);
        expect(query).toBe(expectedQueryString);
        expect(body).toBe(JSON.stringify(updatedData));
    });

    it("should producing correct fetching URL for create", () => {
        const updateQueryParameters: Reservation = initNewRow();
        const updatedData: Reservation = initRowWithData();
        const expectedQueryString = "";
        const {query, body} = prepareCreateUpdate("create", updatedData, updateQueryParameters);
        expect(query).toBe(expectedQueryString);
        expect(body).toBe(JSON.stringify(updatedData));
    });
});
