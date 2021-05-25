import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import adminAPI from "../../api/admin.api";

export default function ProfilePage() {
	const [name, setName] = React.useState("");
	const [surname, setSurname] = React.useState("");

	const history = useHistory();

	useEffect(() => {
		adminAPI.getProfile().then((res) => {
			if (res === 403) return history.push("/");

			setName(res.data.name);
			setSurname(res.data.surname);
		});
	}, [history]);

	return (
		<>
			<div>
				<h1>
					Welcome, admin: {name} {surname}
				</h1>
			</div>
		</>
	);
}
