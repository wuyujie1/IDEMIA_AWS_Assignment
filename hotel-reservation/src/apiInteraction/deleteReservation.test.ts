import { prepareDelete } from "./deleteReservation";
import { initNewRow, initRowWithData } from "../utils/utils";

import { Reservation } from "../utils/interface";

jest.mock("rxjs/ajax");

describe("deleteReservations", () => {

    it("should producing correct fetching URL, all null", () => {
        const deleteParamsWithNull: Reservation = initNewRow();
        const expectedQueryString = "arrivaldate=null&departuredate=null&roomsize=null&roomquantity=1&firstname=null&lastname=null&email=null&phone=null&streetname=null&streetnumber=null&zipcode=null&state=null&city=null&extras=null&payment=null&note=null&tags=null&reminder=null&newsletter=null&confirm=null";
        expect(prepareDelete(deleteParamsWithNull)).toBe(expectedQueryString);
    });

    it("should producing correct fetching URL", () => {
        const deleteParamsWithNull: Reservation = initRowWithData();
        const expectedQueryString = "arrivaldate=2021-11-18T05:00:00.000Z&departuredate=null&roomsize=null&roomquantity=2&firstname=testFirstName&lastname=testLastName&email=test@idm.com&phone=null&streetname=null&streetnumber=null&zipcode=null&state=null&city=null&extras=test1,test2,test3&payment=null&note=null&tags=null&reminder=null&newsletter=null&confirm=null";
        expect(prepareDelete(deleteParamsWithNull)).toBe(expectedQueryString);
    });


});