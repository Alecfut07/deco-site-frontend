import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

export function renderWithRouter(ui, { route = "/" } = {}) {
  window.history.pushState({}, "", route);
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

export * from "@testing-library/react";
