import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import adminAPI from "../../api/admin.api";
import ArchivedDiagnoses from "./ArchivedDiagnoses";
import { Divider, makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles({
	container: {
		width: "800px",
		textAlign: "center",
		padding: "10px",
		margin: "50px auto 10px",
	},
	diagnoses: {
		padding: "10px",
	},
	infoDivide: {
		display: "grid",
		gridTemplateColumns: "10fr 1fr 10fr",
		marginTop: "10px",
	},
});

export default function PatientProfile() {
	const [patient, setPatient] = React.useState({});
	const [birthday, setBirthday] = React.useState("");

	const { id } = useParams();
	const history = useHistory();
	const classes = useStyles();

	useEffect(() => {
		adminAPI.getArchivedPatient(id).then((res) => {
			if (res === 404) return history.push("/admin/archive/patients");

			let date = res.data.deletedAt.split("T")[0].split("-");
			res.data.deletedAt = date[2] + "/" + date[1] + "/" + date[0];

			setPatient(res.data);

			date = res.data.birthday.split("T")[0].split("-");
			setBirthday(date[2] + "/" + date[1] + "/" + date[0]);
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
			<Paper elevation={4} className={classes.container}>
				<h3>
					Patient full name: {patient.name} {patient.surname}{" "}
					{patient.fatherName}
				</h3>
				<Divider />
				<div className={classes.infoDivide}>
					<div>
						<p>Birth date: {birthday}</p>
						<p>Age: {getAge()}</p>
						<p>
							Phone number: {patient.phone ? patient.phone : "Not registered"}
						</p>
						<p>Address: {patient.address}</p>
					</div>
					<Divider orientation="vertical" />
					<div>
						<p>Passport / ID card number: {patient.passportID}</p>
						<p>SSN: {patient.SSN}</p>
						<p>Delete reason: {patient.deleteReason}</p>
						<p>Deleted at: {patient.deletedAt}</p>
					</div>
				</div>
			</Paper>
			<div className={classes.diagnoses}>
				<ArchivedDiagnoses />
			</div>
		</div>
	);
}
