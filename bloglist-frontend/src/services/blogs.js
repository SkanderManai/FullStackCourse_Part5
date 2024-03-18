import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
};

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.post(baseUrl, newObject, config);
    return res.data;
};

const update = async (object, id) => {
    const res = await axios.put(`${baseUrl}/${id}`, object);
    return res.data;
};

const remove = async (objectId) => {
    const config = {
        headers: { Authorization: token },
    };

    const res = await axios.delete(baseUrl + "/" + objectId, config);
    return res.data;
};

export default { getAll, setToken, create, update, remove };
