import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useHistory } from "react-router";
import adminAPI from "../../api/admin.api";
import { ListItemText } from "@material-ui/core";

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
	drawer: {
		width: "250px",
		background: "#3f51b5",
		color: "#e0e0e0",
		height: "100%",
	},
}));

export default function Header() {
	const [admin, setAdmin] = React.useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [drawerOpen, setDrawerOpen] = React.useState(false);

	const open = Boolean(anchorEl);

	const classes = useStyles();
	const history = useHistory();

	useEffect(() => {
		adminAPI.getProfile().then((res) => {
			if (typeof res !== "number") setAdmin(res.data);
		});
	}, []);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const toggleDrawer = (open) => (event) => {
		setDrawerOpen(open);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const allDoctors = () => {
		history.push("/admin/viewDoctors");
	};

	const newDoctor = () => {
		history.push("/admin/register");
	};

	const newAdmin = () => {
		history.push("/admin/registerAdmin");
	};

	const archivedDoctors = () => {
		history.push("/admin/archive/doctors");
	};

	const archivedPatients = () => {
		history.push("/admin/archive/patients");
	};

	const archivedDiagnoses = () => {
		history.push("/admin/archive/diagnoses");
	};

	const edit = () => {
		handleClose();
		history.push("/admin/edit");
	};

	const logout = () => {
		localStorage.removeItem("token");
		history.push("/");
	};

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						aria-haspopup="true"
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
						onClick={toggleDrawer(true)}
					>
						<MenuIcon />
					</IconButton>

					<Drawer
						anchor="left"
						open={drawerOpen}
						onClose={toggleDrawer(false)}
						onClick={toggleDrawer(false)}
					>
						<div className={classes.drawer}>
							<List>
								<ListItem button onClick={allDoctors}>
									<ListItemText primary="See All Doctors" />
								</ListItem>
								<ListItem button onClick={newDoctor}>
									<ListItemText primary="Add a New Doctors" />
								</ListItem>
								<ListItem button onClick={newAdmin}>
									<ListItemText primary="Add a New Admin" />
								</ListItem>
							</List>
							<Divider />
							<List>
								<ListItem button onClick={archivedDoctors}>
									<ListItemText primary="View Archived Doctors" />
								</ListItem>
								<ListItem button onClick={archivedPatients}>
									<ListItemText primary="View Archived Patients" />
								</ListItem>
								<ListItem button onClick={archivedDiagnoses}>
									<ListItemText primary="View Archived Diagnoses" />
								</ListItem>
							</List>
						</div>
					</Drawer>

					<Typography variant="h6" className={classes.title}>
						<span className={classes.pointer} onClick={allDoctors}>
							Medical Center Application
						</span>
					</Typography>
					<div>
						<span className={classes.name}>
							{admin.name} {admin.surname}, {admin.position}
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
							<MenuItem onClick={edit}>Edit account</MenuItem>
							<MenuItem onClick={logout}>Logout</MenuItem>
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	);
}
