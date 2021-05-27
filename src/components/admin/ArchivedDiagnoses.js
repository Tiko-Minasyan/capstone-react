import React, { useEffect } from "react";
import { useParams } from "react-router";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import adminAPI from "../../api/admin.api";
import { makeStyles, Menu, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import { TablePagination } from "@material-ui/core";

const useStyles = makeStyles({
	diagnoses: {
		marginTop: 50,
		borderTop: "2px solid gray",
	},
	table: {
		minWidth: 650,
	},
	diagnosis: {
		width: "1000px",
	},
	flex: {
		display: "flex",
		justifyContent: "space-between",
		height: "50px",
		alignItems: "center",
		paddingRight: "30px",
	},
	ownDiagnosis: {
		background: "lightgray",
	},
	error: {
		color: "#f44336",
	},
	editField: {
		marginBottom: "25px",
	},
	search: {
		width: "300px",
	},
	finished: {
		height: "58px",
		marginLeft: "10px",
		width: "280px",
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
});

export default function Diagnoses() {
	const [diagnoses, setDiagnoses] = React.useState([]);
	const [openedDiagnosis, setOpenedDiagnosis] = React.useState({});
	const [page, setPage] = React.useState(0);
	const [count, setCount] = React.useState(0);
	const [isSearching, setIsSearching] = React.useState(false);

	const [professionSearch, setProfessionSearch] = React.useState("");
	const [finishedSearch, setFinishedSearch] = React.useState("All");
	const [searchVal, setSearchVal] = React.useState({
		professionSearch,
		finishedSearch,
	});
	const [anchorEl, setAnchorEl] = React.useState(null);

	const [open, setOpen] = React.useState(false);
	const [openDiagnosis, setOpenDiagnosis] = React.useState(false);

	const { id } = useParams();
	const classes = useStyles();

	const handleDiagnosisOpen = () => {
		setOpenDiagnosis(true);
	};

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

	useEffect(() => {
		getDiagnoses(0); // eslint-disable-next-line
	}, []);

	const timeFormat = (str) => {
		const date = str.split("T")[0].split("-");
		const time = str.split("T")[1].split(":");
		return (
			date[2] + "/" + date[1] + "/" + date[0] + " " + time[0] + ":" + time[1]
		);
	};

	const getDiagnoses = (skip) => {
		// adminAPI.getDiagnoses(id, skip).then((res) => {
		// 	if (res) {
		// 		res.data.diagnoses.forEach((item) => {
		// 			item.createdAt = timeFormat(item.createdAt);
		// 			item.updatedAt = timeFormat(item.updatedAt);
		// 			if (item.doctor === null) item.doctor = { ...item.archivedDoctor };
		// 		});
		// 		setDiagnoses(res.data.diagnoses);
		// 		setCount(res.data.count);
		// 		setDoctorId(res.data.doctorId);
		// 	}
		// });
	};

	const splitText = (text) => {
		if (text) return text.split("\n").map((str) => <p key={1}>{str}</p>);
	};

	const search = (skip, btn = false) => {
		if (btn) {
			setPage(0);
			setSearchVal({ professionSearch, finishedSearch });
		} else {
			searchFunc(skip);
		}
	};

	// eslint-disable-next-line
	useEffect(() => searchFunc(0), [searchVal]);

	const searchFunc = (skip) => {
		setIsSearching(true);

		// adminAPI
		// 	.search(id, searchVal.professionSearch, searchVal.finishedSearch, skip)
		// 	.then((res) => {
		// 		res.data.diagnoses.forEach((item) => {
		// 			item.createdAt = timeFormat(item.createdAt);
		// 			item.updatedAt = timeFormat(item.updatedAt);

		// 			if (item.doctor === null) item.doctor = { ...item.archivedDoctor };
		// 		});

		// 		setDiagnoses(res.data.diagnoses);
		// 		setCount(res.data.count);
		// 	});
	};

	const clearSearch = () => {
		getDiagnoses(0);
		setIsSearching(false);
		setPage(0);
	};

	const emptyRows = 10 - Math.min(10, count - page * 10);

	return (
		<div className={classes.diagnoses}>
			<div className={classes.flex}>
				<h2>Diagnoses of this patient</h2>

				<Button variant="contained" onClick={handleDiagnosisOpen}>
					Write diagnosis
				</Button>
			</div>

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

			{/* DIAGNOSES TABLE */}
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Doctor profession</TableCell>
							<TableCell>Diagnosis</TableCell>
							<TableCell>Doctor full name</TableCell>
							<TableCell>Is finished</TableCell>
							<TableCell>Create date</TableCell>
							<TableCell>Update date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{diagnoses.map((diagnosis, index) => (
							<TableRow key={diagnosis._id}>
								<TableCell scope="row">{diagnosis.doctor.profession}</TableCell>
								<TableCell>
									<Button
										variant="outlined"
										onClick={() =>
											handleClickOpen(
												index,
												diagnosis.doctor._id,
												diagnosis.isFinished
											)
										}
									>
										View diagnosis
									</Button>
								</TableCell>
								<TableCell>
									{diagnosis.doctor.name} {diagnosis.doctor.surname}
								</TableCell>
								<TableCell>{diagnosis.isFinished ? "Yes" : "No"}</TableCell>
								<TableCell>{diagnosis.createdAt}</TableCell>
								<TableCell>{diagnosis.updatedAt}</TableCell>
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

			{/* OPEN DIAGNOSIS DIALOG */}
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
					</ul>
					{openedDiagnosis.isFinished && (
						<>
							<hr />
							<DialogContentText>Final Diagnosis</DialogContentText>
							<p>{splitText(openedDiagnosis.finalDiagnosis)}</p>
						</>
					)}
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
