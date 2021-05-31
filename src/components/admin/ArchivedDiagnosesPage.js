import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
	Button,
	Menu,
	MenuItem,
	TablePagination,
	TextField,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import adminAPI from "../../api/admin.api";

const useStyles = makeStyles({
	background: {
		background: "#707690",
		position: "absolute",
		width: "100%",
		height: "100vh",
		zIndex: "-1",
		top: 0,
	},
	searchDiv: {
		display: "flex",
		justifyContent: "space-between",
		height: "70px",
		alignItems: "center",
		margin: "10px 10px 40px",
	},
	search: {
		width: "300px",
		background: "#e0e0e0",
		borderRadius: "3px",
	},
	finished: {
		height: "58px",
		marginLeft: "10px",
		width: "280px",
		color: "#e0e0e0",
	},
	searchBtn: {
		height: "58px",
		marginLeft: "10px",
		width: "130px",
	},
	clearBtn: {
		height: "58px",
		marginLeft: "10px",
		width: "160px",
	},
	title: {
		background: "#e0e0e0",
		width: "250px",
		borderRadius: "5px",
		height: "80%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default function ArchivedDiagnosesPage() {
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});
	const [count, setCount] = React.useState(0);
	const [page, setPage] = React.useState(0);
	const [isSearching, setIsSearching] = React.useState(false);

	const [open, setOpen] = React.useState(false);

	const [professionSearch, setProfessionSearch] = React.useState("");
	const [finishedSearch, setFinishedSearch] = React.useState("All");
	const [searchVal, setSearchVal] = React.useState({
		professionSearch,
		finishedSearch,
	});
	const [anchorEl, setAnchorEl] = React.useState(null);

	const classes = useStyles();

	const handleClickOpen = (index, id, isFinished) => {
		setOpen(true);
		setOpenedDiagnosis(diagnoses[index]);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleClickMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
		isSearching ? search(newPage * 10) : getDiagnoses(newPage * 10);
	};

	const onProfessionSearchChange = (e) => {
		setProfessionSearch(e.target.value);
	};

	const finished = (val) => {
		setFinishedSearch(val);
		handleCloseMenu();
	};

	// eslint-disable-next-line
	useEffect(() => getDiagnoses(0), []);

	const timeFormat = (str) => {
		const date = str.split("T")[0].split("-");
		const time = str.split("T")[1].split(":");
		return (
			date[2] + "/" + date[1] + "/" + date[0] + " " + time[0] + ":" + time[1]
		);
	};

	const splitText = (text) => {
		if (text) return text.split("\n").map((str) => <p key={1}>{str}</p>);
	};

	const getDiagnoses = (skip) => {
		adminAPI.getAllArchivedDiagnoses(skip).then((res) => {
			res.data.diagnoses.forEach((item) => {
				item.createdAt = timeFormat(item.createdAt);
				item.updatedAt = timeFormat(item.updatedAt);
				item.deletedAt = timeFormat(item.deletedAt);

				if (item.doctor === null) item.doctor = { ...item.archivedDoctor };
				if (item.patient === null) item.patient = { ...item.archivedPatient };
			});

			console.log(res.data);

			setDiagnoses(res.data.diagnoses);
			setCount(res.data.count);
		});
	};

	const search = (skip, btn = false) => {
		if (btn) {
			setPage(0);
			setSearchVal({ professionSearch, finishedSearch });
		} else {
			searchFunc(skip);
		}
	};

	const searchFunc = (skip) => {
		setIsSearching(true);

		adminAPI
			.searchAllArchivedDiagnoses(
				searchVal.professionSearch,
				searchVal.finishedSearch,
				skip
			)
			.then((res) => {
				res.data.diagnoses.forEach((item) => {
					item.createdAt = timeFormat(item.createdAt);
					item.updatedAt = timeFormat(item.updatedAt);

					if (item.doctor === null) item.doctor = { ...item.archivedDoctor };
				});

				setDiagnoses(res.data.diagnoses);
				setCount(res.data.count);
			});
	};

	const clearSearch = () => {
		getDiagnoses(0);
		setIsSearching(false);
		setPage(0);
	};

	const emptyRows = 10 - Math.min(10, count - page * 10);

	return (
		<div>
			<div className={classes.background}></div>
			<div className={classes.searchDiv}>
				<div>
					<TextField
						variant="filled"
						label="Search by doctor profession"
						className={classes.search}
						value={professionSearch}
						onChange={onProfessionSearchChange}
					/>
					<Button
						aria-controls="simple-menu"
						aria-haspopup="true"
						onClick={handleClickMenu}
						variant="outlined"
						className={classes.finished}
					>
						Show diagnoses - {finishedSearch}
					</Button>
					<Button
						startIcon={<SearchIcon />}
						variant="contained"
						color="primary"
						className={classes.searchBtn}
						onClick={() => search(0, true)}
					>
						Search
					</Button>
					<Button
						variant="contained"
						className={classes.clearBtn}
						onClick={clearSearch}
					>
						Clear search
					</Button>
					<Menu
						id="simple-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleCloseMenu}
					>
						<MenuItem onClick={() => finished("All")}>Show all</MenuItem>
						<MenuItem onClick={() => finished("Finished")}>
							Show finished
						</MenuItem>
						<MenuItem onClick={() => finished("Unfinished")}>
							Show unfinished
						</MenuItem>
					</Menu>
				</div>

				<div className={classes.title}>
					<h2>Archived Diagnoses</h2>
				</div>
			</div>

			<Paper>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Doctor Full Name</TableCell>
								<TableCell>Doctor Profession</TableCell>
								<TableCell>Doctor Email</TableCell>
								<TableCell>Patient Full Name</TableCell>
								<TableCell>Is Finished</TableCell>
								<TableCell>Deleted at</TableCell>
								<TableCell>View Diagnosis</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{diagnoses.map((diagnosis, index) => (
								<TableRow
									key={diagnosis._id}
									hover
									className={classes.hover}
									// onClick={() => openDoctor(diagnosis._id)}
								>
									<TableCell>
										{diagnosis.doctor.name} {diagnosis.doctor.surname}
									</TableCell>
									<TableCell>{diagnosis.doctor.profession}</TableCell>
									<TableCell>{diagnosis.doctor.email}</TableCell>
									<TableCell>
										{diagnosis.patient.name} {diagnosis.patient.surname}{" "}
										{diagnosis.patient.fatherName}
									</TableCell>
									<TableCell>{diagnosis.isFinished ? "Yes" : "No"}</TableCell>
									<TableCell>{diagnosis.deletedAt}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											onClick={() => handleClickOpen(index)}
										>
											View diagnosis
										</Button>
									</TableCell>
								</TableRow>
							))}

							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					component="div"
					rowsPerPageOptions={[10]}
					onChangePage={handleChangePage}
					count={count}
					page={page}
					rowsPerPage={10}
				/>
			</Paper>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="alert-dialog-title">Diagnosis</DialogTitle>
				<DialogContent>
					<DialogContentText>Complains</DialogContentText>
					<div>{splitText(openedDiagnosis.complains)}</div> <hr />
					<DialogContentText>Anamnesis</DialogContentText>
					<div>{splitText(openedDiagnosis.anamnesis)}</div> <hr />
					<DialogContentText>Objective status</DialogContentText>
					<div>{splitText(openedDiagnosis.objectiveStatus)}</div> <hr />
					<DialogContentText>Diagnosis</DialogContentText>
					<div>{splitText(openedDiagnosis.diagnosis)}</div> <hr />
					<DialogContentText>Research plan</DialogContentText>
					<div>{splitText(openedDiagnosis.researchPlan)}</div> <hr />
					<DialogContentText>Cures</DialogContentText>
					<ul>
						{openedDiagnosis.cures &&
							openedDiagnosis.cures.map((cure, index) => (
								<li key={index}>{splitText(cure)}</li>
							))}
					</ul>{" "}
					<hr />
					{openedDiagnosis.isFinished && (
						<>
							<DialogContentText>Final Diagnosis</DialogContentText>
							<div>{splitText(openedDiagnosis.finalDiagnosis)}</div>
						</>
					)}
					<DialogContentText>Created at</DialogContentText>
					<div>{openedDiagnosis.createdAt}</div> <hr />
					<DialogContentText>Updated at</DialogContentText>
					<div>{openedDiagnosis.updatedAt}</div> <hr />
					<DialogContentText>Deleted at</DialogContentText>
					<div>{openedDiagnosis.deletedAt}</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
