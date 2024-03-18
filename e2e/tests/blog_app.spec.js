const { test, expect, beforeEach, describe } = require("@playwright/test");
const { login, createBlog } = require("./testHelper");

describe("Blog List app", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("http://localhost:3003/api/testing/reset");
        await request.post("http://localhost:3003/api/users", {
            data: {
                name: "skander",
                username: "buttshipper",
                password: "buttshipper",
            },
        });

        await page.goto("http://localhost:5173");
    });

    test("Login form is shown", async ({ page }) => {
        await expect(page.getByText("Log in to application")).toBeVisible();
        await expect(page.getByText("username")).toBeVisible();
        await expect(page.getByText("password")).toBeVisible();
    });

    describe("login", () => {
        test("succeeds with correct credentials", async ({ page }) => {
            await login(page, "buttshipper", "buttshipper");

            await expect(page.getByText("skander logged in")).toBeVisible();
        });

        test("fails with wrong credentials", async ({ page }) => {
            await login(page, "buttshipper", "wrong");
            await expect(page.getByText("wrong credentials")).toBeVisible();
        });
    });

    describe("when logged in", () => {
        beforeEach(async ({ page }) => {
            await login(page, "buttshipper", "buttshipper");
        });

        test("a new blog can be created", async ({ page }) => {
            const testBlog = {
                title: "test title",
                author: "test author",
                url: "test url",
            };

            await createBlog(page, testBlog);

            await expect(page.getByTestId("blog")).toBeVisible();
        });

        describe("while a blog exists", () => {
            beforeEach(async ({ page }) => {
                const testBlog = {
                    title: "test title",
                    author: "test author",
                    url: "test url",
                };

                await createBlog(page, testBlog);
            });

            test("a blog can be modified", async ({ page }) => {
                await page.getByRole("button", { name: "view" }).click();
                const likes = Number(
                    await page.getByTestId("likes").textContent()
                );

                await page.getByRole("button", { name: "like" }).click();
                await page.getByTestId("blog").waitFor();

                await expect(page.getByTestId("likes")).toHaveText(
                    `${likes + 1}`
                );
            });

            test("a blog can be deleted", async ({ page }) => {
                await page.getByRole("button", { name: "view" }).click();
                await expect(
                    page.getByRole("button", { name: "remove" })
                ).toBeVisible();
                page.on("dialog", (dialog) => dialog.accept());
                await page.getByRole("button", { name: "remove" }).click();

                await expect(
                    page.getByText("blog has been successfully removed")
                ).toBeVisible();
            });

            test("blogs are ordered by likes", async () => {});
        });
    });
});
