import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Button from "@material-ui/core/Button";
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
		display: "grid",
		alignItems: "center",
		gridTemplateColumns: "4fr 6fr",
		gridGap: "10%",
	},
	doctorContainer: {
		display: "flex",
		alignItems: "center",
		margin: "10px",
		padding: "20px",
		textAlign: "center",
	},
	image: {
		width: "280px",
		height: "350px",
	},
	info: {
		width: "100%",
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
	warningContainer: {
		width: "90%",
		marginLeft: "auto",
		marginRight: "15px",
		boxShadow: "2px 2px 5px",
		margin: "10px",
		height: "95%",
	},
	noWarnings: {
		textAlign: "center",
		fontSize: "18px",
	},
	diagnosesContainer: {
		padding: "10px",
	},
	header: {
		fontWeight: "bold",
		fontSize: "15px",
	},
});

export default function AdminDoctorProfile() {
	const [doctor, setDoctor] = React.useState({});
	const [warnings, setWarnings] = React.useState([]);
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});

	const [pageWarning, setPageWarning] = React.useState(0);
	const [countWarning, setCountWarning] = React.useState(0);
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

	const handleChangePageWarning = (e, newPage) => {
		setPageWarning(newPage);
	};

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
			setCountWarning(res.data.doctor.warnings.length);

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
			date[2] +
			"/" +
			date[1] +
			"/" +
			date[0] +
			" " +
			(parseInt(time[0]) + 4) +
			":" +
			time[1]
		);
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
		setPatientSearch("");
		setFinishedSearch("All");
	};

	const emptyRowsWarning = 5 - Math.min(5, countWarning - pageWarning * 5);
	const emptyRowsDiagnoses =
		10 - Math.min(10, countDiagnoses - pageDiagnoses * 10);

	return (
		<>
			<div>
				<div className={classes.container}>
					<Paper className={classes.doctorContainer} elevation={5}>
						<img
							src={`http://localhost:8000/images/${doctor.photo}`}
							alt="Doctor"
							className={classes.image}
						/>
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

					<TableContainer className={classes.warningContainer}>
						<Table className={classes.warningTable} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Warning details</TableCell>
									<TableCell>Severity</TableCell>
									<TableCell>Issued at</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{warnings
									.slice(pageWarning * 5, 5 + pageWarning * 5)
									.map((warning, index) => (
										<TableRow key={warning._id}>
											<TableCell>{warning.details}</TableCell>
											<TableCell>{warning.severity}</TableCell>
											<TableCell>{warning.date}</TableCell>
										</TableRow>
									))}
								{warnings.length === 0 ? (
									<TableRow style={{ height: 53 * emptyRowsWarning }}>
										<TableCell colSpan={3} className={classes.noWarnings}>
											The doctor has not received any warnings
										</TableCell>
									</TableRow>
								) : (
									emptyRowsWarning > 0 && (
										<TableRow style={{ height: 53 * emptyRowsWarning }}>
											<TableCell colSpan={6} />
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
						<TablePagination
							component="div"
							rowsPerPageOptions={[5]}
							onChangePage={handleChangePageWarning}
							count={countWarning}
							page={pageWarning}
							rowsPerPage={5}
						/>
					</TableContainer>
				</div>

				{/* 	Diagnoses table		 */}
				<div className={classes.diagnosesContainer}>
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
										<TableCell className={classes.header}>
											Patient full name
										</TableCell>
										<TableCell className={classes.header}>Diagnosis</TableCell>
										<TableCell className={classes.header}>
											Patient SSN
										</TableCell>
										<TableCell className={classes.header}>
											Is finished
										</TableCell>
										<TableCell className={classes.header}>
											Create date
										</TableCell>
										<TableCell className={classes.header}>
											Update date
										</TableCell>
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
											<TableCell>
												{diagnosis.isFinished ? "Yes" : "No"}
											</TableCell>
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
