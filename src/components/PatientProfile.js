import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import "date-fns";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import patientAPI from "../api/patient.api";
import Diagnoses from "./Diagnoses";
import { makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles({
	patientContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	container: {
		width: "600px",
		textAlign: "center",
		padding: "10px",
		margin: "10px",
	},
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

	const [update, setUpdate] = React.useState({});
	const [addressError, setAddressError] = React.useState("");
	const [deleteReason, setDeleteReason] = React.useState("");
	const [deleteReasonError, setDeleteReasonError] = React.useState("");
	const [openEdit, setOpenEdit] = React.useState(false);
	const [openDelete, setOpenDelete] = React.useState(false);

	const { id } = useParams();
	const history = useHistory();
	const classes = useStyles();

	const handleEditOpen = () => {
		setOpenEdit(true);
	};

	const handleDeleteOpen = () => {
		setOpenDelete(true);
	};

	const handleEditClose = () => {
		setOpenEdit(false);
	};

	const handleDeleteClose = () => {
		setOpenDelete(false);
	};

	const onPhoneChange = (e) => {
		setUpdate({ ...update, phone: e.target.value });
	};

	const onAddressChange = (e) => {
		setUpdate({ ...update, address: e.target.value });
		setAddressError("");
	};

	const onDeleteReasonChange = (e) => {
		setDeleteReason(e.target.value);
		setDeleteReasonError("");
	};

	useEffect(() => {
		patientAPI.getPatient(id).then((res) => {
			if (res === 404) return history.push("/patients");

			setPatient(res.data);
			setUpdate(res.data);

			const date = res.data.birthday.split("T")[0].split("-");
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

	const editPatient = () => {
		if (!update.address) {
			setAddressError("Address cannot be empty!");
		} else {
			patientAPI.editPatient(id, update.phone, update.address).then(() => {
				setPatient({ ...patient, ...update });
				setOpenEdit(false);
			});
		}
	};

	const deletePatient = () => {
		if (!deleteReason) {
			setDeleteReasonError("Please write the reason for deleting");
		} else {
			patientAPI.deletePatient(id, deleteReason).then(() => {
				history.push("/patients");
			});
		}
	};

	const back = () => {
		history.push("/patients");
	};

	return (
		<div>
			<Button onClick={back} startIcon={<ArrowBackIcon />}>
				Back to patients page
			</Button>
			<div className={classes.patientContainer}>
				<Paper elevation={4} className={classes.container}>
					<h3>
						Patient full name: {patient.name} {patient.surname}{" "}
						{patient.fatherName}
					</h3>
					<p>
						Birth date: {birthday}, age: {getAge()}
					</p>

					<p>
						Phone number: {patient.phone ? patient.phone : "Not registered"}
					</p>
					<p>Address: {patient.address}</p>
					<p>Passport / ID card number: {patient.passportID}</p>
					<p>SSN: {patient.SSN}</p>
				</Paper>
				<div>
					<Button
						variant="contained"
						color="primary"
						onClick={handleEditOpen}
						className={classes.btn}
					>
						Edit patient
					</Button>{" "}
					<Button
						variant="contained"
						color="secondary"
						onClick={handleDeleteOpen}
						className={classes.btn}
					>
						Delete patient
					</Button>
				</div>
			</div>
			<Diagnoses />

			<div>
				<Dialog
					open={openEdit}
					onClose={handleEditClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Edit patient info</DialogTitle>
					<DialogContent>
						<TextField
							margin="dense"
							id="phone"
							label="Phone number"
							fullWidth
							onChange={onPhoneChange}
							value={update.phone}
						/>
						<TextField
							margin="dense"
							id="address"
							label="Address"
							fullWidth
							onChange={onAddressChange}
							value={update.address}
							error={!!addressError}
							helperText={addressError}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleEditClose} color="secondary">
							Cancel
						</Button>
						<Button onClick={editPatient} color="primary">
							Edit Patient
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog
					open={openDelete}
					onClose={handleDeleteClose}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
				>
					<DialogTitle id="alert-dialog-title">Delete the patient?</DialogTitle>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							Are you sure you want to delete this patient?
						</DialogContentText>

						<TextField
							margin="dense"
							id="phone"
							label="Delete reason"
							fullWidth
							multiline
							onChange={onDeleteReasonChange}
							value={deleteReason}
							error={!!deleteReasonError}
							helperText={deleteReasonError}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleDeleteClose} color="primary" autoFocus>
							Cancel
						</Button>
						<Button onClick={deletePatient} color="secondary">
							Delete
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		</div>
	);
}
