import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useHistory } from "react-router";
import adminAPI from "../../api/admin.api";

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
	const [admin, setAdmin] = React.useState({});
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [anchorElLinks, setAnchorElLinks] = React.useState(null);

	const open = Boolean(anchorEl);
	const openLinks = Boolean(anchorElLinks);

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

	const handleMenuLinks = (event) => {
		setAnchorElLinks(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCloseLinks = () => {
		setAnchorElLinks(null);
	};

	const allDoctors = () => {
		handleCloseLinks();
		history.push("/admin/viewDoctors");
	};

	const newDoctor = () => {
		handleCloseLinks();
		history.push("/admin/register");
	};

	const newAdmin = () => {
		handleCloseLinks();
		history.push("/admin/registerAdmin");
	};

	const profile = () => {
		handleClose();
		history.push("/admin/profile");
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
						onClick={handleMenuLinks}
					>
						<MenuIcon />
					</IconButton>
					<Menu
						id="menu-appbar-links"
						anchorEl={anchorElLinks}
						anchorOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						keepMounted
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						open={openLinks}
						onClose={handleCloseLinks}
					>
						<MenuItem onClick={allDoctors}>See All Doctors</MenuItem>
						<MenuItem onClick={newDoctor}>Add a New Doctor</MenuItem>
						<MenuItem onClick={newAdmin}>Add a New Admin</MenuItem>
					</Menu>
					<Typography variant="h6" className={classes.title}>
						<span className={classes.pointer} onClick={profile}>
							Medical Center Application
							{/* {admin.name} {admin.surname} */}
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
