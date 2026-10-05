import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AccountOptionsMenu } from "./account-options-menu";

vi.mock("@/components/auth/disconnect-button/disconnect-button", () => ({
  DisconnectButton: () => <button>Disconnect</button>,
}));
vi.mock("@/components/auth/logout-button/logout-button", () => ({
  LogoutButton: () => <button>Log out</button>,
}));

describe("AccountOptionsMenu", () => {
  it("closes when the user clicks outside the menu", () => {
    render(
      <>
        <AccountOptionsMenu />
        <button>Outside</button>
      </>,
    );

    const trigger = screen.getByTitle("More options");
    const details = trigger.closest("details");
    expect(details).not.toBeNull();

    fireEvent.click(trigger);
    expect(details).toHaveAttribute("open");
    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Disconnect" })).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(details).not.toHaveAttribute("open");
  });

  it("can show only the demo logout option", () => {
    render(<AccountOptionsMenu showDisconnect={false} onLogout={vi.fn()} />);
    fireEvent.click(screen.getByTitle("More options"));

    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Disconnect" })).not.toBeInTheDocument();
  });
});
