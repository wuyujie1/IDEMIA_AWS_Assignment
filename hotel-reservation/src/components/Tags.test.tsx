import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tags from "./Tags";

describe("Tags", () => {
    const mockHandleTagsChange = jest.fn();
    const tags = "tag1,tag2";
    const props = {
        tags: tags,
        handleTagsChange: mockHandleTagsChange
    };

    it("renders the autocomplete with the correct tags", () => {
        render(<Tags {...props} />);
        const chips = screen.getAllByRole("button");
        expect(chips[0]).toHaveTextContent("tag1");
        expect(chips[1]).toHaveTextContent("tag2");
    });

    it("displays placeholder text correctly", () => {
        render(<Tags {...props} />);
        expect(screen.getByPlaceholderText("Add a tag")).toBeInTheDocument();
    });
});
