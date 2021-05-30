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
	FormControlLabel,
	FormLabel,
	makeStyles,
	Paper,
	Radio,
	RadioGroup,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from "@material-ui/core";

const useStyles = makeStyles({
	btn: {
		margin: "15px",
		width: "100%",
	},
	btnDiv: {
		textAlign: "center",
	},
	container: {
		// display: "flex",
		// alignItems: "center",
		// justifyContent: "space-between",
		display: "grid",
		gridTemplateColumns: "4fr 1fr 5fr",
		alignItems: "center",
		height: "400px",
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
		textAlign: "center",
		padding: "20px",
	},
	warningTable: {
		height: "100%",
		width: "90%",
		margin: "auto",
		border: "1px solid black",
	},
	radio: {
		marginTop: "30px",
		marginBottom: "10px",
	},
});

export default function AdminDoctorProfile() {
	const [doctor, setDoctor] = React.useState({});
	const [date, setDate] = React.useState("");
	const [warnings, setWarnings] = React.useState([]);
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [newWarning, setNewWarning] = React.useState({ severity: "low" });
	const [newWarningError, setNewWarningError] = React.useState("");
	const [deleteReason, setDeleteReason] = React.useState("");
	const [deleteReasonError, setDeleteReasonError] = React.useState("");
	const [openWarning, setOpenWarning] = React.useState(false);
	const [openDelete, setOpenDelete] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});

	const { id } = useParams();
	const history = useHistory();
	const classes = useStyles();

	const handleWarningOpen = () => {
		setOpenWarning(true);
	};

	const handleWarningClose = () => {
		setOpenWarning(false);
	};

	const handleDeleteOpen = () => {
		setOpenDelete(true);
	};

	const handleDeleteClose = () => {
		setOpenDelete(false);
	};

	const handleClickOpen = (index, id, isFinished) => {
		setOpen(true);
		setOpenedDiagnosis(diagnoses[index]);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleSeverityChange = (e) => {
		setNewWarning({ ...newWarning, severity: e.target.value });
	};

	const onWarningDetailsChange = (e) => {
		setNewWarning({ ...newWarning, details: e.target.value });
		setNewWarningError("");
	};

	const onDeleteReasonChange = (e) => {
		setDeleteReason(e.target.value);
		setDeleteReasonError("");
	};

	// eslint-disable-next-line
	useEffect(() => getDoctor(), []);

	const getDoctor = () => {
		adminAPI.getDoctor(id).then((res) => {
			if (res === 404) return history.push("/admin/viewDoctors");

			// console.log(res);
			const date = res.data.doctor.createdAt.split("T")[0].split("-");
			setDate(date[2] + "/" + date[1] + "/" + date[0]);

			setDoctor(res.data.doctor);

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

	const submitWarning = () => {
		if (!newWarning.details) {
			setNewWarningError("Please write the warning details!");
		} else {
			adminAPI.submitWarning(id, newWarning).then(() => {
				setNewWarning({ severity: "low" });
				handleWarningClose();
				getDoctor();
			});
		}
	};

	const deleteDoctor = () => {
		if (!deleteReason) {
			setDeleteReasonError("Please write the reason for deleting");
		} else {
			adminAPI.deleteDoctor(id, deleteReason).then(() => {
				history.push("/admin/viewDoctors");
			});
		}
	};

	// const emptyRowsWarning = 5 - Math.min(5, count - page * 5);
	const emptyRowsWarning = 5 - 2;

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
							<p>Created at: {date}</p>
						</div>
					</Paper>

					<div className={classes.btnDiv}>
						<Button
							variant="contained"
							onClick={handleWarningOpen}
							className={classes.btn}
						>
							Write a warning
						</Button>
						<br />
						<Button
							variant="contained"
							color="secondary"
							onClick={handleDeleteOpen}
							className={classes.btn}
						>
							Delete doctor
						</Button>
					</div>

					<TableContainer>
						<Table className={classes.warningTable} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Warning details</TableCell>
									<TableCell>Severity</TableCell>
									<TableCell>Issued at</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{warnings.map((warning, index) => (
									<TableRow key={warning._id}>
										<TableCell>{warning.details}</TableCell>
										<TableCell>{warning.severity}</TableCell>
										<TableCell>{warning.date}</TableCell>
									</TableRow>
								))}
								{emptyRowsWarning > 0 && (
									<TableRow style={{ height: 53 * emptyRowsWarning }}>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</div>

				{/* <div>
					{warnings.length === 0 && <h1>The doctor has no warnings</h1>}
					{warnings.map((warning) => (
						<div>
							<h1>Warning text: {warning.details}</h1>
							<h2>Warning severity: {warning.severity}</h2>
							<h3>Written at: {warning.date}</h3>
						</div>
					))}
				</div> */}

				<div>
					{diagnoses.length === 0 ? (
						<h1>The doctor has not written any diagnoses</h1>
					) : (
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
													onClick={() =>
														handleClickOpen(
															index,
															diagnosis.doctor._id,
															diagnosis.isFinished
														)
													}
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
								</TableBody>
							</Table>
						</TableContainer>
					)}
				</div>
			</div>

			{/* 	WARNING ADD DIALOG	 */}
			<Dialog
				open={openWarning}
				onClose={handleWarningClose}
				aria-labelledby="form-dialog-title"
				fullWidth
			>
				<DialogTitle id="form-dialog-title">Write a warning</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						id="phone"
						label="Warning details"
						fullWidth
						multiline
						onChange={onWarningDetailsChange}
						value={newWarning.details}
						error={!!newWarningError}
						helperText={newWarningError}
					/>
					<FormLabel component="legend" className={classes.radio}>
						Warning Severity
					</FormLabel>
					<RadioGroup
						aria-label="gender"
						name="severity"
						value={newWarning.severity}
						onChange={handleSeverityChange}
					>
						<FormControlLabel value="low" control={<Radio />} label="Low" />
						<FormControlLabel
							value="medium"
							control={<Radio />}
							label="Medium"
						/>
						<FormControlLabel value="high" control={<Radio />} label="High" />
						<FormControlLabel
							value="very high"
							control={<Radio />}
							label="Very High"
						/>
					</RadioGroup>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleWarningClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={submitWarning} color="primary">
						Submit Warning
					</Button>
				</DialogActions>
			</Dialog>

			{/* 	DELETE DIALOG	 */}
			<Dialog
				open={openDelete}
				onClose={handleDeleteClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Delete the doctor?</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this doctor?
						{warnings.length === 0 &&
							" Attention: This doctor has not received any warnings!"}
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
					<Button onClick={deleteDoctor} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

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
