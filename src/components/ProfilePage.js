import { makeStyles, Paper } from "@material-ui/core";
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import doctorAPI from "../api/doctor.api.js";

const useStyles = makeStyles({
	container: {
		display: "flex",
		width: "800px",
		padding: "10px",
		margin: "20px",
	},
	info: {
		margin: "10px",
		textAlign: "center",
		width: "100%",
	},
	image: {
		width: "240px",
		height: "300px",
	},
});

export default function ProfilePage() {
	const [doctor, setDoctor] = React.useState({});
	const [firstLogin, setFirstLogin] = React.useState(false);

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		doctorAPI.getProfile().then((res) => {
			if (res === 404) return history.push("/");
			if (res === 409) return history.push("/admin/profile");

			setDoctor(res.data);

			if (res.data.firstLogin) setFirstLogin(true);
		});
	}, [history]);

	return doctor.name ? (
		<div>
			{firstLogin && (
				<p>
					Welcome to medical center! Please update your password for security
					reasons. <Link to="edit/password">Edit password</Link>
				</p>
			)}
			<Paper elevation={4} className={classes.container}>
				<img
					src={`http://localhost:8000/images/${doctor.photo}`}
					alt="Doctor"
					className={classes.image}
				/>
				<div className={classes.info}>
					<h1>
						Welcome, {doctor.name} {doctor.surname}!
					</h1>
					<h3>{doctor.profession}</h3>
					<p>Email address: {doctor.email}</p>
					<p>
						Home address: {doctor.address ? doctor.address : "Not registered"}
					</p>
					<p>Phone number: {doctor.phone ? doctor.phone : "Not registered"}</p>
				</div>
			</Paper>
		</div>
	) : (
		<></>
	);
}
