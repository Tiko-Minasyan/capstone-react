import React from "react";
import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import doctorAPI from "../api/doctor.api";

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
	error: {
		color: "red",
	},
	flex: {
		display: "flex",
		justifyContent: "space-between",
	},
}));

export default function EditImagePage() {
	const [image, setImage] = React.useState("");
	const [error, setError] = React.useState("");

	const classes = useStyles();
	const history = useHistory();

	const selectImage = (e) => {
		setImage(e.target.files[0]);
		setError("");
	};

	const formSubmit = (e) => {
		e.preventDefault();

		if (!image) return setError("Please select a picture!");

		const formData = new FormData();
		formData.append("file", image);

		doctorAPI.updatePicture(formData).then((res) => {
			if (res === 403)
				return setError("Wrong file format. Please select a picture!");

			history.push("/profile");
		});
	};

	const deletePicture = (e) => {
		doctorAPI.deletePicture().then(() => {
			history.push("/profile");
		});
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Update profile picture
					</Typography>
					<form className={classes.form} noValidate onSubmit={formSubmit}>
						<div className={classes.flex}>
							<Button variant="contained" component="label">
								Upload Picture
								<input type="file" id="file" hidden onChange={selectImage} />
							</Button>
							<Button
								variant="contained"
								component="label"
								onClick={deletePicture}
							>
								Delete your picture
							</Button>
						</div>
						<p style={{ textAlign: "center" }}>
							Image {image ? "selected" : "not selected"}
						</p>
						{error && <p className={classes.error}>{error}</p>}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Upload selected picture
						</Button>
						<Link to="/edit" variant="body2">
							Back to edit page
						</Link>
					</form>
				</div>
			</Container>
		</>
	);
}
