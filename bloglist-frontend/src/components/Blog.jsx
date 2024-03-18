import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, likeHandler, removeBlog, userIsCreator }) => {
    const [detailsVisible, setDetailsVisible] = useState(false);

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: "solid",
        borderWidth: 1,
        marginBottom: 5,
    };

    const toggleDetails = () => {
        setDetailsVisible(!detailsVisible);
    };

    const handleLike = () => {
        likeHandler(blog);
    };

    const handleDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            removeBlog(blog.id);
        }
    };

    return (
        <div style={blogStyle} className="blog" data-testid="blog">
            {blog.title} by {blog.author}
            <button onClick={toggleDetails} className="toggleButton">
                {detailsVisible ? "hide" : "view"}
            </button>
            {detailsVisible && (
                <div className="details">
                    <div>{blog.url}</div>
                    <div>
                        likes : <span data-testid="likes">{blog.likes}</span>
                        <button onClick={handleLike} className="like">
                            like
                        </button>
                    </div>
                    <div>{blog.user ? blog.user.name : ""} </div>
                    <button
                        style={{ display: userIsCreator ? "" : "none" }}
                        onClick={handleDelete}
                    >
                        remove
                    </button>
                </div>
            )}
        </div>
    );
};

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeHandler: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired,
    userIsCreator: PropTypes.bool,
};

export default Blog;
