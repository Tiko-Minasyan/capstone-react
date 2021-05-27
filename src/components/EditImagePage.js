import React from "react";
import { Button, Container, makeStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
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
}));

export default function EditImagePage() {
	const [image, setImage] = React.useState({});

	const classes = useStyles();

	const selectImage = (e) => {
		setImage(e.target.files[0]);
	};

	const formSubmit = (e) => {
		e.preventDefault();

		if (!image) return;

		const formData = new FormData();
		formData.append("file", image);

		doctorAPI.updatePicture(formData).then((res) => {
			// console.log(res);
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
						<Button variant="contained" component="label">
							Upload File
							<input type="file" id="file" hidden onChange={selectImage} />
						</Button>
						<span> Image {image ? "selected" : "not selected"}</span>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Save changes
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
