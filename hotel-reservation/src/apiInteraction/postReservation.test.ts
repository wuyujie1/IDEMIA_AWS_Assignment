import postReservation from "./postReservation";
import { convertDayToString, initApiInteractionTests } from "../utils/utils";
import { fromFetch } from "rxjs/fetch";
import React from "react";
import { MockFetchResponse, Reservation } from "../utils/interface";
import dayjs from "dayjs";

jest.mock("rxjs/fetch", () => ({
    fromFetch: jest.fn()
}));

describe("postReservation", () => {
    let mockReservation: Reservation;
    let mockSetDataUpdating: React.Dispatch<React.SetStateAction<boolean>>;
    let mockResponse: MockFetchResponse;

    beforeEach(() => {
        ({ mockReservation, mockSetDataUpdating, mockResponse } = initApiInteractionTests());
    });

    it("should make a POST request with the correct URL and body", () => {
        postReservation(mockReservation, mockSetDataUpdating);
        expect(fromFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_GATEWAY_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mockReservation)
        });
    });

    it("should convert roomQuantity to int (if it was converted to string by TextInput) when preparing request body", () => {
        mockReservation.roomquantity = "2";
        postReservation(mockReservation, mockSetDataUpdating);
        expect(fromFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_GATEWAY_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...mockReservation, roomquantity:2})
        });
    });

    it("should convert and catch invalid arrival/departure date to string when preparing request body", () => {
        mockReservation.arrivaldate = dayjs();
        mockReservation.departuredate = dayjs("invalid-date-str");
        postReservation(mockReservation, mockSetDataUpdating);
        expect(fromFetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_GATEWAY_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({...mockReservation, arrivaldate:convertDayToString(mockReservation.arrivaldate), departuredate: "null"})
        });
    });

    it("should complete the observable without errors for successful creation", (done) => {
        const result = postReservation(mockReservation, mockSetDataUpdating);
        result.subscribe({
            next: response => {
                expect(response).toEqual({ success: true });
            },
            error: () => {
                throw new Error("Should not emit an error for successful creation");
            },
            complete: done
        });
    });

    it("should emit an error for failed creation", (done) => {
        mockResponse.ok = false;
        const result = postReservation(mockReservation, mockSetDataUpdating);
        result.subscribe({
            next: () => {
                throw new Error("Should not emit a next value for failed creation");
            },
            error: err => {
                expect(err.message).toEqual("Creation failed: Server error");
                done();
            },
            complete: () => {
                throw new Error("Should not complete for failed creation");
            }
        });
    });
});