import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchResult from "./SearchResult";
import searchReservations from "../apiInteraction/searchReservations";
import postReservation from "../apiInteraction/postReservation";
import deleteReservation from "../apiInteraction/deleteReservation";
import { BehaviorSubject } from "rxjs";
import { initNewRow } from "../utils/utils";
import { ApiData, ModalDialogProps } from "../utils/interface";
import userEvent from "@testing-library/user-event";
import updateReservation from "../apiInteraction/updateReservation";
import { act } from "react-dom/test-utils";

jest.mock("../apiInteraction/searchReservations");
jest.mock("../apiInteraction/postReservation");
jest.mock("../apiInteraction/updateReservation");
jest.mock("../apiInteraction/deleteReservation");

jest.mock("./ModalDialog", () => {
    const MockModalDialog = (props: ModalDialogProps) => {
        const row = {
            arrivaldate: "",
            departuredate: "",
            roomsize: "",
            roomquantity: 1,
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            streetname: "",
            streetnumber: "",
            zipcode: "",
            state: "",
            city: "",
            extras: "",
            payment: "",
            note: "",
            tags: "",
            reminder: false,
            newsletter: false,
            confirm: false,
        };
        const oriRow = {
            arrivaldate: "",
            departuredate: "",
            roomsize: "",
            roomquantity: 1,
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            streetname: "",
            streetnumber: "",
            zipcode: "",
            state: "",
            city: "",
            extras: "",
            payment: "",
            note: "",
            tags: "",
            reminder: false,
            newsletter: false,
            confirm: false,
        };
        return (
            <div>
                <button onClick={() => props.onUpdate(row, oriRow)}>Save</button>
                <button onClick={() => props.onDelete(row)}>Delete</button>
            </div>
        );
    };
    MockModalDialog.displayName = "MockModalDialog";
    return MockModalDialog;
});

describe("SearchResult", () => {
    let mockApiData: BehaviorSubject<ApiData>;

    beforeEach(() => {
        mockApiData = new BehaviorSubject<ApiData>({ body: [] });
        (searchReservations as unknown as jest.Mock).mockImplementation(() => mockApiData);
        (postReservation as unknown as jest.Mock).mockImplementation(() => new BehaviorSubject({}));
        (updateReservation as unknown as jest.Mock).mockImplementation(() => new BehaviorSubject({}));
        (deleteReservation as unknown as jest.Mock).mockImplementation(() => new BehaviorSubject({}));
    });

    it("renders DataGrid and New button", () => {
        render(<SearchResult />);
        expect(screen.getByText("New")).toBeInTheDocument();
        expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("fetches and displays initial reservation data", () => {
        const sampleData = {body: [{ ...initNewRow(), firstname: "test" }] };
        mockApiData.next(sampleData);

        render(<SearchResult />);
        expect(searchReservations).toHaveBeenCalled();
        expect(screen.getByText("test")).toBeInTheDocument();
    });

    it("catch API error without crushing", () => {
        mockApiData.error(new Error("API Error"));
        render(<SearchResult />);
        expect(searchReservations).toHaveBeenCalled();
    });

    it("displays a message when no data is available", () => {
        mockApiData.next({ body: [] });
        render(<SearchResult />);
        expect(screen.getByText("Nothing to display :)")).toBeInTheDocument();
    });

    it("creates a new reservation when dialogForNewRow is true",  async() => {
        render(<SearchResult />);
        await act(() => {
            mockApiData.next({ body: [initNewRow()] });
            userEvent.click(screen.getByText("New"));

        });
        await act(() => {
            const saveButton = screen.getByText("Save");
            userEvent.click(saveButton);
        });
        expect(postReservation).toHaveBeenCalledTimes(1);
    });

    it("deletes an existing reservation when delete button is clicked",  async() => {
        render(<SearchResult />);
        await act(() => {
            mockApiData.next({ body: [initNewRow()] });
            const saveButton = screen.getByText("Delete");
            userEvent.click(saveButton);
        });
        expect(deleteReservation).toHaveBeenCalledTimes(1);
    });
});