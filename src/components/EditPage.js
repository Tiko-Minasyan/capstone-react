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
}));

export default function EditPage() {
	const [email, setEmail] = React.useState("");
	const [phone, setPhone] = React.useState("");
	const [address, setAddress] = React.useState("");
	const [emailError, setEmailError] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		doctorAPI.getProfile().then((res) => {
			if (typeof res === "number") return history.push("/profile");

			setEmail(res.data.email);
			setPhone(res.data.phone);
			setAddress(res.data.address);
		});
	}, [history]);

	const onEmailChange = (e) => {
		setEmail(e.target.value);
		setEmailError("");
	};

	const onPhoneChange = (e) => {
		setPhone(e.target.value);
	};

	const onAddressChange = (e) => {
		setAddress(e.target.value);
	};

	const formSubmit = (e) => {
		e.preventDefault();
		if (!email) {
			setEmailError("Email cannot be empty!");
		} else if (!isEmail(email)) {
			setEmailError("Wrong email format!");
		} else {
			doctorAPI.update(email, phone, address).then(() => {
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
					<TextField
						variant="outlined"
						margin="normal"
						fullWidth
						name="email"
						label="Email address"
						id="email"
						value={email}
						onChange={onEmailChange}
						error={!!emailError}
						helperText={emailError}
					/>
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
