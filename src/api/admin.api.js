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

	getDoctors() {
		return API.get("/admins/getDoctors").catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
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
