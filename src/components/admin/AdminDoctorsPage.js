import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import adminApi from "../../api/admin.api";
import { useHistory } from "react-router";
import { Button, TablePagination, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles({
	background: {
		background: "#707690",
		position: "absolute",
		width: "100%",
		height: "100vh",
		zIndex: "-1",
		top: 0,
	},
	table: {
		minWidth: 650,
	},
	header: {
		fontWeight: "bold",
		fontSize: "15px",
	},
	button: {
		width: "16%",
	},
	row: {
		cursor: "pointer",
		"&:nth-of-type(odd)": {
			background: "lightgray",
		},
		"&:hover": {
			background: "gray !important",
		},
	},
	flex: {
		display: "flex",
		height: "70px",
		alignItems: "center",
		justifyContent: "space-between",
		margin: "10px 20px",
		marginLeft: "5px",
	},
	flexDiv: {
		display: "flex",
		height: "70px",
		alignItems: "center",
	},
	flexEnd: {
		display: "flex",
		justifyContent: "flex-end",
		padding: "10px 10px",
	},
	title: {
		background: "#e0e0e0",
		width: "200px",
		borderRadius: "5px",
		height: "80%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	search: {
		margin: "5px",
		marginRight: 0,
		width: "400px",
		background: "#e0e0e0",
		borderRadius: "3px",
	},
	searchBtn: {
		width: "150px",
		height: "78%",
		marginLeft: "20px",
	},
});

export default function BasicTable() {
	const [doctors, setDoctors] = React.useState([]);
	const [nameSearch, setNameSearch] = React.useState("");
	const [professionSearch, setProfessionSearch] = React.useState("");
	const [page, setPage] = React.useState(0);
	const [count, setCount] = React.useState(0);
	const [isSearching, setIsSearching] = React.useState(false);

	const classes = useStyles();
	const history = useHistory();

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
		isSearching ? search(newPage * 10) : getDoctors(newPage * 10);
	};

	const onNameSearchChange = (e) => {
		setNameSearch(e.target.value);
	};

	const onProfessionSearchChange = (e) => {
		setProfessionSearch(e.target.value);
	};

	useEffect(() => {
		getDoctors(0);
	}, []);

	const getDoctors = (skip) => {
		adminApi.getDoctors(skip).then((res) => {
			setDoctors(res.data.doctors);
			setCount(res.data.count);
		});
	};

	const openDoctor = (id) => {
		history.push("/admin/viewDoctors/" + id);
	};

	const search = (skip) => {
		if (!nameSearch && !professionSearch) {
			setIsSearching(false);
			return getDoctors();
		}

		setIsSearching(true);

		adminApi.searchDoctors(nameSearch, professionSearch, skip).then((res) => {
			setDoctors(res.data.doctors);
			setCount(res.data.count);
		});
	};

	const clearSearch = () => {
		setIsSearching(false);
		setNameSearch("");
		setProfessionSearch("");
		setPage(0);

		getDoctors(0);
	};

	const newDoctor = () => {
		history.push("/admin/register");
	};

	const emptyRows = 10 - Math.min(10, count - page * 10);

	return (
		<div>
			<div className={classes.background}></div>
			<div className={classes.flex}>
				<div className={classes.flexDiv}>
					<TextField
						className={classes.search}
						variant="filled"
						label="Search by name, surname"
						value={nameSearch}
						onChange={onNameSearchChange}
					/>
					<TextField
						className={classes.search}
						variant="filled"
						label="Search by profession"
						value={professionSearch}
						onChange={onProfessionSearchChange}
					/>
					<Button
						variant="contained"
						className={classes.searchBtn}
						startIcon={<SearchIcon />}
						onClick={() => search(0)}
					>
						Search
					</Button>
					<Button
						variant="contained"
						className={classes.searchBtn}
						onClick={clearSearch}
					>
						Clear search
					</Button>
				</div>

				<div className={classes.title}>
					<h2>Doctors Page</h2>
				</div>
			</div>
			<div className={classes.flexEnd}>
				<Button
					startIcon={<AddCircleIcon />}
					onClick={newDoctor}
					variant="contained"
				>
					Register a new doctor
				</Button>
			</div>
			<Paper>
				<TableContainer component={Paper}>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell className={classes.header}>
									Doctor Full Name
								</TableCell>
								<TableCell className={classes.header}>Doctor Email</TableCell>
								<TableCell className={classes.header}>
									Doctor profession
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{doctors.map((doctor) => (
								<TableRow
									key={doctor._id}
									hover
									onClick={() => openDoctor(doctor._id)}
									className={classes.row}
								>
									<TableCell component="th" scope="row">
										{doctor.name} {doctor.surname}
									</TableCell>
									<TableCell>{doctor.email}</TableCell>
									<TableCell>{doctor.profession}</TableCell>
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
		</div>
	);
}
