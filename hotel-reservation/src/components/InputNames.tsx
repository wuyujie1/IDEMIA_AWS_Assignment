import { TextField } from "@mui/material";
import { InputNameProps } from "../utils/interface";
import React from "react";

const InputNames: React.FC<InputNameProps> = ({ name, label, value, maxLength, onChange }) => {
    return (
        <TextField
            name={name}
            label={label}
            variant="standard"
            inputProps={{ maxLength }}
            value={value}
            helperText={`${value.length}/${maxLength}`}
            FormHelperTextProps={{ style: { textAlign: "right" } }}
            onChange={onChange}
        />
    );
};

export default InputNames;