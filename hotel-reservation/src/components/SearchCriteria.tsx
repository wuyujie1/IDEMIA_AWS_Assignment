import React, { useEffect, useState } from "react";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BehaviorSubject } from "rxjs";
import dayjs from "dayjs";
import { maxFirstNameLength, maxLastNameLength } from "../utils/configs";
import { SearchParams } from "../utils/interface";
import InputNames from "./InputNames";

const initialValues: SearchParams = {
    arrivaldate: null,
    departuredate: null,
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
};

const search = new BehaviorSubject(initialValues);
export const search$ = search.asObservable();
function SearchCriteria() {
    const [values, setValues] = useState(initialValues);

    useEffect(() => {
        search.next(values);
    }, [values]);

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {name, value} = e.target;
        if (value.includes("&") || value.includes("=")) {
            return;
        }
        setValues({
            ...values,
            [name]:value
        });
    };
    const handleDateChange = (field: string, newDate: dayjs.Dayjs | null) => {
        if (newDate != null) setValues({...values, [field]: newDate});
    };

    return (
        <form>
            <Grid container spacing={1}>
                <Grid item xs={5} sm={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Arrival"
                            slotProps={{ textField: { variant: "standard"} }}
                            onChange={(newDate: dayjs.Dayjs | null) => {handleDateChange("arrivaldate", newDate);}}
                            value={values.arrivaldate}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={5} sm={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Departure"
                            slotProps={{ textField: { variant: "standard" } }}
                            onChange={(newDate: dayjs.Dayjs | null) => {handleDateChange("departuredate", newDate);}}
                            value={values.departuredate}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={5} sm={2}>
                    <InputNames name="firstname" label="First Name" value={values.firstname} maxLength={maxFirstNameLength} onChange={handleTextFieldChange}/>
                </Grid>
                <Grid item xs={5} sm={2}>
                    <InputNames name="lastname" label="Last Name" value={values.lastname} maxLength={maxLastNameLength} onChange={handleTextFieldChange}/>
                </Grid>

                <Grid item xs={5} sm={2}>
                    <TextField
                        name="email"
                        label="E-Mail"
                        variant="standard"
                        value={values.email}
                        onChange={handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={5} sm={2}>
                    <TextField
                        name="phone"
                        label="Phone Number"
                        variant="standard"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+</InputAdornment>
                        }}
                        type="number"
                        placeholder="1234567890"
                        value={values.phone}
                        onChange={handleTextFieldChange}
                        helperText="Add your country code first"
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default SearchCriteria;