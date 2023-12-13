import { Reservation } from "../utils/interface";
import { fromFetch } from "rxjs/fetch";
import { switchMap } from "rxjs";
import dayjs from "dayjs";
import { deleteBtn$ } from "../components/ModalDialog";

const API_ENDPOINT = process.env.REACT_APP_API_GATEWAY_URL;

export function prepareDelete(params: Reservation) {
    let queryParams = "";
    Object.entries(params).forEach(([key, value]) => {
        if (!dayjs.isDayjs(value) && key !== "id") {
            queryParams += `${key}=${value == "" ? "null" : value}&`;
        }
    });

    queryParams = queryParams.slice(0, -1);
    return queryParams;
}
function deleteReservation() {
    return deleteBtn$.pipe(
        switchMap((queryParams) => {
            return fromFetch(`${API_ENDPOINT}/reservation?${prepareDelete(queryParams as Reservation)}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
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

export default deleteReservation;