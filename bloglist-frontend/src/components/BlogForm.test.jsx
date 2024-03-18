import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("updates parent state and calls onSubmit", async () => {
    const createBlog = vi.fn();
    const user = userEvent.setup();

    render(<BlogForm createBlog={createBlog} />);

    const inputs = screen.getAllByRole("textbox");
    const submitButton = screen.getByText("create");

    await user.type(inputs[0], "test title");
    await user.type(inputs[1], "test author");
    await user.type(inputs[2], "test url");
    await user.click(submitButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("test title");
    expect(createBlog.mock.calls[0][0].author).toBe("test author");
    expect(createBlog.mock.calls[0][0].url).toBe("test url");
});
