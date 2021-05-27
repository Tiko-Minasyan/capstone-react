import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link, useHistory } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
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
		height: "420px",
		borderRadius: "20px",
	},
	paper: {
		marginTop: theme.spacing(3),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [emailError, setEmailError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
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

	const onPasswordChange = (e) => {
		setPassword(e.target.value);
		setPasswordError("");
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let error = false;

		if (!email) {
			setEmailError("Email is missing!");
			error = true;
		} else if (!isEmail(email)) {
			setEmailError("Wrong email format!");
			error = true;
		}
		if (!password) {
			setPasswordError("Password is missing!");
			error = true;
		} else if (password.length < 8) {
			setPasswordError("Password is too short!");
			error = true;
		}

		if (!error) {
			doctorAPI.login(email, password).then((res) => {
				if (res === 404) return setEmailError("Email not registered!");
				if (res === 403) return setPasswordError("Wrong password!");

				localStorage.setItem("token", res);
				history.push("/profile");
			});
		}
	};

	return (
		<div className={classes.background}>
			<Container component="main" maxWidth="xs" className={classes.container}>
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign in
					</Typography>
					<form className={classes.form} noValidate onSubmit={formSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
							value={email}
							onChange={onEmailChange}
							error={!!emailError}
							helperText={emailError}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							onChange={onPasswordChange}
							error={!!passwordError}
							helperText={passwordError}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>
						<Link to="/admin" variant="body2">
							Forgot password?
						</Link>
					</form>
				</div>
			</Container>
		</div>
	);
}
