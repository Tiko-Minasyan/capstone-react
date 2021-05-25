import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import doctorAPI from "../api/doctor.api.js";

const useStyles = makeStyles({
	doctorContainer: {
		display: "flex",
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
			if (res === 403) return history.push("/");
			if (res === 404) return history.push("/");
			if (res === 409) return history.push("/admin/profile");

			setDoctor(res.data);

			if (res.data.firstLogin) setFirstLogin(true);
		});
	}, [history]);

	return doctor.name ? (
		<>
			<div>
				{firstLogin && (
					<p>
						Welcome to medical center! Please update your password for security
						reasons. <Link to="edit/password">Edit password</Link>
					</p>
				)}
				<div className={classes.doctorContainer}>
					<img
						src={`http://localhost:8000/images/${doctor.photo}`}
						alt="Doctor"
						className={classes.image}
					/>
					<h1>
						Welcome, {doctor.name} {doctor.surname}!
					</h1>
				</div>
			</div>
		</>
	) : (
		<></>
	);
}
