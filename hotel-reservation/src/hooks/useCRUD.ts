import { useState, useEffect } from "react";
import { Subscription } from "rxjs";
import searchReservations from "../apiInteraction/searchReservations";
import { ApiData, Reservation } from "../utils/interface";
import createUpdateReservation from "../apiInteraction/./createUpdateReservation";
import deleteReservation from "../apiInteraction/deleteReservation";

function convertAPIData (apiData: ApiData) {
    return apiData.body.map((item, index) => ({
        id: index,
        ...item
    }));
}
const useCRUD = () => {
    const [data, setData] = useState<Reservation[]>([]);

    useEffect(() => {
        const searchSubscription: Subscription = searchReservations().subscribe({
            next: (apiData) => {
                setData(convertAPIData(apiData));
            },
            error: (err) => {
                console.error(err);
            }
        });

        const createUpdateSubscription: Subscription = createUpdateReservation().subscribe({
            next: (apiData) => {
                setData(convertAPIData(apiData));
            },
            error: (err) => {
                console.error(err);
            }
        });

        const deleteSubscription: Subscription = deleteReservation().subscribe({
            next: (apiData) => {
                setData(convertAPIData(apiData));
            },
            error: (err) => {
                console.error(err);
            }
        });

        return () => {
            searchSubscription.unsubscribe();
            createUpdateSubscription.unsubscribe();
            deleteSubscription.unsubscribe();
        };
    }, []);

    return { data };
};

export default useCRUD;
