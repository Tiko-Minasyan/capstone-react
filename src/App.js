import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import axiosSetup from "./axios.setup";
import LoginPage from "./components/LoginPage";

function App() {
	axiosSetup();

	return (
		<Router>
			<Switch>
				<Route path="/" exact={true}>
					<LoginPage />
				</Route>
				<Route path="/">
					<Redirect to="/" />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
