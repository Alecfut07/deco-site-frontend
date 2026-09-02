import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

export function renderWithRouter(ui, { route = "/" } = {}) {
  window.history.pushState({}, "", route);
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

export {
  screen,
  fireEvent,
  waitFor,
  within,
  act,
  cleanup,
  renderHook,
} from "@testing-library/react";

export { default as userEvent } from "@testing-library/user-event";
