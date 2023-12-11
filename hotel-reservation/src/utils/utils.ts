import { MockFetchResponse, Reservation } from "./interface";
import { fromFetch } from "rxjs/fetch";
import { of } from "rxjs";
import React from "react";
import dayjs from "dayjs";

export function initNewRow(): Reservation {
    return {
        arrivaldate: "",
        departuredate: "",
        roomsize: "",
        roomquantity: 1,
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        streetname: "",
        streetnumber: "",
        zipcode: "",
        state: "",
        city: "",
        extras: "",
        payment: "",
        note: "",
        tags: "",
        reminder: false,
        newsletter: false,
        confirm: false,
    };
}

export function convertDayToString(value: dayjs.Dayjs): string {
    return value.isValid() ? value.format("YYYY-MM-DD") + "T05:00:00.000Z" : "null";
}

export function initApiInteractionTests() {
    const mockReservation: Reservation = {
        arrivaldate: "2021-11-18T05:00:00.000Z",
        departuredate: "",
        roomsize: "",
        roomquantity: 2,
        firstname: "testFirstName",
        lastname: "testLastName",
        email: "test@idm.com",
        phone: "",
        streetname: "",
        streetnumber: "",
        zipcode: "",
        state: "",
        city: "",
        extras: "test1,test2,test3",
        payment: "",
        note: "",
        tags: "",
        reminder: false,
        newsletter: false,
        confirm: false,
    };

    const mockSetDataUpdating: React.Dispatch<React.SetStateAction<boolean>> = jest.fn();
    const mockResponse: MockFetchResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true }),
        text: jest.fn().mockResolvedValue("Server error")
    };

    (fromFetch as jest.Mock).mockReturnValue(of(mockResponse));
    
    return { mockReservation,  mockSetDataUpdating, mockResponse };
}