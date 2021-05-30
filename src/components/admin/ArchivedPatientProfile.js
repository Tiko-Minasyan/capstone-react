import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import adminAPI from "../../api/admin.api";
import ArchivedDiagnoses from "./ArchivedDiagnoses";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
	flex: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		height: "20px",
	},
	btn: {
		marginRight: "20px",
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

	const back = () => {
		history.push("/admin/archive/patients");
	};

	return (
		<div>
			<div>
				<h1>
					<IconButton onClick={back}>
						<ArrowBackIcon />
					</IconButton>
					{patient.name} {patient.surname} {patient.fatherName}
				</h1>
				<div className={classes.flex}>
					<p>
						Birthday: {birthday}, age: {getAge()}
					</p>
				</div>
				<p>Phone number: {patient.phone ? patient.phone : "Not registered"}</p>
				<p>Address: {patient.address}</p>
				<p>Passport / ID card number: {patient.passportID}</p>
				<p>SSN: {patient.SSN}</p>
				<p>Delete reason: {patient.deleteReason}</p>
				<p>Deleted at: {patient.deletedAt}</p>
				<ArchivedDiagnoses />
			</div>
		</div>
	);
}
