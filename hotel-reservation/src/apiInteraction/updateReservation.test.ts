import updateReservation from "./updateReservation";
import { fromFetch } from "rxjs/fetch";
import { MockFetchResponse, Reservation } from "../utils/interface";
import React from "react";
import { convertDayToString, initApiInteractionTests } from "../utils/utils";
import dayjs from "dayjs";

jest.mock("rxjs/fetch", () => ({
    fromFetch: jest.fn()
}));

describe("updateReservation", () => {
    let mockReservation: Reservation;
    let mockSetDataUpdating: React.Dispatch<React.SetStateAction<boolean>>;
    let mockResponse: MockFetchResponse;

    beforeEach(() => {
        ({ mockReservation, mockSetDataUpdating, mockResponse } = initApiInteractionTests());
    });

    it("should make a PUT request with the correct URL and body", () => {
        updateReservation(mockReservation, mockReservation, mockSetDataUpdating);
        expect(fromFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_GATEWAY_URL}/reservation?arrivaldate=2021-11-18T05:00:00.000Z&departuredate=null&roomsize=null&roomquantity=2&firstname=testFirstName&lastname=testLastName&email=test@idm.com&phone=null&streetname=null&streetnumber=null&zipcode=null&state=null&city=null&extras=test1,test2,test3&payment=null&note=null&tags=null&reminder=null&newsletter=null&confirm=null`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mockReservation)
        });
    });

    it("should make a PUT request with the correct URL and body with roomquantity converted to string", () => {
        mockReservation.roomquantity = "2";
        updateReservation(mockReservation, mockReservation, mockSetDataUpdating);
        expect(fromFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_GATEWAY_URL}/reservation?arrivaldate=2021-11-18T05:00:00.000Z&departuredate=null&roomsize=null&roomquantity=2&firstname=testFirstName&lastname=testLastName&email=test@idm.com&phone=null&streetname=null&streetnumber=null&zipcode=null&state=null&city=null&extras=test1,test2,test3&payment=null&note=null&tags=null&reminder=null&newsletter=null&confirm=null`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...mockReservation, roomquantity: 2})
        });
    });

    it("should not affect query parameters (use old params for WHERE clause) but have updated value in request body (send new params for SET clause )", () => {
        updateReservation( { ...mockReservation, departuredate: dayjs() }, mockReservation, mockSetDataUpdating);
        expect(fromFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_GATEWAY_URL}/reservation?arrivaldate=2021-11-18T05:00:00.000Z&departuredate=null&roomsize=null&roomquantity=2&firstname=testFirstName&lastname=testLastName&email=test@idm.com&phone=null&streetname=null&streetnumber=null&zipcode=null&state=null&city=null&extras=test1,test2,test3&payment=null&note=null&tags=null&reminder=null&newsletter=null&confirm=null`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...mockReservation, departuredate: convertDayToString(dayjs())})
        });
    });

    it("should complete the observable without errors for successful update", (done) => {
        const result = updateReservation(mockReservation, mockReservation, mockSetDataUpdating);
        result.subscribe({
            next: response => {
                expect(response).toEqual({ success: true });
            },
            error: () => {
                throw new Error("Should not emit an error for successful update");
            },
            complete: done
        });
    });

    it("should emit an error for failed creation", (done) => {
        mockResponse.ok = false;
        const result = updateReservation(mockReservation, mockReservation, mockSetDataUpdating);
        result.subscribe({
            next: () => {
                throw new Error("Should not emit a next value for failed update");
            },
            error: err => {
                expect(err.message).toEqual("Update failed");
                done();
            },
            complete: () => {
                throw new Error("Should not complete for failed update");
            }
        });
    });
});
