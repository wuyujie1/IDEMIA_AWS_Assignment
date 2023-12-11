import { FormControl, FormHelperText, InputLabel, NativeSelect } from "@mui/material";
import React from "react";
import { RoomSizeProps } from "../utils/interface";

const RoomSize: React.FC<RoomSizeProps> = ({ roomsize, handleNaiveSelectFieldChange, roomTypes }) => {
    return (
        <FormControl fullWidth>
            <InputLabel variant="standard" shrink={true}>
    Room Size
            </InputLabel>
            <NativeSelect
                value={roomsize}
                onChange={handleNaiveSelectFieldChange}
                inputProps={{
                    name: "roomsize",
                    id: "roomSize"
                }}
            >
                {roomTypes.map((roomType, index) => (
                    <option key={index} value={roomType}>{roomType}</option>
                ))}
            </NativeSelect>
            <FormHelperText>Choose a room type</FormHelperText>
        </FormControl>
    );
};

export default RoomSize;