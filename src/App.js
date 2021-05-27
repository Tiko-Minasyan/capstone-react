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
import EditImagePage from "./components/EditImagePage";
import EditPasswordPage from "./components/EditPasswordPage";
import PatientsPage from "./components/PatientsPage";
import PatientProfile from "./components/PatientProfile";

import AdminLoginPage from "./components/admin/AdminLoginPage";
import AdminRegisterPage from "./components/admin/AdminRegisterPage";
import AdminRegisterAdminPage from "./components/admin/AdminRegisterAdminPage";
import AdminEditPage from "./components/admin/AdminEditPage";
import AdminDoctorsPage from "./components/admin/AdminDoctorsPage";
import AdminDoctorProfile from "./components/admin/AdminDoctorProfile";
import AdminHeader from "./components/admin/AdminHeader";

import ArchivedDoctorsPage from "./components/admin/ArchivedDoctorsPage";
import ArchivedDoctorProfile from "./components/admin/ArchivedDoctorProfile";
import ArchivedPatientsPage from "./components/admin/ArchivedPatientsPage";
import ArchivedPatientProfile from "./components/admin/ArchivedPatientProfile";
import ArchivedDiagnosesPage from "./components/admin/ArchivedDiagnosesPage";

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
				<Route path="/edit/image">
					<Header />
					<EditImagePage />
				</Route>
				<Route path="/edit/password">
					<Header />
					<EditPasswordPage />
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
				<Route path="/admin/register">
					<AdminHeader />
					<AdminRegisterPage />
				</Route>
				<Route path="/admin/registerAdmin">
					<AdminHeader />
					<AdminRegisterAdminPage />
				</Route>
				<Route path="/admin/edit">
					<AdminHeader />
					<AdminEditPage />
				</Route>
				<Route path="/admin/viewDoctors" exact>
					<AdminHeader />
					<AdminDoctorsPage />
				</Route>
				<Route path="/admin/viewDoctors/:id">
					<AdminHeader />
					<AdminDoctorProfile />
				</Route>

				<Route path="/admin/archive/doctors" exact>
					<AdminHeader />
					<ArchivedDoctorsPage />
				</Route>
				<Route path="/admin/archive/doctors/:id">
					<AdminHeader />
					<ArchivedDoctorProfile />
				</Route>
				<Route path="/admin/archive/patients" exact>
					<AdminHeader />
					<ArchivedPatientsPage />
				</Route>
				<Route path="/admin/archive/patients/:id">
					<AdminHeader />
					<ArchivedPatientProfile />
				</Route>
				<Route path="/admin/archive/diagnoses">
					<AdminHeader />
					<ArchivedDiagnosesPage />
				</Route>

				<Route path="/">
					<Redirect to="/" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
