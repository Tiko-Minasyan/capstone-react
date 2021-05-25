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

	const classes = useStyles();
	const history = useHistory();

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
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
