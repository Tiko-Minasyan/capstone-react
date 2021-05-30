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
import validator from "validator";
import SearchIcon from "@material-ui/icons/Search";
import { TablePagination } from "@material-ui/core";

const useStyles = makeStyles({
	background: {
		background: "#6f7fdc",
		position: "absolute",
		width: "100%",
		height: "100vh",
		zIndex: "-1",
	},
	table: {
		minWidth: 650,
	},
	button: {
		width: "16%",
	},
	flex: {
		display: "flex",
		justifyContent: "flex-end",
		padding: "10px 10px",
		alignItems: "center",
	},
	title: {
		background: "#e0e0e0",
		width: "200px",
		borderRadius: "5px",
		height: "80%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	searchDiv: {
		display: "flex",
		justifyContent: "space-between",
		height: "70px",
		alignItems: "center",
	},
	search: {
		width: "400px",
		margin: "5px",
		background: "#e0e0e0",
		borderRadius: "3px",
	},
	searchBtn: {
		height: "55px",
		marginTop: "5px",
	},
	header: {
		fontWeight: "bold",
		fontSize: "15px",
	},
	row: {
		cursor: "pointer",
		"&:nth-of-type(odd)": {
			background: "lightgray",
		},
		"&:hover": {
			background: "gray !important",
		},
	},
});

export default function BasicTable() {
	const [patients, setPatients] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [selectedDate, setSelectedDate] = React.useState(new Date());
	const [page, setPage] = React.useState(0);
	const [count, setCount] = React.useState(0);
	const [isSearching, setIsSearching] = React.useState(false);

	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");
	const [fatherName, setFatherName] = React.useState("");
	const [phone, setPhone] = React.useState("");
	const [address, setAddress] = React.useState("");
	const [passportID, setPassportID] = React.useState("");
	const [SSN, setSSN] = React.useState("");
	const [nameError, setNameError] = React.useState("");
	const [surnameError, setSurnameError] = React.useState("");
	const [fatherNameError, setFatherNameError] = React.useState("");
	const [birthdayError, setBirthdayError] = React.useState("");
	const [addressError, setAddressError] = React.useState("");
	const [passportIDError, setPassportIDError] = React.useState("");
	const [SSNError, setSSNError] = React.useState("");

	const [nameSearch, setNameSearch] = React.useState("");
	const [idSearch, setIdSearch] = React.useState("");

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

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
		isSearching ? searchByName(newPage * 10) : getPatients(newPage * 10);
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
		setFatherNameError("");
	};

	const onPhoneChange = (e) => {
		setPhone(e.target.value);
	};

	const onAddressChange = (e) => {
		setAddress(e.target.value);
		setAddressError("");
	};

	const onPassportIDChange = (e) => {
		setPassportID(e.target.value);
		setPassportIDError("");
	};

	const onSSNChange = (e) => {
		setSSN(e.target.value);
		setSSNError("");
	};

	const onNameSearchChange = (e) => {
		setNameSearch(e.target.value);
	};

	const onIdSearchChange = (e) => {
		setIdSearch(e.target.value);
	};

	useEffect(() => {
		getPatients(0);
	}, []);

	const getPatients = (skip) => {
		patientAPI.getPatients(skip).then((res) => {
			setPatients(res.data.patients);
			setCount(res.data.count);
		});
	};

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
		if (!fatherName) {
			setFatherNameError("Father name is missing!");
			error = true;
		}
		if (!address) {
			setAddressError("Address is missnig!");
			error = true;
		}
		if (!passportID) {
			setPassportIDError("Passport or ID card number is missing!");
			error = true;
		} else {
			const isPassport = validator.isPassportNumber(passportID, "AM");
			const isID =
				validator.isNumeric(passportID, { no_symbols: true }) &&
				passportID.length === 9;
			if (!isPassport && !isID) {
				setPassportIDError("Wrong passport or ID number format!");
				error = true;
			}
		}
		if (!SSN) {
			setSSNError("SSN is missing!");
			error = true;
		} else if (
			!validator.isNumeric(SSN, { no_symbols: true }) ||
			SSN.length !== 10
		) {
			setSSNError("Wrong SSN format!");
			error = true;
		} // eslint-disable-next-line
		if (selectedDate === null || selectedDate == "Invalid Date") {
			setBirthdayError("Invalid date!");
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
			const data = {
				name,
				surname,
				fatherName,
				birthday,
				phone,
				address,
				passportID,
				SSN,
			};
			patientAPI.addPatient(data).then(() => {
				setOpen(false);
				setName("");
				setSurname("");
				setFatherName("");
				setSelectedDate(new Date());
				setPhone("");
				setAddress("");
				setPassportID("");
				setSSN("");
				getPatients(0);
				setPage(0);
			});
		}
	};

	const searchByName = (skip) => {
		if (!nameSearch) {
			setIsSearching(false);
			setPage(0);
			return getPatients();
		}

		if (!isSearching) {
			setIsSearching(true);
			setPage(0);
		}

		patientAPI.searchByName(nameSearch, skip).then((res) => {
			setPatients(res.data.patients);
			setCount(res.data.count);
		});
	};

	const searchById = () => {
		if (!idSearch) {
			setIsSearching(false);
			setPage(0);
			return getPatients();
		}

		patientAPI.searchById(idSearch).then((res) => {
			setPatients(res.data.patients);
			setCount(res.data.count);
			setPage(0);
		});
	};

	const emptyRows = 10 - Math.min(10, count - page * 10);

	return (
		<div>
			<div className={classes.background}></div>
			<div className={classes.searchDiv}>
				<div>
					<TextField
						variant="filled"
						label="Search by name, surname, father name"
						className={classes.search}
						value={nameSearch}
						onChange={onNameSearchChange}
					/>
					<Button
						variant="contained"
						className={classes.searchBtn}
						onClick={() => searchByName(0)}
					>
						<SearchIcon />
					</Button>
				</div>
				<div className={classes.title}>
					<h2>Patients Page</h2>
				</div>
				<div>
					<TextField
						variant="filled"
						label="Search by passport or ID card number or SSN"
						className={classes.search}
						value={idSearch}
						onChange={onIdSearchChange}
					/>
					<Button
						variant="contained"
						className={classes.searchBtn}
						onClick={searchById}
					>
						<SearchIcon />
					</Button>
				</div>
			</div>
			<div className={classes.flex}>
				<Button
					startIcon={<AddCircleIcon />}
					onClick={handleClickOpen}
					variant="contained"
				>
					Add new patient
				</Button>
			</div>
			<Paper elevation={5}>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell className={classes.header}>Patient Name</TableCell>
								<TableCell className={classes.header}>
									Patient Surname
								</TableCell>
								<TableCell className={classes.header}>
									Patient Father Name
								</TableCell>
								<TableCell className={classes.header}>Patient Age</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{patients.map((patient) => (
								<TableRow
									key={patient._id}
									hover
									onClick={() => openPatient(patient._id)}
									className={classes.row}
								>
									<TableCell component="th" scope="row">
										{patient.name}
									</TableCell>
									<TableCell>{patient.surname}</TableCell>
									<TableCell>{patient.fatherName}</TableCell>
									<TableCell>{getAge(patient.birthday)}</TableCell>
								</TableRow>
							))}

							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					component="div"
					rowsPerPageOptions={[10]}
					onChangePage={handleChangePage}
					count={count}
					page={page}
					rowsPerPage={10}
				/>
			</Paper>

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
						label="Name"
						fullWidth
						onChange={onNameChange}
						value={name}
						error={!!nameError}
						helperText={nameError}
					/>
					<TextField
						margin="dense"
						id="surname"
						label="Surname"
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
						error={!!fatherNameError}
						helperText={fatherNameError}
					/>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							variant="inline"
							format="dd/MM/yyyy"
							margin="normal"
							id="birthday"
							label="Patient birthday date (dd/mm/yyyy)"
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
						id="passport"
						label="Passport ot ID card number"
						fullWidth
						onChange={onPassportIDChange}
						value={passportID}
						error={!!passportIDError}
						helperText={passportIDError}
					/>
					<TextField
						margin="dense"
						id="ssn"
						label="SSN"
						fullWidth
						onChange={onSSNChange}
						value={SSN}
						error={!!SSNError}
						helperText={SSNError}
					/>
					<TextField
						margin="dense"
						id="address"
						label="Address"
						fullWidth
						onChange={onAddressChange}
						value={address}
						error={!!addressError}
						helperText={addressError}
					/>
					<TextField
						margin="dense"
						id="phone"
						label="Phone number (optional)"
						fullWidth
						onChange={onPhoneChange}
						value={phone}
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
