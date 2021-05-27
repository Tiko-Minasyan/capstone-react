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
			console.log(e.response);
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

	submitWarning(id, data) {
		return API.post("/admins/warning/" + id, data).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	deleteDoctor(id, deleteReason) {
		return API.delete("/admins/doctor/" + id, { data: { deleteReason } }).catch(
			(e) => {
				console.log("error: ", e.response);
				return e.response.status;
			}
		);
	}

	getArchivedDoctors(skip) {
		return API.get(`/archives/getDoctors?skip=${skip}`).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	searchArchivedDoctors(name, profession, skip) {
		return API.post(`/archives/getDoctors?skip=${skip}`, {
			name,
			profession,
		}).catch((e) => console.log("error: ", e.response));
	}

	getArchivedDoctor(id) {
		return API.get("/archives/getDoctor/" + id).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	getArchivedPatients(skip) {
		return API.get(`/archives/getPatients?skip=${skip}`).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	searchArchivedPatientsByName(name, skip) {
		return API.post(`/archives/getPatients/name?skip=${skip}`, { name }).catch(
			(e) => {
				console.log("error: ", e.response);
			}
		);
	}

	searchArchivedPatientsById(id) {
		return API.post("/archives/getPatients/id", { id }).catch((e) => {
			console.log("error: ", e.response);
		});
	}

	getArchivedPatient(id) {
		return API.get("/archives/getPatient/" + id).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}
}

export default new adminAPI();
