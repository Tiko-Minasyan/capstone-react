import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import { setAuthToken } from "./axios";

import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import EditPage from "./components/EditPage";
import PatientsPage from "./components/PatientsPage";
import PatientProfile from "./components/PatientProfile";

import AdminLoginPage from "./components/admin/AdminLoginPage";
import AdminPage from "./components/admin/AdminPage";
import AdminRegisterPage from "./components/admin/AdminRegisterPage";
import AdminDoctorsPage from "./components/admin/AdminDoctorsPage";
import AdminDoctorProfile from "./components/admin/AdminDoctorProfile";
import AdminHeader from "./components/admin/AdminHeader";

function App() {
	setAuthToken();

	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<LoginPage />
				</Route>
				<Route path="/profile" exact>
					<Header />
					<ProfilePage />
				</Route>
				<Route path="/edit" exact>
					<Header />
					<EditPage />
				</Route>
				<Route path="/patients" exact>
					<Header />
					<PatientsPage />
				</Route>
				<Route path="/patients/:id">
					<Header />
					<PatientProfile />
				</Route>

				<Route path="/admin/" exact>
					<AdminLoginPage />
				</Route>
				<Route path="/admin/profile" exact>
					<AdminHeader />
					<AdminPage />
				</Route>
				<Route path="/admin/register">
					<AdminHeader />
					<AdminRegisterPage />
				</Route>
				<Route path="/admin/viewDoctors" exact>
					<AdminHeader />
					<AdminDoctorsPage />
				</Route>
				<Route path="/admin/viewDoctors/:id">
					<AdminHeader />
					<AdminDoctorProfile />
				</Route>

				<Route path="/">
					<Redirect to="/" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
