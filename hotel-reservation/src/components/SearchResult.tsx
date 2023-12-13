import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Reservation } from "../utils/interface";
import ModalDialog from "./ModalDialog";
import { Button } from "@mui/material";
import { initNewRow } from "../utils/utils";
import useCRUD from "../hooks/useCRUD";

function SearchResult() {
    const [selectedRow, setSelectedRow] = useState<Reservation | null>(null);
    const [dialogForNewRow, setDialogForNewRow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { data } = useCRUD();

    const columns = [
        { field: "arrivaldate", headerName: "Arrival Date", width: 250 },
        { field: "departuredate", headerName: "Departure Date", width: 250 },
        { field: "firstname", headerName: "First Name", width: 130 },
        { field: "lastname", headerName: "Last Name", width: 130 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "phone", headerName: "Phone", width: 200 }
    ];

    useEffect(() => {
        setIsLoading(false);
    }, [data]);

    const handleNewBtnOnClick = () => {
        const newRow = initNewRow();
        setDialogForNewRow(true);
        setSelectedRow(newRow);
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
                loading={isLoading}
                rows={data}
                localeText={{ noRowsLabel: "Nothing to display :)" }}
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
                onClose={() => {
                    setSelectedRow(null);
                }}
                setIsLoading={setIsLoading}
                row={selectedRow}
                forCreate={dialogForNewRow}
            />
        </div>
        
    );
}

export default SearchResult;