import API from "../axios";

class doctorAPI {
	getPatients(skip) {
		return API.get(`/patients?skip=${skip}`).catch((e) => {
			console.log("error: ", e.response);
		});
	}

	searchByName(name, skip) {
		return API.post(`/patients/name?skip=${skip}`, { name }).catch((e) => {
			console.log("error: ", e.response);
		});
	}

	searchById(id) {
		return API.post("/patients/id", { id }).catch((e) => {
			console.log("error: ", e.response);
		});
	}

	addPatient(data) {
		return API.post("/patients", data).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	editPatient(id, phone, address) {
		return API.patch("/patients/" + id, {
			phone,
			address,
		}).catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	getPatient(id) {
		return API.get("/patients/" + id).catch((e) => {
			return e.response.status;
		});
	}

	deletePatient(id, deleteReason) {
		return API.delete("/patients/" + id, { data: { deleteReason } }).catch(
			(e) => {
				console.log(e.response);
			}
		);
	}
}

export default new doctorAPI();
