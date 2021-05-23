import React, { useEffect } from "react";
import axios from "axios";
import {
	Button,
	Container,
	CssBaseline,
	Grid,
	makeStyles,
	TextField,
	Typography,
} from "@material-ui/core";

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

export default function EditPage() {
	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");
	const [oldPassword, setOldPassword] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [nameError, setNameError] = React.useState("");
	const [surnameError, setSurnameError] = React.useState("");
	const [oldPasswordError, setOldPasswordError] = React.useState("");
	const [passwordError, setPasswordError] = React.useState("");
	const [confirmPasswordError, setConfirmPasswordError] = React.useState("");

	const classes = useStyles();

	useEffect(() => {
		axios
			.get("http://localhost:8000/users/profile")
			.then((res) => {
				setName(res.data.name);
				setSurname(res.data.surname);
			})
			.catch((e) => {
				console.log(e.response);
			});
	}, []);

	const onNameChange = (e) => {
		setName(e.target.value);
		setNameError("");
	};

	const onSurnameChange = (e) => {
		setSurname(e.target.value);
		setSurnameError("");
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
	};

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Typography component="h1" variant="h5">
					Edit Account
				</Typography>
				<form className={classes.form} noValidate onSubmit={formSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								name="name"
								variant="outlined"
								fullWidth
								id="name"
								label="Name"
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
								label="surname"
								name="surname"
								value={surname}
								onChange={onSurnameChange}
								error={!!surnameError}
								helperText={surnameError}
							/>
						</Grid>
					</Grid>
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
						label="Password"
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
				</form>
			</div>
		</Container>
	);
}
