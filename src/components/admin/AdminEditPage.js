import React, { useEffect } from "react";
import adminAPI from "../../api/admin.api";
import {
	Button,
	Container,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";
import { useHistory } from "react-router";
import { isEmail } from "validator";

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
	text: {
		marginTop: "30px",
	},
}));

export default function EditPage() {
	const [email, setEmail] = React.useState("");
	const [oldPassword, setOldPassword] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [emailError, setEmailError] = React.useState("");
	const [oldPasswordError, setOldPasswordError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		adminAPI.getProfile().then((res) => {
			if (typeof res === "number") return history.push("/");

			setEmail(res.data.email);
		});
	}, [history]);

	const onEmailChange = (e) => {
		setEmail(e.target.value);
		setEmailError("");
	};

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

		setOldPasswordError("");
		setPasswordError("");
		setConfirmPasswordError("");

		if (!email) {
			setEmailError("Email cannot be empty!");
			error = true;
		} else if (!isEmail(email)) {
			setEmailError("Wrong email format!");
			error = true;
		}
		if (!!password) {
			if (password.length < 8) {
				setPasswordError("Password is too short!");
				error = true;
			}
			if (!confirmPassword) {
				setConfirmPasswordError("Please confirm your password!");
				error = true;
			} else if (confirmPassword !== password) {
				setConfirmPasswordError("Passwords don't match!");
				error = true;
			}
			if (!oldPassword) {
				setOldPasswordError("Please write your old password!");
				error = true;
			} else if (oldPassword.length < 8) {
				setOldPasswordError("Password is too short!");
				error = true;
			}
		}

		if (!error) {
			adminAPI.update(email, password, oldPassword).then((res) => {
				if (res === 403) return setOldPasswordError("Incorrect password!");

				history.push("/admin/viewDoctors");
			});
		}
	};

	return (
		<Container component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Edit Account
				</Typography>
				<form className={classes.form} noValidate onSubmit={formSubmit}>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="phone"
						label="Email address"
						id="phone"
						value={email}
						onChange={onEmailChange}
						error={!!emailError}
						helperText={emailError}
					/>
					<Typography align="center" className={classes.text}>
						For updating password only
					</Typography>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="phone"
						type="password"
						label="Old password"
						id="oldPassword"
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
						type="password"
						label="New password"
						id="password"
						value={password}
						onChange={onPasswordChange}
						error={!!passwordError}
						helperText={passwordError}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="phone"
						type="password"
						label="Confirm password"
						id="confirmPassword"
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
				</form>
			</div>
		</Container>
	);
}
