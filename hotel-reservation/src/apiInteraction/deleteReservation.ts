import { Reservation } from "../utils/interface";
import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs";
import dayjs from "dayjs";
import React from "react";

const API_ENDPOINT = process.env.REACT_APP_API_GATEWAY_URL;

const deleteReservation = (reservation: Reservation, setDataUpdating: React.Dispatch<React.SetStateAction<boolean>>) => {
    let queryParams = "";
    Object.entries(reservation).forEach(([key, value]) => {
        if (!dayjs.isDayjs(value) && key !== "id") {
            queryParams += `${key}=${value == "" ? "null" : value}&`;
        }
    });

    queryParams = queryParams.slice(0, -1);
    setDataUpdating(true);

    return fromFetch(`${API_ENDPOINT}/reservation?${queryParams.toString()}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).pipe(
        switchMap(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(`Deletion failed: ${text}`);
                });
            }
        }),
    );
};

export default deleteReservation;