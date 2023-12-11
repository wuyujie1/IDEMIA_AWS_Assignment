import React from "react";
import { Grid } from "@mui/material";
import SearchCriteria from "../components/SearchCriteria";
import SearchResult from "../components/SearchResult";

function HomePage() {
    return (
        <Grid container spacing={1}
            sx={{margin: "2%", border: "1px solid lightgray", borderRadius: "10px", width: "90%"}}>
            <Grid item xs={12} sm={10}>
                <h1 style={{fontWeight: "lighter"}}>Reservations</h1>
            </Grid>
            <Grid item xs={12} sm={12} sx={{padding: "2%"}}>
                <SearchCriteria/>
            </Grid>
            <Grid item xs={12} sm={12} sx={{padding: "2%"}}>
                <SearchResult/>
            </Grid>

        </Grid>
    );
}

export default HomePage;