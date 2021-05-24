import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import doctorAPI from "../api/doctor.api.js";

export default function ProfilePage() {
	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");

	const history = useHistory();

	useEffect(() => {
		doctorAPI.getProfile().then((res) => {
			console.log(res);
			if (res === 403) return history.push("/");
			if (res === 404) return history.push("/");
			if (res === 409) return history.push("/admin/profile");

			setName(res.data.name);
			setSurname(res.data.surname);
		});
	}, [history]);

	return (
		<>
			<div>
				<h1>
					Welcome back, {name} {surname}!
				</h1>
				<Link to="/patients">Patients Page</Link>
				<br />
				<Link to="/edit">Edit account</Link>
			</div>
		</>
	);
}
