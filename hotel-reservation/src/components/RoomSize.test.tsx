import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomSize from "./RoomSize";

describe("RoomSize", () => {
    const mockHandleNaiveSelectFieldChange = jest.fn();
    const roomTypes = ["Single", "Double", "Suite"];
    const props = {
        roomsize: "Single",
        handleNaiveSelectFieldChange: mockHandleNaiveSelectFieldChange,
        roomTypes: roomTypes
    };

    it("renders the select with the correct options", () => {
        render(<RoomSize {...props} />);
        const options = screen.getAllByRole("option");
        expect(options.length).toBe(roomTypes.length);
        expect(options[0]).toHaveTextContent("Single");
        expect(options[1]).toHaveTextContent("Double");
        expect(options[2]).toHaveTextContent("Suite");
    });

    it("calls handleNaiveSelectFieldChange when a different option is selected", () => {
        render(<RoomSize {...props} />);
        const select = screen.getByRole("combobox");
        fireEvent.change(select, { target: { value: "Double" } });
        expect(mockHandleNaiveSelectFieldChange).toHaveBeenCalled();
    });

    it("displays the correct selected option", () => {
        render(<RoomSize {...props} />);
        expect(screen.getByRole("combobox")).toHaveValue("Single");
    });
});
