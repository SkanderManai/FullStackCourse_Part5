import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

const blog = {
    title: "foo",
    author: "bar",
    likes: 10,
    url: "blabla",
    user: { name: "test" },
};

test("should render title and author only by default ", () => {
    const { container } = render(<Blog blog={blog} />);
    const div = container.querySelector(".blog");
    const detailsDiv = container.querySelector(".details");

    expect(div).toHaveTextContent("foo by bar");
    expect(detailsDiv).toBeNull();
});

test("should render details after clicking the button", async () => {
    const { container } = render(<Blog blog={blog} />);

    const user = userEvent.setup();
    const button = container.querySelector(".toggleButton");
    await user.click(button);

    const div = container.querySelector(".details");

    expect(div).toBeDefined();
});

test("should call button handler twice when like button is pressed twice", async () => {
    const mockHandler = vi.fn();

    //console.log(mockHandler);
    const { container } = render(
        <Blog blog={blog} likeHandler={mockHandler} />
    );

    const user = userEvent.setup();
    const toggleButton = container.querySelector(".toggleButton");
    await user.click(toggleButton);

    const likeButton = container.querySelector(".like");

    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
});
