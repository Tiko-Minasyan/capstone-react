import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { isEmail } from "validator";
import doctorAPI from "../api/doctor.api";

const useStyles = makeStyles((theme) => ({
	background: {
		background: "#3f51b5",
		width: "100%",
		height: "100vh",
		position: "absolute",
		display: "flex",
		alignItems: "center",
	},
	container: {
		background: "white",
		height: "320px",
		borderRadius: "20px",
	},
	containerMedium: {
		background: "white",
		height: "420px",
		borderRadius: "20px",
	},
	containerBig: {
		background: "white",
		height: "570px",
		borderRadius: "20px",
	},
	paper: {
		marginTop: theme.spacing(3),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(2, 0, 2),
	},
	recover: {
		fontSize: "17px",
		textAlign: "center",
		marginTop: "20px",
	},
}));

export default function SignIn() {
	const [email, setEmail] = React.useState("");
	const [code, setCode] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [emailError, setEmailError] = React.useState("");
	const [codeError, setCodeError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
	const [emailSent, setEmailSent] = React.useState(false);
	const [codeSent, setCodeSent] = React.useState(false);

	const history = useHistory();
	const classes = useStyles();

	useEffect(() => {
		if (!!localStorage.getItem("token")) {
			doctorAPI.getProfile().then((res) => {
				if (res === 409) return history.push("/admin/viewDoctors");
				if (res === 403) return localStorage.removeItem("token");
				if (res === 404) return localStorage.removeItem("token");

				console.log("You are already logged in!");
				history.push("/profile");
			});
		} // eslint-disable-next-line
	}, [history]);

	const onEmailChange = (e) => {
		setEmail(e.target.value);
		setEmailError("");
	};

	const onCodeChange = (e) => {
		setCode(e.target.value);
		setCodeError("");
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

		if (!email) {
			setEmailError("Please write your email address!");
			error = true;
		} else if (!isEmail(email)) {
			setEmailError("Wrong email format!");
			error = true;
		}

		if (emailSent) {
			if (!code) {
				setCodeError("Please write the recovery code!");
				error = true;
			}
		}

		if (codeSent) {
			if (!password) {
				setPasswordError("Please write your new password!");
				error = true;
			} else if (password.length < 8) {
				setPasswordError("Password is too short!");
				error = true;
			} else if (!confirmPassword) {
				setConfirmPasswordError("Please confirm your password!");
				error = true;
			} else if (confirmPassword !== password) {
				setConfirmPasswordError("Passwords don't match!");
				error = true;
			}
		}

		if (!error) {
			if (!emailSent) {
				doctorAPI.getRecoveryCode(email).then((res) => {
					if (res === 404) return setEmailError("Email not registered!");

					setEmailSent(true);
				});
			} else if (!codeSent) {
				doctorAPI.sendRecoveryCode(email, code).then((res) => {
					if (res === 404) return setEmailError("Wrong email address!");
					if (res === 403) return setCodeError("Recovery code is incorrect!");

					setCodeSent(true);
				});
			} else {
				doctorAPI.recoverPassword(email, code, password).then((res) => {
					if (res === 404) return setEmailError("Wrong email address!");
					if (res === 403) return setCodeError("Recovery code is incorrect!");

					history.push("/");
				});
			}
		}
	};

	return (
		<div className={classes.background}>
			<Container
				component="main"
				maxWidth="xs"
				className={
					emailSent
						? codeSent
							? classes.containerBig
							: classes.containerMedium
						: classes.container
				}
			>
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Forgot Password
					</Typography>
					<form className={classes.form} noValidate onSubmit={formSubmit}>
						<p className={classes.recover}>
							Write your email address to recover your password
						</p>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							label="Email Address"
							name="email"
							autoFocus
							value={email}
							onChange={onEmailChange}
							error={!!emailError}
							helperText={emailError}
							disabled={emailSent ? true : false}
						/>
						{emailSent && (
							<TextField
								variant="outlined"
								margin="normal"
								fullWidth
								label="Recovery Code"
								value={code}
								onChange={onCodeChange}
								error={!!codeError}
								helperText={codeError}
								disabled={codeSent ? true : false}
							/>
						)}
						{codeSent && (
							<>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									label="New Password"
									type="password"
									value={password}
									onChange={onPasswordChange}
									error={!!passwordError}
									helperText={passwordError}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									fullWidth
									label="Confirm Password"
									type="password"
									value={confirmPassword}
									onChange={onConfirmPasswordChange}
									error={!!confirmPasswordError}
									helperText={confirmPasswordError}
								/>
							</>
						)}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{emailSent
								? codeSent
									? "Update Password"
									: "Send Recovery Code"
								: "Recieve Recovery Code"}
						</Button>
						<Link to="/" variant="body2">
							Back to login
						</Link>
					</form>
				</div>
			</Container>
		</div>
	);
}
