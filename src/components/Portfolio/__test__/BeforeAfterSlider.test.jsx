import { describe, it, expect } from "vitest";
import { render, screen, userEvent } from "../../../test/test-utils";
import BeforeAfterSlider from "../BeforeAfterSlider";

describe("BeforeAfterSlider", () => {
  it("renders Before and After labels", () => {
    render(
      <BeforeAfterSlider beforeImage="/before.jpg" afterImage="/after.jpg" />,
    );

    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("moves the comparison position with arrow keys when the handle is focused", async () => {
    const user = userEvent.setup();
    render(
      <BeforeAfterSlider beforeImage="/before.jpg" afterImage="/after.jpg" />,
    );

    const handle = screen.getByRole("slider", {
      name: "Adjust comparison position",
    });
    handle.focus();
    expect(handle).toHaveFocus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Comparison: 51% / 49%")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByText("Comparison: 49% / 51%")).toBeInTheDocument();
  });

  it("does not move the comparison position on arrow keys when focus is elsewhere", async () => {
    const user = userEvent.setup();
    render(
      <BeforeAfterSlider beforeImage="/before.jpg" afterImage="/after.jpg" />,
    );

    const resetButton = screen.getByRole("button", { name: "Reset to center" });
    resetButton.focus();
    expect(resetButton).toHaveFocus();

    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    expect(screen.getByText("Comparison: 50% / 50%")).toBeInTheDocument();
  });
});
