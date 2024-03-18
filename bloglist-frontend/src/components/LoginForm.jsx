import PropTypes from "prop-types";

const LoginForm = (props) => (
    <form onSubmit={props.handleLogin}>
        <div>
            username
            <input
                data-testid="username"
                type="text"
                value={props.username}
                name="Username"
                onChange={({ target }) => props.setUsername(target.value)}
            />
        </div>
        <div>
            password
            <input
                data-testid="password"
                type="password"
                value={props.password}
                name="Password"
                onChange={({ target }) => props.setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
    </form>
);

LoginForm.propTypes = {
    handleLogin: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    setPassword: PropTypes.func.isRequired,
};

export default LoginForm;
