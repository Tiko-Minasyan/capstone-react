import React, { useEffect } from "react";
import doctorAPI from "../api/doctor.api";
import {
	Button,
	Container,
	Grid,
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

export default function EditPage() {
	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");
	const [phone, setPhone] = React.useState("");
	const [address, setAddress] = React.useState("");
	const [nameError, setNameError] = React.useState("");
	const [surnameError, setSurnameError] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		doctorAPI.getProfile().then((res) => {
			if (typeof res === "number") return history.push("/profile");

			setName(res.data.name);
			setSurname(res.data.surname);
			setPhone(res.data.phone);
			setAddress(res.data.address);
		});
	}, [history]);

	const onNameChange = (e) => {
		setName(e.target.value);
		setNameError("");
	};

	const onSurnameChange = (e) => {
		setSurname(e.target.value);
		setSurnameError("");
	};

	const onPhoneChange = (e) => {
		setPhone(e.target.value);
	};

	const onAddressChange = (e) => {
		setAddress(e.target.value);
	};

	const formSubmit = (e) => {
		e.preventDefault();
		let error = false;

		if (!name) {
			setNameError("Name cannot be empty!");
			error = true;
		}
		if (!surname) {
			setSurnameError("Surname cannot be empty!");
			error = true;
		}

		if (!error) {
			doctorAPI.update(name, surname, phone, address).then(() => {
				history.push("/profile");
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
								label="Surname"
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
						name="phone"
						label="Phone number"
						id="phone"
						value={phone}
						onChange={onPhoneChange}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="address"
						label="Address"
						id="address"
						value={address}
						onChange={onAddressChange}
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
					<Grid container>
						<Grid item xs>
							<Link to="/edit/image" variant="body2">
								Edit profile picture
							</Link>
						</Grid>
						<Grid item>
							<Link to="/edit/password" variant="body2">
								Edit password
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
