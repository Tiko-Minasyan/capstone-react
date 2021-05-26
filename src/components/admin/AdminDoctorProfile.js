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
import { makeStyles } from "@material-ui/core";

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
});

export default function AdminDoctorProfile() {
	const [doctor, setDoctor] = React.useState({});
	const [openDelete, setOpenDelete] = React.useState(false);

	const { id } = useParams();
	const history = useHistory();
	const classes = useStyles();

	const handleDeleteOpen = () => {
		setOpenDelete(true);
	};

	const handleDeleteClose = () => {
		setOpenDelete(false);
	};

	useEffect(() => {
		adminAPI.getDoctor(id).then((res) => {
			if (res === 404) history.push("/admin/viewDoctors");

			// console.log(res);
			setDoctor(res.data);
		});
	}, [history, id]);

	const back = () => {
		history.push("/admin/viewDoctors");
	};

	const deleteDoctor = () => {
		adminAPI.deleteDoctor(id).then(() => {
			history.push("/admin/viewDoctors");
		});
	};

	return (
		<>
			<div>
				<Button onClick={back} startIcon={<ArrowBackIcon />}>
					Back to doctors page
				</Button>
				<div className={classes.container}>
					<div className={classes.doctorContainer}>
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
						</div>
					</div>

					<div>
						<Button
							variant="contained"
							color="primary"
							// onClick={handleEditOpen}
							className={classes.btn}
						>
							Edit doctor
						</Button>{" "}
						<Button
							variant="contained"
							color="secondary"
							onClick={handleDeleteOpen}
							className={classes.btn}
						>
							Delete doctor
						</Button>
					</div>
				</div>
			</div>

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
					</DialogContentText>
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
		</>
	);
}
