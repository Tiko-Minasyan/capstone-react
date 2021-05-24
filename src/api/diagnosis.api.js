import API from "../axios";

class DiagnosisAPI {
	getDiagnoses(id) {
		return API.get("/diagnoses/" + id).catch((e) => {
			console.log(e);
		});
	}

	add(text, id) {
		return API.post("/diagnoses/" + id, { text }).catch((e) => {
			console.log(e);
		});
	}

	update(id, text) {
		return API.patch("/diagnoses/" + id, { text }).catch((e) => {
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
