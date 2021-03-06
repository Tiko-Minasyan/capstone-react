import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useHistory } from "react-router";
import doctorAPI from "../api/doctor.api";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	pointer: {
		cursor: "pointer",
	},
	name: {
		marginRight: "10px",
	},
}));

export default function Header() {
	const [doctor, setDoctor] = React.useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);

	const open = Boolean(anchorEl);

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		doctorAPI.getProfile().then((res) => {
			if (typeof res !== "number") setDoctor(res.data);
		});
	}, []);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const profile = () => {
		handleClose();
		history.push("/profile");
	};

	const edit = () => {
		handleClose();
		history.push("/edit");
	};

	const logout = () => {
		localStorage.removeItem("token");
		history.push("/");
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						<span className={classes.pointer} onClick={profile}>
							Medical Center Application
						</span>
					</Typography>
					<div>
						<span>
							{doctor.name} {doctor.surname}, {doctor.profession}
						</span>
						<IconButton
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMenu}
							color="inherit"
						>
							<AccountCircle />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "right",
							}}
							open={open}
							onClose={handleClose}
						>
							<MenuItem onClick={profile}>Profile</MenuItem>
							<MenuItem onClick={edit}>Edit account</MenuItem>
							<MenuItem onClick={logout}>Logout</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}
