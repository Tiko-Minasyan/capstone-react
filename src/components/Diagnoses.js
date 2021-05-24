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
});

export default function Diagnoses() {
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [doctorId, setDoctorId] = React.useState("");
	const [newDiagnosisText, setNewDiagnosisText] = React.useState("");
	const [diagnosisTextError, setDiagnosisTextError] = React.useState("");
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});

	const [open, setOpen] = React.useState(false);
	const [openDiagnosis, setOpenDiagnosis] = React.useState(false);
	const [ownDiagnosis, setOwnDiagnosis] = React.useState(false);
	const [editing, setEditing] = React.useState(false);
	const [editText, setEditText] = React.useState("");
	const [editTextError, setEditTextError] = React.useState("");

	const { id } = useParams();
	const classes = useStyles();

	const handleDiagnosisOpen = () => {
		setOpenDiagnosis(true);
	};

	const handleClickOpen = (index, id) => {
		setOpen(true);
		setOpenedDiagnosis(diagnoses[index]);
		setOwnDiagnosis(id === doctorId);
		setEditText(diagnoses[index].details);
	};

	const handleClose = () => {
		setOpen(false);
		setOwnDiagnosis(false);
		setEditing(false);
	};

	const handleDiagnosisClose = () => {
		setOpenDiagnosis(false);
	};

	const onTextChange = (e) => {
		setNewDiagnosisText(e.target.value);
		setDiagnosisTextError("");
	};

	const onEditTextChange = (e) => {
		setEditText(e.target.value);
		setEditTextError("");
	};

	useEffect(() => {
		getDiagnoses(); // eslint-disable-next-line
	}, []);

	const addDiagnosis = () => {
		diagnosisAPI.add(newDiagnosisText, id).then(() => {
			setOpenDiagnosis(false);
			setNewDiagnosisText("");
			getDiagnoses();
		});
	};

	const getDiagnoses = () => {
		diagnosisAPI.getDiagnoses(id).then((res) => {
			if (res) {
				let diagnoses = [];
				res.data.diagnoses.forEach((item) => {
					const date = item.createdAt.split("T")[0].split("-");
					const time = item.createdAt.split("T")[1].split(":");
					item.createdAt =
						date[2] +
						"/" +
						date[1] +
						"/" +
						date[0] +
						" " +
						time[0] +
						":" +
						time[1];

					diagnoses.unshift(item);
				});

				setDiagnoses(diagnoses);
				setDoctorId(res.data.doctorId);
			}
		});
	};

	const splitText = (text) => {
		if (text) return text.split("\n").map((str) => <p key={1}>{str}</p>);
	};

	const editDiagnosis = () => {
		setEditing(true);
	};

	const saveChanges = () => {
		if (!editText) setEditTextError("Diagnosis cannot be empty!");
		else {
			diagnosisAPI.update(openedDiagnosis._id, editText).then(() => {
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

			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Doctor profession</TableCell>
							<TableCell>Diagnosis text</TableCell>
							<TableCell>Doctor full name</TableCell>
							<TableCell>Create date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{diagnoses.map((diagnosis, index) => (
							<TableRow
								key={diagnosis._id}
								className={
									diagnosis.doctor._id === doctorId && classes.ownDiagnosis
								}
							>
								<TableCell scope="row">{diagnosis.doctor.profession}</TableCell>
								<TableCell>
									<Button
										variant="outlined"
										onClick={() => handleClickOpen(index, diagnosis.doctor._id)}
									>
										View diagnosis
									</Button>
								</TableCell>
								<TableCell>
									{diagnosis.doctor.name} {diagnosis.doctor.surname}{" "}
									{diagnosis.doctor._id === doctorId && "(You)"}
								</TableCell>
								<TableCell>{diagnosis.createdAt}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

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
						label="Text *"
						fullWidth
						onChange={onTextChange}
						value={newDiagnosisText}
						error={diagnosisTextError}
						helperText={diagnosisTextError}
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

			<Dialog
				open={open}
				onClose={!editing && handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				fullScreen
			>
				<DialogTitle id="alert-dialog-title">Diagnosis</DialogTitle>
				<DialogContent>
					{editing ? (
						<TextField
							autoFocus
							fullWidth
							multiline
							id="edit"
							margin="dense"
							label="Text *"
							value={editText}
							onChange={onEditTextChange}
							error={editTextError}
							helperText={editTextError}
						/>
					) : (
						<DialogContentText id="alert-dialog-description">
							{splitText(openedDiagnosis.details)}
						</DialogContentText>
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
							<Button onClick={editDiagnosis}>Edit diagnosis</Button>
						))}
					<Button onClick={handleClose} autoFocus>
						{editing ? "Cancel" : "Close"}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
