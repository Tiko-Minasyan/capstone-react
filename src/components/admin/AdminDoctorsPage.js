import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import adminApi from "../../api/admin.api";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@material-ui/core";
import { useHistory } from "react-router";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
	button: {
		width: "16%",
	},
	hover: {
		cursor: "pointer",
	},
});

export default function BasicTable() {
	const [doctors, setDoctors] = React.useState([]);
	const [selectedDoctor, setSelectedDoctor] = React.useState({});
	const [open, setOpen] = React.useState(false);

	const classes = useStyles();
	const history = useHistory();

	const handleClickOpen = (doctor) => {
		setOpen(true);
		setSelectedDoctor(doctor);
	};

	const handleClose = () => {
		setOpen(false);
		setSelectedDoctor({});
	};

	const deleteDoctor = () => {
		adminApi.deleteDoctor(selectedDoctor).then(() => {
			const newDoctors = doctors.filter(
				(doctor) => doctor._id !== selectedDoctor._id
			);
			setDoctors(newDoctors);
			setSelectedDoctor({});
			setOpen(false);
		});
	};

	useEffect(() => {
		adminApi.getDoctors().then((res) => {
			setDoctors(res.data);
		});
	}, []);

	const openDoctor = (id) => {
		history.push("/admin/viewDoctors/" + id);
	};

	return (
		<div>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Doctor Full Name</TableCell>
							<TableCell>Doctor Email</TableCell>
							<TableCell>Doctor profession</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{doctors.map((doctor) => (
							<TableRow
								key={doctor.name}
								hover
								className={classes.hover}
								onClick={() => openDoctor(doctor._id)}
							>
								<TableCell component="th" scope="row">
									{doctor.name} {doctor.surname}
								</TableCell>
								<TableCell>{doctor.email}</TableCell>
								<TableCell>{doctor.profession}</TableCell>
								<TableCell className={classes.button}>
									<Button
										variant="contained"
										color="secondary"
										size="small"
										startIcon={<DeleteIcon />}
										onClick={() => handleClickOpen(doctor)}
									>
										Delete doctor
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					Delete the doctor: {selectedDoctor.name} {selectedDoctor.surname}?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this doctor?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={deleteDoctor} color="secondary" autoFocus>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
