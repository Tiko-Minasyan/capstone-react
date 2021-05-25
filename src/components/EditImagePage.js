import React from "react";
import { Button, Container, makeStyles, Typography } from "@material-ui/core";
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

export default function EditImagePage() {
	// const [image, setImage] = React.useState("");

	const classes = useStyles();

	const formSubmit = (e) => {
		e.preventDefault();
	};

	const a = (e) => {
		console.log("SUBMITTED");
		console.log(e.target.files[0]);
		console.log(typeof e.target.files);
		console.log(e.target.result);
	};

	return (
		<>
			<Container component="main" maxWidth="xs">
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Edit Password
					</Typography>
					<form className={classes.form} noValidate onSubmit={formSubmit}>
						<Button variant="contained" component="label">
							Upload File
							<input type="file" hidden onChange={a} />
						</Button>
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
		</>
	);
}
