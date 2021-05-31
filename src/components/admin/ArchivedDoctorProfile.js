import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import adminAPI from "../../api/admin.api";
import {
	makeStyles,
	Menu,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles({
	btn: {
		marginRight: "20px",
	},
	container: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	doctorContainer: {
		display: "flex",
		alignItems: "center",
		margin: "10px",
		padding: "20px",
	},
	image: {
		width: "240px",
		height: "300px",
	},
	info: {
		width: "400px",
		textAlign: "center",
	},
	radio: {
		marginTop: "30px",
		marginBottom: "10px",
	},
	search: {
		width: "450px",
	},
	finished: {
		height: "58px",
		marginLeft: "10px",
		width: "280px",
	},
	searchBtn: {
		height: "58px",
		marginLeft: "10px",
		width: "130px",
	},
	clearBtn: {
		height: "58px",
		marginLeft: "10px",
		width: "160px",
	},
});

export default function AdminDoctorProfile() {
	const [doctor, setDoctor] = React.useState({});
	const [warnings, setWarnings] = React.useState([]);
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});

	const [pageDiagnoses, setPageDiagnoses] = React.useState(0);
	const [countDiagnoses, setCountDiagnoses] = React.useState(0);

	const [patientSearch, setPatientSearch] = React.useState("");
	const [finishedSearch, setFinishedSearch] = React.useState("All");
	const [searchVal, setSearchVal] = React.useState({
		patientSearch,
		finishedSearch,
	});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [isSearching, setIsSearching] = React.useState(false);

	const { id } = useParams();
	const history = useHistory();
	const classes = useStyles();

	const handleClickOpen = (index) => {
		setOpen(true);
		setOpenedDiagnosis(diagnoses[index]);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleClickMenu = (e) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleChangePageDiagnoses = (e, newPage) => {
		setPageDiagnoses(newPage);
		isSearching ? search(newPage * 10) : getDoctor(newPage * 10);
	};

	const onPatientSearchChange = (e) => {
		setPatientSearch(e.target.value);
	};

	const finished = (val) => {
		setFinishedSearch(val);
		handleCloseMenu();
	};

	// eslint-disable-next-line
	useEffect(() => getDoctor(0), []);

	const getDoctor = (skip) => {
		adminAPI.getArchivedDoctor(id, skip).then((res) => {
			if (res === 404) return history.push("/admin/viewDoctors");

			let date = res.data.doctor.createdAt.split("T")[0].split("-");
			res.data.doctor.createdAt = date[2] + "/" + date[1] + "/" + date[0];

			date = res.data.doctor.deletedAt.split("T")[0].split("-");
			res.data.doctor.deletedAt = date[2] + "/" + date[1] + "/" + date[0];

			setDoctor(res.data.doctor);
			setCountDiagnoses(res.data.count);

			res.data.doctor.warnings.forEach((warning) => {
				const date = warning.date.split("T")[0].split("-");
				warning.date = date[2] + "/" + date[1] + "/" + date[0];
			});
			setWarnings(res.data.doctor.warnings);

			res.data.diagnoses.forEach((diagnosis) => {
				diagnosis.createdAt = timeFormat(diagnosis.createdAt);
				diagnosis.updatedAt = timeFormat(diagnosis.updatedAt);
			});
			setDiagnoses(res.data.diagnoses);
		});
	};

	const splitText = (text) => {
		if (text) return text.split("\n").map((str) => <p key={1}>{str}</p>);
	};

	const timeFormat = (str) => {
		const date = str.split("T")[0].split("-");
		const time = str.split("T")[1].split(":");
		return (
			date[2] + "/" + date[1] + "/" + date[0] + " " + time[0] + ":" + time[1]
		);
	};

	const back = () => {
		history.push("/admin/archive/doctors");
	};

	const search = (skip, btn = false) => {
		if (btn) {
			setPageDiagnoses(0);
			setSearchVal({ patientSearch, finishedSearch });
		} else {
			searchFunc(skip);
		}
	};

	// eslint-disable-next-line
	useEffect(() => searchFunc(0), [searchVal]);

	const searchFunc = (skip) => {
		setIsSearching(true);

		adminAPI
			.searchArchivedDoctorDiagnoses(
				id,
				searchVal.patientSearch,
				searchVal.finishedSearch,
				skip
			)
			.then((res) => {
				res.data.diagnoses.forEach((item) => {
					item.createdAt = timeFormat(item.createdAt);
					item.updatedAt = timeFormat(item.updatedAt);
				});
				setDiagnoses(res.data.diagnoses);
				setCountDiagnoses(res.data.count);
			});
	};

	const clearSearch = () => {
		getDoctor(0);
		setIsSearching(false);
		setPageDiagnoses(0);
	};

	const emptyRowsDiagnoses =
		10 - Math.min(10, countDiagnoses - pageDiagnoses * 10);

	return (
		<>
			<Button onClick={back} startIcon={<ArrowBackIcon />}>
				Back to doctors archive page
			</Button>
			<div>
				<div className={classes.container}>
					<div className={classes.doctorContainer}>
						<Paper className={classes.doctorContainer} elevation={5}>
							<div className={classes.info}>
								<h1>
									{doctor.name} {doctor.surname}
								</h1>
								<h2>{doctor.profession}</h2>
								<p>
									Phone number: {doctor.phone ? doctor.phone : "Not registered"}
								</p>
								<p>
									Address: {doctor.address ? doctor.address : "Not registered"}
								</p>
								<p>Created at: {doctor.createdAt}</p>
								<p>Deleted at: {doctor.deletedAt}</p>
								<p>Delete reason: {doctor.deleteReason}</p>
							</div>
						</Paper>
					</div>
				</div>

				<div>
					{warnings.length === 0 && <h1>The doctor had no warnings</h1>}
					{warnings.map((warning) => (
						<div>
							<h1>Warning text: {warning.details}</h1>
							<h2>Warning severity: {warning.severity}</h2>
							<h3>Written at: {warning.date}</h3>
						</div>
					))}
				</div>

				{/* 	Diagnoses table		 */}
				<h2>Diagnoses written by this doctor</h2>

				<div>
					<TextField
						variant="filled"
						label="Search by patient name, surname and father name"
						className={classes.search}
						value={patientSearch}
						onChange={onPatientSearchChange}
					/>
					<Button
						aria-controls="simple-menu"
						aria-haspopup="true"
						onClick={handleClickMenu}
						variant="outlined"
						className={classes.finished}
					>
						Show diagnoses - {finishedSearch}
					</Button>
					<Button
						startIcon={<SearchIcon />}
						variant="contained"
						color="primary"
						className={classes.searchBtn}
						onClick={() => search(0, true)}
					>
						Search
					</Button>
					<Button
						variant="contained"
						className={classes.clearBtn}
						onClick={clearSearch}
					>
						Clear search
					</Button>
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleCloseMenu}
					>
						<MenuItem onClick={() => finished("All")}>Show all</MenuItem>
						<MenuItem onClick={() => finished("Finished")}>
							Show finished
						</MenuItem>
						<MenuItem onClick={() => finished("Unfinished")}>
							Show unfinished
						</MenuItem>
					</Menu>
				</div>

				<div>
					<TableContainer component={Paper}>
						<Table className={classes.table} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Patient full name</TableCell>
									<TableCell>Diagnosis</TableCell>
									<TableCell>Patient SSN</TableCell>
									<TableCell>Is finished</TableCell>
									<TableCell>Create date</TableCell>
									<TableCell>Update date</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{diagnoses.map((diagnosis, index) => (
									<TableRow key={diagnosis._id}>
										<TableCell scope="row">
											{diagnosis.patient.name} {diagnosis.patient.surname}{" "}
											{diagnosis.patient.fatherName}
										</TableCell>
										<TableCell>
											<Button
												variant="outlined"
												onClick={() => handleClickOpen(index)}
											>
												View diagnosis
											</Button>
										</TableCell>
										<TableCell>{diagnosis.patient.SSN}</TableCell>
										<TableCell>{diagnosis.isFinished ? "Yes" : "No"}</TableCell>
										<TableCell>{diagnosis.createdAt}</TableCell>
										<TableCell>{diagnosis.updatedAt}</TableCell>
									</TableRow>
								))}

								{emptyRowsDiagnoses > 0 && (
									<TableRow style={{ height: 53 * emptyRowsDiagnoses }}>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						component="div"
						rowsPerPageOptions={[10]}
						onChangePage={handleChangePageDiagnoses}
						count={countDiagnoses}
						page={pageDiagnoses}
						rowsPerPage={10}
					/>
				</div>
			</div>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="alert-dialog-title">Diagnosis</DialogTitle>
				<DialogContent>
					<>
						<DialogContentText>Complains</DialogContentText>
						<p>{splitText(openedDiagnosis.complains)}</p> <hr />
						<DialogContentText>Anamnesis</DialogContentText>
						<p>{splitText(openedDiagnosis.anamnesis)}</p> <hr />
						<DialogContentText>Objective status</DialogContentText>
						<p>{splitText(openedDiagnosis.objectiveStatus)}</p> <hr />
						<DialogContentText>Diagnosis</DialogContentText>
						<p>{splitText(openedDiagnosis.diagnosis)}</p> <hr />
						<DialogContentText>Research plan</DialogContentText>
						<p>{splitText(openedDiagnosis.researchPlan)}</p> <hr />
						<DialogContentText>Cures</DialogContentText>
						<ul>
							{openedDiagnosis.cures &&
								openedDiagnosis.cures.map((cure) => <li>{splitText(cure)}</li>)}
						</ul>
						{openedDiagnosis.isFinished && (
							<>
								<hr />
								<DialogContentText>Final Diagnosis</DialogContentText>
								<p>{splitText(openedDiagnosis.finalDiagnosis)}</p>
							</>
						)}
					</>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
