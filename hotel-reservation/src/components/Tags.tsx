import { Autocomplete, Chip, TextField } from "@mui/material";
import React from "react";
import { TagsProps } from "../utils/interface";

const Tags: React.FC<TagsProps> = ({tags, handleTagsChange}) => {
  
    return (
        <Autocomplete
            multiple
            options={[]}
            freeSolo
            value={tags != "" ? tags.split(",") : []}
            onChange={handleTagsChange}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
            }
            renderInput={(params) => (
                <TextField {...params} variant="standard" label="Tags" placeholder="Add a tag" />
            )}
        />
    );
};

export default Tags;