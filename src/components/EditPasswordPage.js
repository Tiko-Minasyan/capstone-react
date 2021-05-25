import React from "react";
import doctorAPI from "../api/doctor.api";
import {
	Button,
	Container,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function EditPasswordPage() {
	const [oldPassword, setOldPassword] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [oldPasswordError, setOldPasswordError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	const onOldPasswordChange = (e) => {
		setOldPassword(e.target.value);
		setOldPasswordError("");
	};

	const onPasswordChange = (e) => {
		setPassword(e.target.value);
		setPasswordError("");
	};

	const onConfirmPasswordChange = (e) => {
		setConfirmPassword(e.target.value);
		setConfirmPasswordError("");
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let error = false;

		if (!oldPassword) {
			setOldPasswordError("Old password is missing!");
			error = true;
		} else if (oldPassword.length < 8) {
			setOldPasswordError("Password is too short!");
			error = true;
		}
		if (!password) {
			setPasswordError("New password is missing!");
			error = true;
		} else if (password.length < 8) {
			setPasswordError("Password is too short!");
			error = true;
		} else if (!confirmPassword) {
			setConfirmPasswordError("Please confirm your new password!");
			error = true;
		} else if (password !== confirmPassword) {
			setConfirmPasswordError("Passwords don't match!");
			error = true;
		}

		if (!error) {
			doctorAPI.updatePassword(oldPassword, password).then((res) => {
				if (res === 403) return setOldPasswordError("Incorrect password!");

				history.push("/profile");
			});
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Edit Password
				</Typography>
				<form className={classes.form} noValidate onSubmit={formSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						autoFocus
						name="oldPassword"
						label="Old password"
						type="password"
						id="oldPassword"
						autoComplete="current-password"
						value={oldPassword}
						onChange={onOldPasswordChange}
						error={!!oldPasswordError}
						helperText={oldPasswordError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="password"
						label="New Password"
						type="password"
						id="password"
						autoComplete="current-password"
						value={password}
						onChange={onPasswordChange}
						error={!!passwordError}
						helperText={passwordError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="confirmPassword"
						label="Confirm pasword"
						type="password"
						id="confirmPassword"
						autoComplete="current-password"
						value={confirmPassword}
						onChange={onConfirmPasswordChange}
						error={!!confirmPasswordError}
						helperText={confirmPasswordError}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Update account
					</Button>
					<Link to="/edit" variant="body2">
						Back to edit page
					</Link>
				</form>
			</div>
		</Container>
	);
}
