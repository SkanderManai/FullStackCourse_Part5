const Notification = ({ message }) => {
    if (message === null) {
        return null;
    } else if (!message.error) {
        return <div className="notification">{message.text} </div>;
    }

    return <div className="error">{message.text} </div>;
};

export default Notification;
