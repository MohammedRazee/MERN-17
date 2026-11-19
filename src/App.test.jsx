import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import menu from "./data/menu.js";

describe("Stage 1 basics", () => {
  it("uses Bootstrap classes on the alert and buttons", () => {
    const { container } = render(<App />);
    expect(container.querySelector(".alert.alert-info")).toBeInTheDocument();
    expect(container.querySelectorAll(".btn.btn-success").length).toBe(1);
  });
});

describe("Stage 2 grid", () => {
  it("renders six responsive columns", () => {
    const { container } = render(<App />);
    const cols = container.querySelectorAll(".col-12.col-md-6.col-lg-4");
    expect(cols.length).toBe(6);
  });
});

describe("Navbar", () => {
  it("shows the brand, three links and a toggle button", () => {
    render(<App />);
    expect(screen.getByText(/Tasty Bites/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
    const toggler = document.querySelector(".navbar-toggler");
    expect(toggler).toHaveAttribute("data-bs-toggle", "collapse");
    expect(document.querySelector("#menuLinks")).toBeInTheDocument();
  });
});

describe("Menu grid (props + map)", () => {
  it("draws one card per menu item with name and price", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll(".card").length).toBe(menu.length);
    expect(screen.getByText("Masala Dosa")).toBeInTheDocument();
    expect(screen.getByText("₹90")).toBeInTheDocument();
  });
});

describe("Add to cart counter (state)", () => {
  it("each card counts its own clicks", async () => {
    const user = userEvent.setup();
    render(<App />);
    const buttons = screen.getAllByRole("button", { name: "Add to cart" });
    expect(screen.queryByText(/Added:/)).not.toBeInTheDocument();
    await user.click(buttons[0]);
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    const cards = document.querySelectorAll(".card");
    expect(within(cards[0]).getByText("Added: 2")).toBeInTheDocument();
    expect(within(cards[1]).getByText("Added: 1")).toBeInTheDocument();
    expect(within(cards[2]).queryByText(/Added:/)).not.toBeInTheDocument();
  });
});

describe("Search box (controlled input + filter)", () => {
  it("filters cards as you type, ignoring case", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.type(screen.getByPlaceholderText("Search dishes..."), "PIZZA");
    expect(container.querySelectorAll(".card").length).toBe(1);
    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
  });

  it("shows a warning when nothing matches", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.type(screen.getByPlaceholderText("Search dishes..."), "xyz");
    expect(container.querySelectorAll(".card").length).toBe(0);
    expect(screen.getByText("No dishes found.")).toBeInTheDocument();
  });

  it("clearing the box brings every card back", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    const box = screen.getByPlaceholderText("Search dishes...");
    await user.type(box, "burger");
    expect(container.querySelectorAll(".card").length).toBe(1);
    await user.clear(box);
    expect(container.querySelectorAll(".card").length).toBe(menu.length);
  });

  it("a hidden card forgets its count (why Class 20 lifts state up)", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
    expect(screen.getByText("Added: 1")).toBeInTheDocument();
    const box = screen.getByPlaceholderText("Search dishes...");
    await user.type(box, "pizza");
    await user.clear(box);
    expect(screen.queryByText(/Added:/)).not.toBeInTheDocument();
  });
});
