import { search$ } from "../components/SearchCriteria";
import { debounceTime, Observable, switchMap } from "rxjs";
import dayjs from "dayjs";
import { ajax } from "rxjs/ajax";
import { ApiData, SearchParams } from "../utils/interface";
import React from "react";
import { convertDayToString } from "../utils/utils";

const API_ENDPOINT = process.env.REACT_APP_API_GATEWAY_URL;

export function prepareFetchingURL(searchParams: SearchParams): string {
    return Object.entries(searchParams)
        .map(([key, value]) => {
            if (dayjs.isDayjs(value)) {
                value = convertDayToString(value);
            } else if (value === "") {
                value = "null";
            }
            return `${key}=${value}`;
        }).join("&");
}

function searchReservation(setDataUpdating: React.Dispatch<React.SetStateAction<boolean>>): Observable<ApiData> {
    return search$.pipe(
        debounceTime(500),
        switchMap(searchParams => {
            setDataUpdating(true);
            const query = prepareFetchingURL(searchParams);
            const url = `${API_ENDPOINT}?${query}`;
            return ajax.getJSON<ApiData>(url);
        })
    );
}

export default searchReservation;