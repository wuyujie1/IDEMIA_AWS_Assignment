import { Reservation } from "../utils/interface";
import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs";
import dayjs from "dayjs";
import React from "react";
import { convertDayToString } from "../utils/utils";

const API_ENDPOINT = process.env.REACT_APP_API_GATEWAY_URL;
const updateReservation = (row: Reservation, oriRow: Reservation, setDataUpdating: React.Dispatch<React.SetStateAction<boolean>>) => {
    let queryParams = "";
    const jsonBody: { [key: string]: string | boolean | number } = {};
    Object.entries(row).forEach(([key, value]) => {
        if (dayjs.isDayjs(value)) {
            jsonBody[key] = convertDayToString(value as dayjs.Dayjs);
        } else if (key == "roomquantity" && typeof value == "string") {
            jsonBody[key] = parseInt(value);
        } else if (key != "id") {
            jsonBody[key] = value;
        }
    });
    Object.entries(oriRow).forEach(([key, oriValue]) => {
        if (key != "id") {
            queryParams += `${key}=${oriValue == "" ? "null" : oriValue}&`;
        }
    });
    queryParams = queryParams.slice(0, -1);
    setDataUpdating(true);

    return fromFetch(`${API_ENDPOINT}/reservation?${queryParams}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({jsonBody}.jsonBody)
    }).pipe(
        switchMap(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Update failed");
            }
        }),
    );
};

export default updateReservation;