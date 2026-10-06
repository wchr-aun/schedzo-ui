import {render, screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {PotPreview} from "./pot-preview";

describe("PotPreview", () => {
  it("shows a clearly labelled sample pot with upcoming transfers", () => {
    render(<PotPreview />);

    expect(screen.getByRole("figure", {name: "Sample Monzo Pot with upcoming scheduled transfers"})).toBeInTheDocument();
    expect(screen.getByRole("heading", {name: "Rainy day"})).toBeInTheDocument();
    expect(screen.getByText("£5,549.54")).toBeInTheDocument();
    expect(screen.getByText("Weekly deposit")).toBeInTheDocument();
    expect(screen.getByText("Monthly withdrawal")).toBeInTheDocument();
    expect(screen.getAllByText("Pending")).toHaveLength(2);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
