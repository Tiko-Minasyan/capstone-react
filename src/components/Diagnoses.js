import React, { useEffect } from "react";
import { useParams } from "react-router";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import diagnosisAPI from "../api/diagnosis.api";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";

const useStyles = makeStyles({
	diagnoses: {
		marginTop: 50,
		borderTop: "2px solid gray",
	},
	table: {
		minWidth: 650,
	},
	diagnosis: {
		width: "1000px",
	},
	flex: {
		display: "flex",
		justifyContent: "space-between",
		height: "50px",
		alignItems: "center",
		paddingRight: "30px",
	},
	ownDiagnosis: {
		background: "lightgray",
	},
	error: {
		color: "#f44336",
	},
	editField: {
		marginBottom: "25px",
	},
});

export default function Diagnoses() {
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [doctorId, setDoctorId] = React.useState("");
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});

	const [complains, setComplains] = React.useState("");
	const [anamnesis, setAnamnesis] = React.useState("");
	const [objectiveStatus, setObjectiveStatus] = React.useState("");
	const [diagnosis, setDiagnosis] = React.useState("");
	const [researchPlan, setResearchPlan] = React.useState("");
	const [cures, setCures] = React.useState([]);
	const [finalDiagnosis, setFinalDiagnosis] = React.useState("");
	const [complainsError, setComplainsError] = React.useState("");
	const [anamnesisError, setAnamnesisError] = React.useState("");
	const [objectiveStatusError, setObjectiveStatusError] = React.useState("");
	const [diagnosisError, setDiagnosisError] = React.useState("");
	const [researchPlanError, setResearchPlanError] = React.useState("");
	const [curesError, setCuresError] = React.useState("");

	const [editDiagnosis, setEditDiagnosis] = React.useState("");
	const [editCures, setEditCures] = React.useState([]);
	const [editFinalDiagnosis, setEditFinalDiagnosis] = React.useState("");
	const [editDiagnosisError, setEditDiagnosisError] = React.useState("");

	const [open, setOpen] = React.useState(false);
	const [openDiagnosis, setOpenDiagnosis] = React.useState(false);
	const [ownDiagnosis, setOwnDiagnosis] = React.useState(false);
	const [editing, setEditing] = React.useState(false);

	const { id } = useParams();
	const classes = useStyles();

	const handleDiagnosisOpen = () => {
		setOpenDiagnosis(true);
	};

	const handleClickOpen = (index, id, isFinished) => {
		setOpen(true);
		setOpenedDiagnosis(diagnoses[index]);
		setOwnDiagnosis(id === doctorId && !isFinished);

		setEditDiagnosis("");
		setEditCures([]);
	};

	const handleClose = () => {
		setOpen(false);
		setOwnDiagnosis(false);
		setEditing(false);
	};

	const handleDiagnosisClose = () => {
		setOpenDiagnosis(false);
	};

	const onComplainsChange = (e) => {
		setComplains(e.target.value);
		setComplainsError("");
	};

	const onAnamnesisChange = (e) => {
		setAnamnesis(e.target.value);
		setAnamnesisError("");
	};

	const onObjectiveStatusChange = (e) => {
		setObjectiveStatus(e.target.value);
		setObjectiveStatusError("");
	};

	const onDiagnosisChange = (e) => {
		setDiagnosis(e.target.value);
		setDiagnosisError("");
	};

	const onResearchPlanChange = (e) => {
		setResearchPlan(e.target.value);
		setResearchPlanError("");
	};

	const onCureChange = (e, index) => {
		const newCures = [...cures];
		newCures[index] = e.target.value;
		setCures(newCures);
		setCuresError("");
	};

	const onFinalDiagnosisChange = (e) => {
		setFinalDiagnosis(e.target.value);
	};

	const onEditDiagnosisChange = (e) => {
		setEditDiagnosis(e.target.value);
		setEditDiagnosisError("");
	};

	const onEditCureChange = (e, index) => {
		const newCures = [...editCures];
		newCures[index] = e.target.value;
		setEditCures(newCures);
	};

	const onEditFinalDiagnosisChange = (e) => {
		setEditFinalDiagnosis(e.target.value);
	};

	useEffect(() => {
		getDiagnoses(); // eslint-disable-next-line
	}, []);

	const addCure = () => {
		if (cures[cures.length - 1] !== "") {
			setCures([...cures, ""]);
			setCuresError("");
		}
	};

	const addEditCure = () => {
		if (editCures[editCures.length - 1] !== "") {
			setEditCures([...editCures, ""]);
		}
	};

	const removeCure = () => {
		const newCures = [...cures];
		newCures.pop();
		setCures(newCures);
	};

	const removeEditCure = () => {
		const newCures = [...editCures];
		newCures.pop();
		setEditCures(newCures);
	};

	const addDiagnosis = () => {
		let error = false;

		if (!complains) {
			setComplainsError("Complains are missing!");
			error = true;
		}
		if (!anamnesis) {
			setAnamnesisError("Anamnesis is missing!");
			error = true;
		}
		if (!objectiveStatus) {
			setObjectiveStatusError("Objective status is missing!");
			error = true;
		}
		if (!diagnosis) {
			setDiagnosisError("Diagnosis is missing!");
			error = true;
		}
		if (!researchPlan) {
			setResearchPlanError("Research plan is missing!");
			error = true;
		}
		if (cures.length === 0 || (cures.length === 1 && cures[0] === "")) {
			setCuresError("Cures are missing!");
			error = true;
		}

		if (!error) {
			if (cures[cures.length - 1] === "") cures.pop();

			const data = {
				complains,
				anamnesis,
				objectiveStatus,
				diagnosis,
				researchPlan,
				cures,
				finalDiagnosis,
			};

			diagnosisAPI.add(id, data).then(() => {
				setOpenDiagnosis(false);

				setComplains("");
				setAnamnesis("");
				setObjectiveStatus("");
				setDiagnosis("");
				setResearchPlan("");
				setCures([]);
				setFinalDiagnosis("");

				getDiagnoses();
			});
		}
	};

	const timeFormat = (str) => {
		const date = str.split("T")[0].split("-");
		const time = str.split("T")[1].split(":");
		return (
			date[2] + "/" + date[1] + "/" + date[0] + " " + time[0] + ":" + time[1]
		);
	};

	const getDiagnoses = () => {
		diagnosisAPI.getDiagnoses(id).then((res) => {
			if (res) {
				res.data.diagnoses.forEach((item) => {
					item.createdAt = timeFormat(item.createdAt);
					item.updatedAt = timeFormat(item.updatedAt);

					if (item.doctor === null) item.doctor = { ...item.archivedDoctor };
				});

				setDiagnoses(res.data.diagnoses);
				setDoctorId(res.data.doctorId);
			}
		});
	};

	const splitText = (text) => {
		if (text) return text.split("\n").map((str) => <p key={1}>{str}</p>);
	};

	const updateDiagnosis = () => {
		setEditing(true);
	};

	const saveChanges = () => {
		if (
			!editDiagnosis &&
			!editFinalDiagnosis &&
			(editCures.length === 0 ||
				(editCures.length === 1 && editCures[0] === ""))
		) {
			handleClose();
		} else {
			if (editCures[editCures.length - 1] === "") editCures.pop();

			const data = {
				diagnosis: openedDiagnosis.diagnosis + "\n" + editDiagnosis,
				cures: [...openedDiagnosis.cures, ...editCures],
				finalDiagnosis: editFinalDiagnosis,
			};

			diagnosisAPI.update(openedDiagnosis._id, data).then(() => {
				handleClose();
				getDiagnoses();
			});
		}
	};

	const deleteDiagnosis = () => {
		diagnosisAPI.delete(openedDiagnosis._id).then(() => {
			handleClose();
			getDiagnoses();
		});
	};

	return (
		<div className={classes.diagnoses}>
			<div className={classes.flex}>
				<h2>Diagnoses of this patient</h2>

				<Button variant="contained" onClick={handleDiagnosisOpen}>
					Write diagnosis
				</Button>
			</div>

			{/* DIAGNOSES TABLE */}
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Doctor profession</TableCell>
							<TableCell>Diagnosis</TableCell>
							<TableCell>Doctor full name</TableCell>
							<TableCell>Is finished</TableCell>
							<TableCell>Create date</TableCell>
							<TableCell>Update date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{diagnoses.map((diagnosis, index) => (
							<TableRow
								key={diagnosis._id}
								className={
									diagnosis.doctor._id === doctorId ? classes.ownDiagnosis : ""
								}
							>
								<TableCell scope="row">{diagnosis.doctor.profession}</TableCell>
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
								<TableCell>
									{diagnosis.doctor.name} {diagnosis.doctor.surname}{" "}
									{diagnosis.doctor._id === doctorId && "(You)"}
								</TableCell>
								<TableCell>{diagnosis.isFinished ? "Yes" : "No"}</TableCell>
								<TableCell>{diagnosis.createdAt}</TableCell>
								<TableCell>{diagnosis.updatedAt}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* WRITE NEW DIAGNOSIS DIALOG */}
			<Dialog
				open={openDiagnosis}
				onClose={handleDiagnosisClose}
				aria-labelledby="form-dialog-title"
				fullWidth
			>
				<DialogTitle id="form-dialog-title">
					Write new diagnosis for the patient
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						multiline
						margin="dense"
						id="text"
						label="Complains"
						fullWidth
						onChange={onComplainsChange}
						value={complains}
						error={!!complainsError}
						helperText={complainsError}
					/>
					<TextField
						multiline
						margin="dense"
						id="anamnesis"
						label="Anamnesis"
						fullWidth
						onChange={onAnamnesisChange}
						value={anamnesis}
						error={!!anamnesisError}
						helperText={anamnesisError}
					/>
					<TextField
						multiline
						margin="dense"
						id="status"
						label="Objective Status"
						fullWidth
						onChange={onObjectiveStatusChange}
						value={objectiveStatus}
						error={!!objectiveStatusError}
						helperText={objectiveStatusError}
					/>
					<TextField
						multiline
						margin="dense"
						id="diagnosis"
						label="Diagnosis"
						fullWidth
						onChange={onDiagnosisChange}
						value={diagnosis}
						error={!!diagnosisError}
						helperText={diagnosisError}
					/>
					<TextField
						multiline
						margin="dense"
						id="plan"
						label="Research Plan"
						fullWidth
						onChange={onResearchPlanChange}
						value={researchPlan}
						error={!!researchPlanError}
						helperText={researchPlanError}
					/>
					<p>Cures / recommendations</p>
					{curesError && <p className={classes.error}>Cures are missing!</p>}
					{cures.map((cure, index) => (
						<TextField
							key={index}
							multiline
							margin="dense"
							id="cure"
							label={`Cure / recommendation ${index + 1}`}
							fullWidth
							onChange={(e) => onCureChange(e, index)}
							value={cure}
						/>
					))}
					<Button startIcon={<AddCircleIcon />} onClick={addCure}>
						Add cure
					</Button>
					{cures.length !== 0 && (
						<Button startIcon={<RemoveCircleIcon />} onClick={removeCure}>
							Remove cure
						</Button>
					)}

					<TextField
						multiline
						margin="dense"
						id="final"
						label="Final Diagnosis"
						fullWidth
						onChange={onFinalDiagnosisChange}
						value={finalDiagnosis}
						helperText="Warning: Cannot edit diagnosis after writing final diagnosis"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={addDiagnosis} color="primary">
						Add
					</Button>
					<Button onClick={handleDiagnosisClose} color="secondary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* OPEN DIAGNOSIS DIALOG */}
			<Dialog
				open={open}
				onClose={!editing && handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="alert-dialog-title">Diagnosis</DialogTitle>
				<DialogContent>
					{editing ? ( //		EDIT DIAGNOSIS
						<>
							<DialogContentText>Complains</DialogContentText>
							<p>{splitText(openedDiagnosis.complains)}</p> <hr />
							<DialogContentText>Anamnesis</DialogContentText>
							<p>{splitText(openedDiagnosis.anamnesis)}</p> <hr />
							<DialogContentText>Objective status</DialogContentText>
							<p>{splitText(openedDiagnosis.objectiveStatus)}</p> <hr />
							<DialogContentText>Diagnosis</DialogContentText>
							<p>{splitText(openedDiagnosis.diagnosis)}</p>
							<TextField
								autoFocus
								fullWidth
								multiline
								id="diagnosisEdit"
								margin="dense"
								label="Update diagnosis"
								value={editDiagnosis}
								onChange={onEditDiagnosisChange}
								error={!!editDiagnosisError}
								helperText={editDiagnosisError}
								className={classes.editField}
							/>
							<DialogContentText>Research plan</DialogContentText>
							<p>{splitText(openedDiagnosis.researchPlan)}</p>
							<DialogContentText>Cures</DialogContentText>
							<ul>
								{openedDiagnosis.cures &&
									openedDiagnosis.cures.map((cure) => (
										<li>{splitText(cure)}</li>
									))}
								{editCures.map((cure, index) => (
									<TextField
										key={index}
										multiline
										margin="dense"
										id="cureEdit"
										label={`New cure / recommendation ${index + 1}`}
										fullWidth
										onChange={(e) => onEditCureChange(e, index)}
										value={cure}
										className={classes.editField}
									/>
								))}
								<Button startIcon={<AddCircleIcon />} onClick={addEditCure}>
									Add cure
								</Button>
								{editCures.length !== 0 && (
									<Button
										startIcon={<RemoveCircleIcon />}
										onClick={removeEditCure}
									>
										Remove cure
									</Button>
								)}
							</ul>
							<DialogContentText>Final Diagnosis</DialogContentText>
							<TextField
								multiline
								margin="dense"
								id="finalEdit"
								label="Final Diagnosis"
								fullWidth
								onChange={onEditFinalDiagnosisChange}
								value={editFinalDiagnosis}
								helperText="Warning: Cannot edit diagnosis after writing final diagnosis"
							/>
						</>
					) : (
						//   READ DIAGNOSIS
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
									openedDiagnosis.cures.map((cure) => (
										<li>{splitText(cure)}</li>
									))}
							</ul>
							{openedDiagnosis.isFinished && (
								<>
									<hr />
									<DialogContentText>Final Diagnosis</DialogContentText>
									<p>{splitText(openedDiagnosis.finalDiagnosis)}</p>
								</>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					{ownDiagnosis &&
						(editing ? (
							<>
								<Button onClick={deleteDiagnosis} color="secondary">
									Delete diagnosis
								</Button>
								<Button onClick={saveChanges} color="primary">
									Save changes
								</Button>
							</>
						) : (
							<Button onClick={updateDiagnosis}>Edit diagnosis</Button>
						))}
					<Button onClick={handleClose} autoFocus>
						{editing ? "Cancel" : "Close"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
