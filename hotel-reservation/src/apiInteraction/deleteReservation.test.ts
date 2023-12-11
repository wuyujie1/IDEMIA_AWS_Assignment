import deleteReservation from "./deleteReservation";
import { initApiInteractionTests } from "../utils/utils";
import { fromFetch } from "rxjs/fetch";
import React from "react";
import { MockFetchResponse, Reservation } from "../utils/interface";

jest.mock("rxjs/fetch", () => ({
    fromFetch: jest.fn()
}));


describe("deleteReservation", () => {
    let mockReservation: Reservation;
    let mockSetDataUpdating: React.Dispatch<React.SetStateAction<boolean>>;
    let mockResponse: MockFetchResponse;

    beforeEach(() => {
        ({ mockReservation, mockSetDataUpdating, mockResponse } = initApiInteractionTests());
    });

    it("should make a DELETE request with the correct URL and headers", () => {
        deleteReservation(mockReservation, mockSetDataUpdating);
        expect(fromFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_GATEWAY_URL}/reservation?arrivaldate=2021-11-18T05:00:00.000Z&departuredate=null&roomsize=null&roomquantity=2&firstname=testFirstName&lastname=testLastName&email=test@idm.com&phone=null&streetname=null&streetnumber=null&zipcode=null&state=null&city=null&extras=test1,test2,test3&payment=null&note=null&tags=null&reminder=null&newsletter=null&confirm=null`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        });
    });

    it("should complete the observable without errors for successful deletion", (done) => {
        const result = deleteReservation(mockReservation, mockSetDataUpdating);
        result.subscribe({
            next: response => {
                expect(response).toEqual({ success: true });
            },
            error: () => {
                throw new Error("Should not emit an error for successful deletion");
            },
            complete: done
        });
    });

    it("should emit an error for failed deletion", (done) => {
        mockResponse.ok = false;
        const result = deleteReservation(mockReservation, mockSetDataUpdating);
        result.subscribe({
            next: () => {
                throw new Error("Should not emit a next value for failed deletion");
            },
            error: err => {
                expect(err.message).toEqual("Deletion failed: Server error");
                done();
            },
            complete: () => {
                throw new Error("Should not complete for failed deletion");
            }
        });
    });
});
