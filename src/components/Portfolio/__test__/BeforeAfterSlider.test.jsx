import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import BeforeAfterSlider from "../BeforeAfterSlider";

describe("BeforeAfterSlider", () => {
  it("renders Before and After labels", () => {
    render(
      <BeforeAfterSlider beforeImage="/before.jpg" afterImage="/after.jpg" />,
    );

    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });
});
