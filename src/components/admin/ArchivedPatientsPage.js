import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import adminAPI from "../../api/admin.api";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router";
import SearchIcon from "@material-ui/icons/Search";
import { TablePagination } from "@material-ui/core";

const useStyles = makeStyles({
	background: {
		background: "#707690",
		position: "absolute",
		width: "100%",
		height: "100vh",
		zIndex: "-1",
		top: 0,
	},
	table: {
		minWidth: 650,
	},
	button: {
		width: "16%",
	},
	title: {
		background: "#e0e0e0",
		width: "250px",
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
		margin: "10px 5px 40px",
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
	const [page, setPage] = React.useState(0);
	const [count, setCount] = React.useState(0);
	const [isSearching, setIsSearching] = React.useState(false);

	const [nameSearch, setNameSearch] = React.useState("");
	const [idSearch, setIdSearch] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
		isSearching ? searchByName(newPage * 10) : getPatients(newPage * 10);
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
		adminAPI.getArchivedPatients(skip).then((res) => {
			setPatients(res.data.patients);
			setCount(res.data.count);
		});
	};

	const openPatient = (id) => {
		history.push("/admin/archive/patients/" + id);
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

		adminAPI.searchArchivedPatientsByName(nameSearch, skip).then((res) => {
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

		adminAPI.searchArchivedPatientsById(idSearch).then((res) => {
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
					<h2>Patients Archive</h2>
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
		</div>
	);
}
