import API, { setAuthToken } from "../axios";

class adminAPI {
	login(email, password) {
		return API.post("/admins/login", {
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
		return API.get("/admins/profile").catch((e) => {
			return e.response.status;
		});
	}

	register(name, surname, profession, email) {
		return API.post("/admins/registerDoctor", {
			name,
			surname,
			profession,
			email,
		}).catch((e) => {
			return e.response.status;
		});
	}

	registerAdmin(name, surname, position, email) {
		return API.post("/admins/register", {
			name,
			surname,
			position,
			email,
		}).catch((e) => {
			return e.response.status;
		});
	}

	update(email, password, oldPassword) {
		return API.patch("/admins", {
			email,
			password,
			oldPassword,
		}).catch((e) => {
			return e.response.status;
		});
	}

	getDoctors(skip) {
		return API.get(`/admins/getDoctors?skip=${skip}`).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	searchDoctors(name, profession, skip) {
		return API.post(`/admins/getDoctors?skip=${skip}`, {
			name,
			profession,
		}).catch((e) => console.log("error: ", e.response));
	}

	getDoctor(id) {
		return API.get("/admins/getDoctor/" + id).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	getDoctorImage(id) {
		return API.get("/admins/getDoctorImage/" + id).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	deleteDoctor(id) {
		return API.delete("/admins/doctor/" + id).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}
}

export default new adminAPI();
