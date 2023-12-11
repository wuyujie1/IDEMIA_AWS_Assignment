import { Reservation } from "../utils/interface";
import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs";
import dayjs from "dayjs";
import React from "react";
import { convertDayToString } from "../utils/utils";

const API_ENDPOINT = process.env.REACT_APP_API_GATEWAY_URL;

const postReservation = (reservation: Reservation, setDataUpdating: React.Dispatch<React.SetStateAction<boolean>>) => {
    const jsonBody: { [key: string]: string | boolean | number } = {};

    Object.entries(reservation).forEach(([key, value]) => {
        if (dayjs.isDayjs(value)) {
            jsonBody[key] = convertDayToString(value);
        } else if (key === "roomquantity" && typeof value === "string") {
            jsonBody[key] = parseInt(value);
        } else if (key !== "id") {
            jsonBody[key] = value;
        }
    });
    setDataUpdating(true);

    return fromFetch(`${API_ENDPOINT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonBody)
    }).pipe(
        switchMap(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(`Creation failed: ${text}`);
                });
            }
        }),
    );
};

export default postReservation;