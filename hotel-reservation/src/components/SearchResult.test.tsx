import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchResult from "./SearchResult";


jest.mock("../hooks/useCRUD", () => ({
    __esModule: true,
    default: () => ({
        data: [
            {
                arrivaldate: "2021-01-01",
                departuredate: "2021-01-05",
                firstname: "first",
                lastname: "last",
                email: "test@gmail.com",
                phone: "1234567890",
                id: 1}
        ],
        isLoading: false
    }),
}));

describe("SearchResult", () => {

    it("renders DataGrid and New button", () => {
        render(<SearchResult />);
        expect(screen.getByText("New")).toBeInTheDocument();
        expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("renders DataGrid with correct data", () => {
        render(<SearchResult />);
        expect(screen.getByText("2021-01-01")).toBeInTheDocument();
        expect(screen.getByText("2021-01-05")).toBeInTheDocument();
        expect(screen.getByText("first")).toBeInTheDocument();
    });

    it("opens ModalDialog on New button click", () => {
        render(<SearchResult />);
        fireEvent.click(screen.getByText("New"));
        expect(screen.getByText("Save")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
    });

});