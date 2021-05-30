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
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@material-ui/core";

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
		width: "50%",
		justifyContent: "space-around",
	},
	image: {
		width: "240px",
		height: "300px",
	},
	info: {
		textAlign: "center",
	},
	radio: {
		marginTop: "30px",
		marginBottom: "10px",
	},
});

export default function AdminDoctorProfile() {
	const [doctor, setDoctor] = React.useState({});
	const [warnings, setWarnings] = React.useState([]);
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [open, setOpen] = React.useState(false);
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});

	const { id } = useParams();
	const history = useHistory();
	const classes = useStyles();

	const handleClickOpen = (index, id, isFinished) => {
		setOpen(true);
		setOpenedDiagnosis(diagnoses[index]);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// eslint-disable-next-line
	useEffect(() => getDoctor(), []);

	const getDoctor = () => {
		adminAPI.getArchivedDoctor(id).then((res) => {
			if (res === 404) return history.push("/admin/viewDoctors");

			// console.log(res);
			let date = res.data.doctor.createdAt.split("T")[0].split("-");
			res.data.doctor.createdAt = date[2] + "/" + date[1] + "/" + date[0];

			date = res.data.doctor.deletedAt.split("T")[0].split("-");
			res.data.doctor.deletedAt = date[2] + "/" + date[1] + "/" + date[0];

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

	const back = () => {
		history.push("/admin/archive/doctors");
	};

	return (
		<>
			<div>
				<Button onClick={back} startIcon={<ArrowBackIcon />}>
					Back to doctors archive page
				</Button>
				<div className={classes.container}>
					<div className={classes.doctorContainer}>
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

				<div>
					{diagnoses.length === 0 ? (
						<h1>
							The doctor did not write any diagnoses, or the diagnoses have been
							archived
						</h1>
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
