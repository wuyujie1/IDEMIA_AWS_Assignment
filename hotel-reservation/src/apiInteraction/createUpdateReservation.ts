import { Reservation } from "../utils/interface";
import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs";
import dayjs from "dayjs";
import { convertDayToString } from "../utils/utils";
import { saveBtn$ } from "../components/ModalDialog";

const API_ENDPOINT = process.env.REACT_APP_API_GATEWAY_URL;

export function prepareCreateUpdate(operation: string, updatedValues: Reservation, searchParams: Reservation) {
    let queryParams = "";
    const jsonBody: { [key: string]: string | boolean | number } = {};
    Object.entries(updatedValues).forEach(([key, value]) => {
        if (dayjs.isDayjs(value)) {
            jsonBody[key] = convertDayToString(value);
        } else if (key == "roomquantity" && typeof value == "string") {
            jsonBody[key] = parseInt(value);
        } else if (key != "id") {
            jsonBody[key] = value;
        }
    });

    if (operation == "update") {
        Object.entries(searchParams).forEach(([key, oriValue]) => {
            if (key != "id") {
                queryParams += `${key}=${oriValue == "" ? "null" : oriValue}&`;
            }
        });
        queryParams = queryParams.slice(0, -1);
    }

    return {query: queryParams, body: JSON.stringify({jsonBody}.jsonBody)};
}
function createUpdateReservation() {
    return saveBtn$.pipe(
        switchMap((params) => {
            const { query, body } = prepareCreateUpdate(params.operation, params.updatedValues, params.queryParams);
            const url = params.operation == "create" ? `${API_ENDPOINT}` : `${API_ENDPOINT}/reservation?${query}`;
            return fromFetch(url, {
                method: params.operation == "create" ? "POST" : "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: body
            }).pipe(
                switchMap(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Update failed");
                    }
                }),
            );
        })
    );
}

export default createUpdateReservation;