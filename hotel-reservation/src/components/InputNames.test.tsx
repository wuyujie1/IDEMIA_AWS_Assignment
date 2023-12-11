import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputNames from "./InputNames";

describe("InputNames", () => {
    const mockOnChange = jest.fn();
    const props = {
        name: "testName",
        label: "Test Name",
        value: "LastName",
        maxLength: 10,
        onChange: mockOnChange
    };

    it("renders the input with the correct label", () => {
        render(<InputNames {...props} />);
        expect(screen.getByLabelText("Test Name")).toBeInTheDocument();
    });

    it("calls onChange when the input value changes", () => {
        render(<InputNames {...props} />);
        const input = screen.getByLabelText("Test Name");
        fireEvent.change(input, { target: { value: "FirstName" } });
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("displays the correct length count", () => {
        render(<InputNames {...props} value="FirstName" />);
        expect(screen.getByText("9/10")).toBeInTheDocument();
    });

    it("respects the maxLength prop", () => {
        render(<InputNames {...props} />);
        const input = screen.getByLabelText("Test Name");
        expect(input).toHaveAttribute("maxLength", "10");
    });
});
