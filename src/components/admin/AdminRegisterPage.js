import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { isEmail } from "validator";
import { Grid, Paper } from "@material-ui/core";
import adminAPI from "../../api/admin.api";

const useStyles = makeStyles((theme) => ({
	container: {
		width: "500px",
		padding: "20px",
		paddingTop: 0,
	},
	flex: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "700px",
	},
	paper: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function AdminSignIn() {
	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");
	const [profession, setProfession] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [nameError, setNameError] = React.useState("");
	const [surnameError, setSurnameError] = React.useState("");
	const [professionError, setProfessionError] = React.useState("");
	const [emailError, setEmailError] = React.useState("");
	const history = useHistory();
	const classes = useStyles();

	const onNameChange = (e) => {
		setName(e.target.value);
		setNameError("");
	};

	const onSurnameChange = (e) => {
		setSurname(e.target.value);
		setSurnameError("");
	};

	const onProfessionChange = (e) => {
		setProfession(e.target.value);
		setProfessionError("");
	};

	const onEmailChange = (e) => {
		setEmail(e.target.value);
		setEmailError("");
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let error = false;

		if (!name) {
			setNameError("Name is missing!");
			error = true;
		}
		if (!surname) {
			setSurnameError("Surname is missing!");
			error = true;
		}
		if (!profession) {
			setProfessionError("Profession is missing!");
			error = true;
		}
		if (!email) {
			setEmailError("Email is missing!");
			error = true;
		} else if (!isEmail(email)) {
			setEmailError("Wrong email format!");
			error = true;
		}

		if (!error) {
			adminAPI.register(name, surname, profession, email).then((res) => {
				if (res === 409) setEmailError("Email already registered!");
				else history.push("/admin/viewDoctors");
			});
		}
	};

	return (
		<div className={classes.flex}>
			<Paper className={classes.container} elevation={5}>
				<Container component="Paperr" maxWidth="xs">
					<CssBaseline />
					<div className={classes.paper}>
						<Typography component="h1" variant="h5">
							Register a New Doctor
						</Typography>
						<form className={classes.form} noValidate onSubmit={formSubmit}>
							<Grid container spacing={2}>
								<Grid item xs={12} sm={6}>
									<TextField
										name="name"
										variant="outlined"
										fullWidth
										id="name"
										label="Doctor Name"
										autoFocus
										value={name}
										onChange={onNameChange}
										error={!!nameError}
										helperText={nameError}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										variant="outlined"
										fullWidth
										id="surname"
										label="Doctor Surname"
										name="surname"
										value={surname}
										onChange={onSurnameChange}
										error={!!surnameError}
										helperText={surnameError}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										id="profession"
										label="Doctor Profession"
										name="profession"
										value={profession}
										onChange={onProfessionChange}
										error={!!professionError}
										helperText={professionError}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										id="email"
										label="Email Address"
										name="email"
										value={email}
										onChange={onEmailChange}
										error={!!emailError}
										helperText={emailError}
									/>
								</Grid>
							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
							>
								Register
							</Button>
						</form>
					</div>
				</Container>
			</Paper>
		</div>
	);
}
