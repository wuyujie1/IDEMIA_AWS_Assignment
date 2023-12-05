import React, { useState } from "react";
import {
    FormControl,
    TextField,
    Grid,
    InputLabel,
    NativeSelect,
    FormHelperText, InputAdornment, Autocomplete
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fetchUserInputOptions } from "../hooks/fetchUserInputOptions";
import states from "../utils/states";

interface Option {
    id: number;
    name: string;
}

function SearchCriteria() {
    const maxFirstNameLength = 25;
    const maxLastNameLength = 25;
    const maxRoomQuant = 5;
    const roomTypes: Option[] = fetchUserInputOptions("roomTypes");

    return (
        <form>
            <Grid container spacing={1} >

                <Grid item xs={5} sm={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Arrival"
                            slotProps={{ textField: { variant: "standard", } }}
                            //value={}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={5} sm={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Departure"
                            slotProps={{ textField: { variant: "standard", } }}
                            //value={}
                        />
                    </LocalizationProvider>
                </Grid>

                <Grid item xs={2} sm={8}>
                    {/*Empty item, enforces new row for the next grid item*/}
                </Grid>

                <Grid item xs={5} sm={2}>
                    <FormControl fullWidth>
                        <InputLabel variant="standard" shrink={true}>
                            Room Size
                        </InputLabel>
                        <NativeSelect
                            defaultValue={roomTypes[0]?.name}
                            inputProps={{
                                name: "roomSize",
                                id: "roomSize",
                            }}
                        >
                            {roomTypes.map((roomType) => (
                                <option key={roomType.id} value={roomType.name}>{roomType.name}</option >
                            ))}
                        </NativeSelect>
                        <FormHelperText>Choose a room type</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={5} sm={2}>
                    <TextField fullWidth
                        id="roomQuantity"
                        label="Room Quantity"
                        variant="standard"
                        type="number"
                        InputProps={{ inputProps: { min: 1, max: maxRoomQuant} }}
                        //value={firstName}
                        helperText={`Maximum: ${maxRoomQuant}`}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        id="firstName"
                        label="First Name"
                        variant="standard"
                        inputProps={{ maxLength: maxFirstNameLength }}
                        //value={firstName}
                        helperText={`12/${maxFirstNameLength}`}
                        FormHelperTextProps={{style: {textAlign: "right"}}}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        id="lastName"
                        label="Last Name"
                        variant="standard"
                        inputProps={{ maxLength: maxLastNameLength }}
                        //value={lastName}
                        helperText={`12/${maxLastNameLength}`}
                        FormHelperTextProps={{style: {textAlign: "right"}}}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        id="email"
                        label="E-Mail"
                        variant="standard"
                        //value={email}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        id="phoneNum"
                        label="Phone Number"
                        variant="standard"
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+</InputAdornment>,
                        }}
                        type="number"
                        placeholder="1234567890"
                        //value={email}
                        helperText="Add your country code first"
                    />
                </Grid>
                <Grid item xs={5} sm={2}>
                    <TextField
                        id="streetName"
                        label="Street Name"
                        variant="standard"
                        //value={streetName}
                    />
                </Grid>
                <Grid item xs={5} sm={2}>
                    <TextField
                        id="streetNumber"
                        label="Street Number"
                        variant="standard"
                        //value={streetNumber}
                        type="number"
                    />
                </Grid>

                <Grid item xs={2} sm={8}>
                    {/*Empty item, enforces new row for the next grid item*/}
                </Grid>
                
                <Grid item xs={5} sm={2}>
                    <TextField
                        id="zip"
                        label="ZIP"
                        variant="standard"
                        //value={zip}
                    />
                </Grid>
                <Grid item xs={5} sm={2}>
                    <Autocomplete
                        id="state"
                        freeSolo
                        options={states}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="State"
                                variant="standard"
                                helperText="Autocomplete"
                            >
                            </TextField>
                        )}
                    />
                </Grid>
                <Grid item xs={5} sm={2}>
                    <TextField
                        id="city"
                        label="City"
                        variant="standard"
                        //value={city}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default SearchCriteria;