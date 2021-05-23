import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import patientAPI from "../api/patient.api";

export default function PatientProfile() {
	const [patient, setPatient] = React.useState({});
	const [birthday, setBirthday] = React.useState("");
	const { id } = useParams();
	const history = useHistory();

	useEffect(() => {
		patientAPI.getPatient(id).then((res) => {
			if (res === 404) return history.push("/patients");

			console.log(res.data);

			setPatient(res.data);
			const date = res.data.birthday.split("T")[0].split("-");
			setBirthday(date[1] + "/" + date[2] + "/" + date[0]);
		});
	}, [history, id]);

	const getAge = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		const birthdayDate = birthday.split("/");

		const birthdayYear = parseInt(birthdayDate[2]);
		const birthdayMonth = parseInt(birthdayDate[1]);
		const birthdayDay = parseInt(birthdayDate[0]);

		let age = year - birthdayYear;
		let monthDiff = month - birthdayMonth;

		if (monthDiff < 0) age--;
		else if (monthDiff === 0) {
			if (day - birthdayDay < 0) age--;
		}

		return age;
	};

	return (
		<div>
			<h1>
				{patient.name} {patient.surname} {patient.fatherName}
			</h1>
			<p>
				Birthday: {birthday}, age: {getAge()}
			</p>
			{/* <p>Phone number: {patient.phone ? patient.phone : "Not registered"}</p> */}
		</div>
	);
}
