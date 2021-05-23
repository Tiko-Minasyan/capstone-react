import API from "../axios";

class doctorAPI {
	getPatients() {
		return API.get("/patients").catch((e) => {
			console.log("error: ", e.response);
			return e.response.status;
		});
	}

	addPatient(name, surname, fatherName, birthday, phone, address) {
		return API.post("/patients", {
			name,
			surname,
			fatherName,
			birthday,
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
}

export default new doctorAPI();
