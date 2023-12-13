import React, { useEffect, useState } from "react";
import {
    TextField,
    Grid, InputAdornment, Autocomplete, Dialog, Checkbox, FormControlLabel, Switch, Button
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { states, maxFirstNameLength, maxLastNameLength, maxRoomQuantity } from "../utils/configs";
import {roomTypes, extrasOptions} from "../utils/configs";
import { ModalDialogProps, Reservation, SaveBtnParams } from "../utils/interface";
import dayjs from "dayjs";
import PaymentRadioGroup from "./PaymentRadioGroup";
import Tags from "./Tags";
import RoomSize from "./RoomSize";
import InputNames from "./InputNames";
import { Observable, Subject } from "rxjs";

const deleteBtn = new Subject();
export const deleteBtn$ = deleteBtn.asObservable();
const saveBtn: Subject<SaveBtnParams> = new Subject();
export const saveBtn$: Observable<SaveBtnParams> = saveBtn.asObservable();
const ModalDialog: React.FC<ModalDialogProps> = ({ open, onClose, setIsLoading, row, forCreate }) => {
    const [values, setValues] = useState<Reservation | null>(null);

    useEffect(() => {
        if (row) {
            setValues(row);
        }
    }, [row]);

    if (!values) {
        return null;
    }

    const handleDateChange = (field: string, newDate: dayjs.Dayjs | null) => {
        if (newDate != null) setValues({ ...values, [field]: newDate });
    };

    const handleRoomQuantityChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value.includes("&") || value.includes("=")) {
            return;
        }
        if ((parseInt(value) <= 5 && parseInt(value) > 0) || value == "") {
            setValues({
                ...values,
                [name]: value
            });
        }
    };

    const handleStateChange = (e: React.SyntheticEvent<Element, Event>, newVal: string | null) => {
        if (newVal == null) {
            newVal = "";
        } else if (newVal.includes("&") || newVal.includes("=")) {
            return;
        }
        setValues({
            ...values,
            state: newVal
        });
    };

    const handlePaymentMethodChange = (newValue: string) => {
        if (newValue.includes("&") || newValue.includes("=")) {
            return;
        }
        setValues({
            ...values,
            payment: newValue
        });
    };

    const handleSyntheticEventChange = (e: React.SyntheticEvent<Element, Event>, newVal: string[], name: string) => {
        if (newVal.includes("&") || newVal.includes("=")) {
            return;
        }
        setValues({
            ...values,
            [name]: newVal.join(",")
        });
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        if (value.includes("&") || value.includes("=")) {
            return;
        }
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setValues({
            ...values,
            [name]: checked
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"xl"} style={{ width: "90%", margin: "auto" }}>
            <form>
                <Grid container spacing={3} sx={{ margin: "2% 2% 2% 5%", width: "70%" }}>
                    <Grid item xs={5} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date of Arrival"
                                slotProps={{ textField: { variant: "standard" } }}
                                onChange={(newDate: dayjs.Dayjs | null) => {
                                    handleDateChange("arrivaldate", newDate);
                                }}
                                value={dayjs(values.arrivaldate)}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={5} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date of Departure"
                                slotProps={{ textField: { variant: "standard" } }}
                                onChange={(newDate: dayjs.Dayjs | null) => {
                                    handleDateChange("departuredate", newDate);
                                }}
                                value={dayjs(values.departuredate)}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={2} sm={4}>
                        {/*Empty item, enforces new row for the next grid item*/}
                    </Grid>

                    <Grid item xs={5} sm={4}>
                        <RoomSize
                            roomsize={values.roomsize}
                            handleNaiveSelectFieldChange={handleOnChange}
                            roomTypes={roomTypes}/>
                    </Grid>
                    <Grid item xs={5} sm={2}>
                        <TextField fullWidth
                            name="roomquantity"
                            label="Room Quantity"
                            variant="standard"
                            type="number"
                            InputProps={{ inputProps: { min: 1, max: maxRoomQuantity } }}
                            value={values.roomquantity}
                            helperText={`Maximum: ${maxRoomQuantity}`}
                            onChange={handleRoomQuantityChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <InputNames
                            name="firstname"
                            label="First Name"
                            value={values.firstname}
                            maxLength={maxFirstNameLength}
                            onChange={handleOnChange}/>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <InputNames 
                            name="lastname"
                            label="Last Name"
                            value={values.lastname}
                            maxLength={maxLastNameLength}
                            onChange={handleOnChange}/>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="email"
                            label="E-Mail"
                            variant="standard"
                            value={values.email}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                            helperText="Add your country code first"
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={5} sm={2}>
                        <TextField
                            name="streetname"
                            label="Street Name"
                            variant="standard"
                            value={values.streetname}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={5} sm={2}>
                        <TextField
                            name="streetnumber"
                            label="Street Number"
                            variant="standard"
                            value={values.streetnumber}
                            type="number"
                            onChange={handleOnChange}
                        />
                    </Grid>

                    <Grid item xs={2} sm={8}>
                        {/*Empty item, enforces new row for the next grid item*/}
                    </Grid>

                    <Grid item xs={5} sm={2}>
                        <TextField
                            name="zipcode"
                            label="ZIP"
                            variant="standard"
                            value={values.zipcode}
                            onChange={handleOnChange}
                        />
                    </Grid>
                    <Grid item xs={5} sm={2}>
                        <Autocomplete
                            freeSolo
                            options={states}
                            value={values.state}
                            onChange={handleStateChange}
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
                            name="city"
                            label="City"
                            variant="standard"
                            value={values.city}
                            onChange={handleOnChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Autocomplete
                            multiple
                            id="extras"
                            options={extrasOptions}
                            value={values.extras ? values.extras.split(",") : []}
                            onChange={(e, newVal) => {handleSyntheticEventChange(e, newVal, "extras");}}
                            renderInput={(params) => (
                                <TextField
                                    sx={{width: "auto", minWidth: "20%"}}
                                    {...params}
                                    variant="standard"
                                    label="Extras"
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <PaymentRadioGroup 
                            payment={values.payment}
                            setPayment={handlePaymentMethodChange}/>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <TextField
                            sx={{width: "60%"}}
                            name="note"
                            label="Personal Note"
                            variant="standard"
                            value={values.note}
                            onChange={handleOnChange}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <Tags 
                            tags={values.tags}
                            handleTagsChange={(e, newVal) => {handleSyntheticEventChange(e, newVal, "tags");}}/>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    color={"secondary"}
                                    checked={values.reminder}
                                    onChange={handleCheckboxChange}
                                    name="reminder"
                                />
                            }
                            label="Send me a reminder"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControlLabel
                            control={
                                <Switch
                                    color={"secondary"}
                                    checked={values.newsletter}
                                    onChange={handleCheckboxChange}
                                    name="newsletter"
                                />
                            }
                            label="Subscribe to newsletter"
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color={"secondary"}
                                    checked={values.confirm}
                                    onChange={handleCheckboxChange}
                                    name="confirm"
                                />
                            }
                            label="I confirm the information given above"
                        />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            id="save"
                            variant="contained"
                            color="secondary"
                            sx={{marginBottom: "13%"}}
                            onClick={()=>{
                                if (row) saveBtn.next({operation: forCreate ? "create" : "update", updatedValues: values, queryParams: row});
                                setIsLoading(true);
                                setValues(null);
                            }}
                        >
                            Save
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            id="delete"
                            disabled={forCreate}
                            variant="contained"
                            color="primary"
                            sx={{marginBottom: "13%"}}
                            onClick={()=>{
                                deleteBtn.next(row);
                                setIsLoading(true);
                                setValues(null);}}
                        >
                            Delete
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Dialog>
    );
};

export default ModalDialog;

