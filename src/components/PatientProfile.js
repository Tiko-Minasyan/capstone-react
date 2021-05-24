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
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import patientAPI from "../api/patient.api";
import Diagnoses from "./Diagnoses";
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

	const [update, setUpdate] = React.useState({});
	const [selectedDate, setSelectedDate] = React.useState("");
	const [nameError, setNameError] = React.useState("");
	const [surnameError, setSurnameError] = React.useState("");
	const [birthdayError, setBirthdayError] = React.useState("");
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

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setBirthdayError("");
	};

	const onNameChange = (e) => {
		setUpdate({ ...update, name: e.target.value });
		setNameError("");
	};

	const onSurnameChange = (e) => {
		setUpdate({ ...update, surname: e.target.value });
		setSurnameError("");
	};

	const onFatherNameChange = (e) => {
		setUpdate({ ...update, fatherName: e.target.value });
	};

	const onPhoneChange = (e) => {
		setUpdate({ ...update, phone: e.target.value });
	};

	const onAddressChange = (e) => {
		setUpdate({ ...update, address: e.target.value });
	};

	useEffect(() => {
		patientAPI.getPatient(id).then((res) => {
			if (res === 404) return history.push("/patients");

			setPatient(res.data);
			setUpdate(res.data);

			const date = res.data.birthday.split("T")[0].split("-");
			setBirthday(date[2] + "/" + date[1] + "/" + date[0]);
			setSelectedDate(date[1] + "/" + date[2] + "/" + date[0]);
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
		let error = false;

		if (!update.name) {
			setNameError("Name is missing!");
			error = true;
		}
		if (!update.surname) {
			setSurnameError("Surname is missing!");
			error = true;
		} // eslint-disable-next-line
		if (selectedDate === null || selectedDate == "Invalid Date") {
			setBirthdayError("Invalid date!");
			error = true;
		}

		const date = new Date(selectedDate);
		let day = date.getDate();
		let month = date.getMonth() + 1;
		const year = date.getFullYear();

		const currentDate = new Date();
		const currentDay = currentDate.getDate();
		const currentMonth = currentDate.getMonth() + 1;
		const currentYear = currentDate.getFullYear();

		if (currentYear < year) {
			setBirthdayError("Invalid date!");
			error = true;
		} else if (currentYear === year) {
			if (currentMonth < month) {
				setBirthdayError("Invalid date!");
				error = true;
			} else if (currentMonth === month && currentDay < day) {
				setBirthdayError("Invalid date!");
				error = true;
			}
		}

		if (!error) {
			if (day < 10) day = "0" + day;
			if (month < 10) month = "0" + month;
			const birthday = month + "/" + day + "/" + year + " 4:00:00";

			patientAPI
				.editPatient(
					id,
					update.name,
					update.surname,
					update.fatherName,
					birthday,
					update.phone,
					update.address
				)
				.then(() => {
					setPatient(update);
					const date = birthday.split(" ")[0].split("/");
					setBirthday(date[1] + "/" + date[0] + "/" + date[2]);
					setOpenEdit(false);
				});
		}
	};

	const deletePatient = () => {
		patientAPI.deletePatient(id).then(() => {
			history.push("/patients");
		});
	};

	const back = () => {
		history.push("/patients");
	};

	return (
		<div>
			<div>
				<h1>
					<IconButton onClick={back}>
						<ArrowBackIosIcon />
					</IconButton>
					{patient.name} {patient.surname} {patient.fatherName}
				</h1>
				<div className={classes.flex}>
					<p>
						Birthday: {birthday}, age: {getAge()}
					</p>
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
				<p>Phone number: {patient.phone ? patient.phone : "Not registered"}</p>
				<p>Address: {patient.address ? patient.address : "Not registered"}</p>
				<Diagnoses />
			</div>

			<div>
				<Dialog
					open={openEdit}
					onClose={handleEditClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">Edit patient</DialogTitle>
					<DialogContent>
						<TextField
							autoFocus
							margin="dense"
							id="name"
							label="Name *"
							fullWidth
							onChange={onNameChange}
							value={update.name}
							error={!!nameError}
							helperText={nameError}
						/>
						<TextField
							margin="dense"
							id="surname"
							label="Surname *"
							fullWidth
							onChange={onSurnameChange}
							value={update.surname}
							error={!!surnameError}
							helperText={surnameError}
						/>
						<TextField
							margin="dense"
							id="fatherName"
							label="Father Name"
							fullWidth
							onChange={onFatherNameChange}
							value={update.fatherName}
						/>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="dd/MM/yyyy"
								margin="normal"
								id="birthday"
								label="Patient birthday date (dd/mm/yyyy) *"
								value={selectedDate}
								onChange={handleDateChange}
								KeyboardButtonProps={{
									"aria-label": "change date",
								}}
								error={!!birthdayError}
								helperText={birthdayError}
								fullWidth
							/>
						</MuiPickersUtilsProvider>
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
