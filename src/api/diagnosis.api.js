import API from "../axios";

class DiagnosisAPI {
	getDiagnoses(id, skip) {
		return API.get(`/diagnoses/${id}?skip=${skip}`).catch((e) => {
			console.log(e);
		});
	}

	add(id, data) {
		return API.post("/diagnoses/" + id, data).catch((e) => {
			console.log(e);
		});
	}

	update(id, data) {
		return API.patch("/diagnoses/" + id, data).catch((e) => {
			console.log(e);
		});
	}

	delete(id) {
		return API.delete("/diagnoses/" + id).catch((e) => {
			console.log(e);
		});
	}

	search(id, profession, finished, skip) {
		return API.post(`/diagnoses/search/${id}?skip=${skip}`, {
			profession,
			finished,
		}).catch((e) => {
			console.log(e);
		});
	}
}

export default new DiagnosisAPI();
