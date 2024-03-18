const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blog");
const User = require("../models/User");

// const getTokenFrom = (req) => {
//   const authorization = req.get("authorization");
//   if (authorization && authorization.startsWith("Bearer ")) {
//     return authorization.replace("Bearer ", "");
//   }

//   return null;
// };

blogRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
    const body = request.body;
    // console.log(body);

    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
        return response.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodedToken.id);

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: Number(body.likes) || 0,
        user: user._id,
    });

    const savedBlog = await blog.save();
    savedBlog.populate("user", { username: 1, name: 1 });

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (req, res) => {
    const blogToDelete = await Blog.findById(req.params.id);

    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (
        blogToDelete.user &&
        !(blogToDelete.user.toString() === decodedToken.id.toString())
    ) {
        return res
            .status(401)
            .json({ error: "blog can only be deleted by creator" });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(204).end();
});

blogRouter.put("/:id", async (req, res) => {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        context: "query",
    }).populate("user", { username: 1, name: 1 });
    res.json(updatedBlog);
});

module.exports = blogRouter;
