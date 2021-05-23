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

import AdminLoginPage from "./components/admin/AdminLoginPage";
import AdminPage from "./components/admin/AdminPage";
import AdminRegisterPage from "./components/admin/AdminRegisterPage";
import AdminDoctorsPage from "./components/admin/AdminDoctorsPage";
import AdminHeader from "./components/admin/AdminHeader";
import PatientProfile from "./components/PatientProfile";

function App() {
	setAuthToken();

	return (
		<Router>
			<Switch>
				<Route path="/" exact={true}>
					<LoginPage />
				</Route>
				<Route path="/profile" exact={true}>
					<Header />
					<ProfilePage />
				</Route>
				<Route path="/edit" exact={true}>
					<Header />
					<EditPage />
				</Route>
				<Route path="/patients" exact={true}>
					<Header />
					<PatientsPage />
				</Route>
				<Route path="/patients/:id">
					<Header />
					<PatientProfile />
				</Route>

				<Route path="/admin/" exact={true}>
					<AdminLoginPage />
				</Route>
				<Route path="/admin/profile" exact={true}>
					<AdminHeader />
					<AdminPage />
				</Route>
				<Route path="/admin/register">
					<AdminHeader />
					<AdminRegisterPage />
				</Route>
				<Route path="/admin/viewDoctors">
					<AdminHeader />
					<AdminDoctorsPage />
				</Route>

				<Route path="/">
					<Redirect to="/" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
