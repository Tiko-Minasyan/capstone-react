import API, { setAuthToken } from "../axios";

class doctorAPI {
	login(email, password) {
		return API.post("/doctors/login", {
			email,
			password,
		})
			.then((res) => {
				setAuthToken(res.data);
				return res.data;
			})
			.catch((e) => {
				if (e.response.status === 404) return 404;
				if (e.response.status === 403) return 403;
			});
	}

	getProfile() {
		return API.get("/doctors/profile").catch((e) => {
			if (!e.response) return 0;
			if (e.response.status === 404) return 404;
			if (e.response.status === 409) return 409;
		});
	}

	update(email, phone, address) {
		return API.patch("/doctors", { email, phone, address }).catch((e) => {
			console.log(e.response);
		});
	}

	updatePassword(oldPassword, password) {
		return API.patch("/doctors/password", { oldPassword, password }).catch(
			(e) => {
				console.log(e.response);
				if (e.response.status === 403) return 403;
			}
		);
	}

	updatePicture(data) {
		return API.post("/doctors/picture", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}).catch((e) => {
			console.log(e);
		});
	}
}

export default new doctorAPI();
