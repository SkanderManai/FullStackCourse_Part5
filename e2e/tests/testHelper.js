const login = async (page, username, password) => {
    await page.getByTestId("username").fill(username);
    await page.getByTestId("password").fill(password);

    await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, blogObject) => {
    await page.getByRole("button", { name: "new blog" }).click();

    await page.getByTestId("title").fill(blogObject.title);
    await page.getByTestId("author").fill(blogObject.author);
    await page.getByTestId("url").fill(blogObject.url);

    await page.getByRole("button", { name: "create" }).click();
};

export { login, createBlog };
