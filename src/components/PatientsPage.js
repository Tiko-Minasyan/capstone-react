import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import patientAPI from "../api/patient.api";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers";
import { useHistory } from "react-router";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
	button: {
		width: "16%",
	},
	addBtn: {
		width: "50px",
	},
});

export default function BasicTable() {
	const [patients, setPatients] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [selectedDate, setSelectedDate] = React.useState(new Date());

	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");
	const [fatherName, setFatherName] = React.useState("");
	const [phone, setPhone] = React.useState("");
	const [address, setAddress] = React.useState("");
	const [nameError, setNameError] = React.useState("");
	const [surnameError, setSurnameError] = React.useState("");
	const [birthdayError, setBirthdayError] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);

		setNameError("");
		setSurnameError("");
		setBirthdayError("");
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
		setBirthdayError("");
	};

	const onNameChange = (e) => {
		setName(e.target.value);
		setNameError("");
	};

	const onSurnameChange = (e) => {
		setSurname(e.target.value);
		setSurnameError("");
	};

	const onFatherNameChange = (e) => {
		setFatherName(e.target.value);
	};

	const onPhoneChange = (e) => {
		setPhone(e.target.value);
	};

	const onAddressChange = (e) => {
		setAddress(e.target.value);
	};

	useEffect(() => {
		patientAPI.getPatients().then((res) => {
			if (typeof res !== "number") {
				res.data.forEach((patient) => {
					if (patient.fatherName === "") patient.fatherName = "–";
				});

				setPatients(res.data);
			}
		});
	}, []);

	const openPatient = (id) => {
		history.push("/patients/" + id);
	};

	const getAge = (date) => {
		const birthday = date.split("T")[0].split("-");

		const today = new Date();
		const year = today.getFullYear();
		const month = today.getMonth() + 1;
		const day = today.getDate();

		const birthdayYear = parseInt(birthday[0]);
		const birthdayMonth = parseInt(birthday[1]);
		const birthdayDay = parseInt(birthday[2]);

		let age = year - birthdayYear;
		let monthDiff = month - birthdayMonth;

		if (monthDiff < 0) age--;
		else if (monthDiff === 0) {
			if (day - birthdayDay < 0) age--;
		}

		return age;
	};

	const addPatient = () => {
		let error = false;

		if (!name) {
			setNameError("Name is missing!");
			error = true;
		}
		if (!surname) {
			setSurnameError("Surname is missing!");
			error = true;
		}

		const date = new Date(selectedDate);
		const day = date.getDate();
		const month = date.getMonth() + 1;
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
			const birthday = month + "/" + day + "/" + year + " 4:00:00";
			patientAPI
				.addPatient(name, surname, fatherName, birthday, phone, address)
				.then((res) => {
					const newPatients = [
						...patients,
						{
							_id: res.data,
							name,
							surname,
							fatherName: fatherName !== "" ? fatherName : "–",
							birthday: year + "-" + month + "-" + day + "T",
							phone,
							address,
						},
					];

					setPatients(newPatients);
					setOpen(false);
					setName("");
					setSurname("");
					setFatherName("");
					setSelectedDate(new Date());
					setPhone("");
					setAddress("");
				});
		}
	};

	return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Patient Name</TableCell>
							<TableCell>Patient Surname</TableCell>
							<TableCell>Patient Father Name</TableCell>
							<TableCell>Patient Age</TableCell>
							<TableCell className={classes.addBtn}>
								<IconButton onClick={handleClickOpen}>
									<AddCircleIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{patients.map((patient) => (
							<TableRow
								key={patient._id}
								hover
								onClick={() => openPatient(patient._id)}
							>
								<TableCell component="th" scope="row">
									{patient.name}
								</TableCell>
								<TableCell>{patient.surname}</TableCell>
								<TableCell>{patient.fatherName}</TableCell>
								<TableCell>{getAge(patient.birthday)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Register a new patient</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To register a new patient, please fill in their personal info
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Name *"
						fullWidth
						onChange={onNameChange}
						value={name}
						error={!!nameError}
						helperText={nameError}
					/>
					<TextField
						margin="dense"
						id="surname"
						label="Surname *"
						fullWidth
						onChange={onSurnameChange}
						value={surname}
						error={!!surnameError}
						helperText={surnameError}
					/>
					<TextField
						margin="dense"
						id="fatherName"
						label="Father Name"
						fullWidth
						onChange={onFatherNameChange}
						value={fatherName}
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
						value={phone}
					/>
					<TextField
						margin="dense"
						id="address"
						label="Address"
						fullWidth
						onChange={onAddressChange}
						value={address}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={addPatient} color="primary">
						Register
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
