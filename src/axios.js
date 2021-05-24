import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/" });

export const setAuthToken = (token = localStorage.getItem("token")) => {
	if (token) {
		API.defaults.headers.common["Authorization"] = "Bearer " + token;
	} else {
		delete API.defaults.headers.common["Authorization"];
	}
};

API.interceptors.response.use(
	(res) => res,
	(e) => {
		return Promise.reject(e);
	}
);

export default API;
