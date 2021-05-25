import API from "../axios";

class DiagnosisAPI {
	getDiagnoses(id) {
		return API.get("/diagnoses/" + id).catch((e) => {
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
}

export default new DiagnosisAPI();
