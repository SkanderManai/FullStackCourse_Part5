import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/loginService";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
    const [blogs, setBlogs] = useState([]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [message, setMessage] = useState(null);

    const blogFormRef = useRef();

    useEffect(() => {
        blogService
            .getAll()
            .then((blogs) => setBlogs(blogs))
            .catch((error) => {
                setMessage({
                    text: error.response.data.error,
                    error: true,
                });
                setTimeout(() => {
                    setMessage(null);
                }, 5000);
            });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setCurrentUser(user);
            blogService.setToken(user.token);
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const user = await loginService.login({ username, password });

            window.localStorage.setItem(
                "loggedBlogappUser",
                JSON.stringify(user)
            );

            blogService.setToken(user.token);
            setCurrentUser(user);
            setUsername("");
            setPassword("");
        } catch (exception) {
            setMessage({
                text: "Wrong Credentials",
                error: true,
            });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        window.localStorage.removeItem("loggedBlogappUser");
    };

    const addBlog = async ({ title, author, url }) => {
        const blogObject = {
            title,
            author,
            url,
        };
        try {
            const returnedBlog = await blogService.create(blogObject);
            blogFormRef.current.toggleVisibility();

            setBlogs(blogs.concat(returnedBlog));
            setMessage({
                text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
                error: false,
            });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        } catch (exception) {
            setMessage({
                text: exception.message,
                error: true,
            });
            console.log(exception);
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }
    };

    const handleLike = async (blog) => {
        try {
            const updatedBlog = await blogService.update(
                {
                    title: blog.title,
                    author: blog.author,
                    url: blog.url,
                    likes: blog.likes + 1,
                    user: blog.user.id,
                },
                blog.id
            );

            setBlogs(blogs.map((b) => (b.id !== blog.id ? b : updatedBlog)));
        } catch (exception) {
            setMessage({ text: exception.response.data.error, error: true });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }
    };

    const handleRemove = async (blogId) => {
        try {
            await blogService.remove(blogId);
            setBlogs(blogs.filter((b) => b.id !== blogId));
            setMessage({
                text: "blog has been successfully removed",
                error: false,
            });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        } catch (exception) {
            setMessage({
                text: exception.response.data.error,
                error: true,
            });
            setTimeout(() => {
                setMessage(null);
            }, 5000);
        }
    };

    if (currentUser === null) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification message={message} />
                <LoginForm
                    handleLogin={handleLogin}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                />
            </div>
        );
    }

    return (
        <div>
            <h2>blogs</h2>
            <Notification message={message} />
            <p>
                {currentUser.name} logged in
                <button onClick={handleLogout}>logout</button>
            </p>
            <h2>Create New Blog</h2>
            <div>
                <Togglable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm createBlog={addBlog} />
                </Togglable>
            </div>

            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        likeHandler={handleLike}
                        removeBlog={handleRemove}
                        userIsCreator={
                            blog.user.username === currentUser.username
                        }
                    />
                ))}
        </div>
    );
};

export default App;
