import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import searchReservations from "../apiInteraction/searchReservations";
import { ApiData, Reservation } from "../utils/interface";
import ModalDialog from "./ModalDialog";
import { Button } from "@mui/material";
import postReservation from "../apiInteraction/postReservation";
import deleteReservation from "../apiInteraction/deleteReservation";
import { initNewRow } from "../utils/utils";
import updateReservation from "../apiInteraction/updateReservation";

function convertAPIData (apiData: ApiData) {
    return apiData.body.map((item, index) => ({
        id: index,
        ...item
    }));
}

function SearchResult() {
    const [rows, setRows] = useState<Reservation[]>([]);
    const [selectedRow, setSelectedRow] = useState<Reservation | null>(null);
    const [dataUpdating, setDataUpdating] = useState(true);
    const [dialogForNewRow, setDialogForNewRow] = useState(false);

    const columns = [
        { field: "arrivaldate", headerName: "Arrival Date", width: 250 },
        { field: "departuredate", headerName: "Departure Date", width: 250 },
        { field: "firstname", headerName: "First Name", width: 130 },
        { field: "lastname", headerName: "Last Name", width: 130 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "phone", headerName: "Phone", width: 200 },
        { field: "roomsize", headerName: "Room Size", width: 200 }
    ];

    useEffect(() => {
        const subscription = searchReservations(setDataUpdating).subscribe({
            next: (apiData: ApiData) => {
                try{
                    const dataWithIds = convertAPIData(apiData);
                    setRows(dataWithIds);
                    setDataUpdating(false);
                } catch (e) {
                    setDataUpdating(false);
                    console.error("Error:", apiData);
                }
            },
            error: (err) => {
                setDataUpdating(false);
                console.error("Error:", err);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleDelete = (row: Reservation | null) => {
        if (row == null) {
            return;
        }
        const subscription = deleteReservation(row, setDataUpdating).subscribe({
            next: updatedData => {
                try {
                    const dataWithIds = convertAPIData(updatedData);
                    setRows(dataWithIds);
                    setDataUpdating(false);
                } catch (e) {
                    setDataUpdating(false);
                    console.error("Error:", updatedData);
                }

            },
            error: error => {
                setDataUpdating(false);
                console.error("Failed to delete the row:", error);
            },
        });
        setSelectedRow(null);
        return () => subscription.unsubscribe();
    };

    const handleNewBtnOnClick = () => {
        const newRow = initNewRow();
        setDialogForNewRow(true);
        setSelectedRow(newRow);
    };

    const handleCreateUpdate = (row: Reservation | null, oriRow: Reservation | null) => {
        if (oriRow == null || row == null) {
            return;
        }
        const subscriber = dialogForNewRow ? postReservation(row, setDataUpdating) : updateReservation(row, oriRow, setDataUpdating);
        const subscription = subscriber.subscribe({
            next: updatedData => {
                try {
                    const dataWithIds = convertAPIData(updatedData);
                    setRows(dataWithIds);
                    setDataUpdating(false);
                } catch (e) {
                    setDataUpdating(false);
                    console.error("Error:", updatedData);
                }
            },
            error: error => {
                setDataUpdating(false);
                console.error("Failed to update the row:", error);
            },
        });
        setSelectedRow(null);
        return () => subscription.unsubscribe();
    };

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                sx={{marginBottom: "2%"}}
                onClick={handleNewBtnOnClick}
            >
                New
            </Button>
            <DataGrid
                columns={columns}
                rows={rows}
                localeText={{ noRowsLabel: "Nothing to display :)" }}
                loading={dataUpdating}
                onRowClick={(params) => {
                    setSelectedRow(params.row);
                    setDialogForNewRow(false);}}
                sx={{
                    "& .MuiDataGrid-row:hover": {
                        cursor: "pointer",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        overflow: "visible"
                    },
                    minHeight: "300px"
                }}
            />
            <ModalDialog
                open={selectedRow !== null}
                onClose={() => setSelectedRow(null)}
                row={selectedRow}
                onDelete={handleDelete}
                onUpdate={handleCreateUpdate}
                forCreate={dialogForNewRow}
            />
        </div>
        
    );
}

export default SearchResult;