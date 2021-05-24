import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import adminAPI from "../../api/admin.api";

export default function AdminDoctorProfile() {
	const [doctor, setDoctor] = React.useState({});

	const { id } = useParams();
	const history = useHistory();

	useEffect(() => {
		adminAPI.getDoctor(id).then((res) => {
			if (res === 404) history.push("/admin/viewDoctors");

			console.log(res);
			setDoctor(res.data);
		});
	}, []);

	const back = () => {
		history.push("/admin/viewDoctors");
	};

	return (
		<>
			{/* <div>
				<h1>
					<IconButton onClick={back}>
						<ArrowBackIosIcon />
					</IconButton>
					{doctor.name} {doctor.surname}
				</h1>
				<div className={classes.flex}>
					<p>
						Birthday: {birthday}, age: {getAge()}
					</p>
					<div>
						<Button
							variant="contained"
							color="primary"
							onClick={handleEditOpen}
							className={classes.btn}
						>
							Edit patient
						</Button>{" "}
						<Button
							variant="contained"
							color="secondary"
							onClick={handleDeleteOpen}
							className={classes.btn}
						>
							Delete patient
						</Button>
					</div>
				</div>
				<p>Phone number: {patient.phone ? patient.phone : "Not registered"}</p>
				<p>Address: {patient.address ? patient.address : "Not registered"}</p>
				<Diagnoses />
			</div> */}
		</>
	);
}
