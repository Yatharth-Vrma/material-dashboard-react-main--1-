import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { db } from "../manage-employee/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";

<<<<<<< HEAD
// Expense (now Earning) categories – you can adjust or rename as needed
const categories = ["Rent", "Software Licenses", "Utilities", "Salaries", "Marketing", "Other"];

// ─── Define CustomButton BEFORE using it in tableData ─────────────────────
const CustomButton = styled("button")({
  padding: "10px 25px",
  border: "unset",
  borderRadius: "15px",
  color: "#212121",
  zIndex: 1,
  background: "#e8e8e8",
  position: "relative",
  fontWeight: 1000,
  fontSize: "17px",
  boxShadow: "4px 8px 19px -3px rgba(0,0,0,0.27)",
  transition: "all 250ms",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: 0,
    borderRadius: "15px",
    backgroundColor: "#212121",
    zIndex: -1,
    boxShadow: "4px 8px 19px -3px rgba(0,0,0,0.27)",
    transition: "all 250ms",
  },
  "&:hover": {
    color: "#e8e8e8",
  },
  "&:hover::before": {
    width: "100%",
  },
});

const ManageEarnings = () => {
  // Dialog and data states
  const [open, setOpen] = useState(false); // For Add/Edit form
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
=======
const ManageEarning = () => {
<<<<<<< HEAD
>>>>>>> b288dd59794f9c9ed4dd313a55e85c31eb257efe
=======
  const [open, setOpen] = useState(false);
>>>>>>> parent of b288dd5 (manage earning done)
  const [earnings, setEarnings] = useState([]);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      const querySnapshot = await getDocs(collection(db, "earnings"));
      setEarnings(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjects(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clients"));
      setClients(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchAccounts = async () => {
      const querySnapshot = await getDocs(collection(db, "accounts"));
      setAccounts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchEarnings();
    fetchProjects();
    fetchClients();
    fetchAccounts();
  }, []);

<<<<<<< HEAD
<<<<<<< HEAD
  // Open Add/Edit dialog and reset form fields
  const handleClickOpen = () => {
    setOpen(true);
    resetForm();
  };

  // Close dialog and reset form
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Populate form fields for editing an earning
  const handleEdit = (earning) => {
    setEditingEarning(earning);
    setEarningId(earning.earningId);
    setCategory(earning.category);
    setAmount(earning.amount);
    // Convert Firestore Timestamp to ISO date (YYYY-MM-DD) for date input
    setDate(
      earning.date && typeof earning.date.toDate === "function"
        ? earning.date.toDate().toISOString().split("T")[0]
        : earning.date || ""
    );
    setDescription(earning.description);
    setProjectId(earning.projectId || "");
    setAccountId(earning.accountId || "");
    setRecurring(earning.recurring || false);
    setOpen(true);
  };

  // Open confirmation dialog for update/add
  const handleSubmit = async () => {
    setConfirmUpdateOpen(true);
  };

  // Confirm update or add earning in Firestore
  const confirmUpdate = async () => {
    const newEarning = {
      earningId,
      category,
      amount: Number(amount),
      date: new Date(date),
      description,
      projectId: projectId || null,
      accountId: accountId || null,
      recurring,
    };

    if (editingEarning) {
      await updateDoc(doc(db, "earnings", editingEarning.id), newEarning);
      setEarnings(
        earnings.map((earn) => (earn.id === editingEarning.id ? { ...earn, ...newEarning } : earn))
      );
    } else {
      const docRef = await addDoc(collection(db, "earnings"), newEarning);
      setEarnings([...earnings, { id: docRef.id, ...newEarning }]);
    }

    setConfirmUpdateOpen(false);
    handleClose();
  };

  // Handle deletion of an earning
  const handleDelete = async () => {
    await deleteDoc(doc(db, "earnings", deleteId));
    setEarnings(earnings.filter((earn) => earn.id !== deleteId));
    setConfirmDeleteOpen(false);
  };

  // Reset all form fields
  const resetForm = () => {
    setEarningId("");
    setCategory("");
    setAmount("");
    setDate("");
    setDescription("");
    setProjectId("");
    setAccountId("");
    setRecurring(false);
    setEditingEarning(null);
  };

  // Custom textField styling (same as in ManageClients)
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#f9fafb",
      "&:hover fieldset": { borderColor: "#c0c4c9" },
      "&.Mui-focused fieldset": {
        borderColor: "#3b4ce2",
        boxShadow: "0 0 0 2px rgba(59, 76, 226, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.875rem",
      color: "#374151",
      transform: "translate(14px, 16px) scale(1)",
      "&.Mui-focused": { color: "#3b4ce2" },
    },
    "& .MuiInputBase-input": {
      fontSize: "0.875rem",
      padding: "12px 14px",
      color: "#1f2937",
    },
  };

  // Define tableData for DataTable component (if needed)
=======
>>>>>>> b288dd59794f9c9ed4dd313a55e85c31eb257efe
=======
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "earnings", selectedEarning.id));
    setEarnings(earnings.filter((earning) => earning.id !== selectedEarning.id));
    setConfirmDeleteOpen(false);
  };

>>>>>>> parent of b288dd5 (manage earning done)
  const tableData = {
    columns: [
      { Header: "Earning ID", accessor: "earningId", align: "left" },
      { Header: "Client Name", accessor: "clientName", align: "left" },
      { Header: "Amount", accessor: "amount", align: "left" },
      { Header: "Date", accessor: "date", align: "left" },
      { Header: "Project ID", accessor: "projectId", align: "left" },
      { Header: "Account ID", accessor: "accountId", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: earnings.map((earning) => ({
      earningId: earning.earningId,
      clientName: clients.find((client) => client.id === earning.clientId)?.name || "Unknown",
      amount: `$${earning.amount}`,
      date: earning.date?.toDate().toLocaleDateString() || "N/A",
      projectId: earning.projectId,
      accountId: earning.accountId,
      action: (
        <MDBox display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              setSelectedEarning(earning);
              setViewDetailsOpen(true);
            }}
          >
            View Details
          </Button>
        </MDBox>
      ),
    })),
  };

  return (
    <MDBox
      p={3}
      sx={{
        marginLeft: "250px",
        marginTop: "30px",
        width: "calc(100% - 250px)",
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              marginTop: "20px",
              borderRadius: "12px",
              overflow: "visible",
            }}
          >
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" color="white">
                Earnings
              </MDTypography>
            </MDBox>
            <MDBox pt={3} pb={2} px={2}>
<<<<<<< HEAD
<<<<<<< HEAD
              {/* You might consider using MDButton here if "gradient" is a custom variant */}
              <Button variant="gradient" color="info" onClick={handleClickOpen} sx={{ mb: 2 }}>
                Add Earnings
              </Button>
=======
=======
              <Button variant="gradient" color="info" onClick={handleClickOpen} sx={{ mb: 2 }}>
                Add Earnings
              </Button>
>>>>>>> parent of b288dd5 (manage earning done)
              <DataTable
                table={tableData}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
>>>>>>> b288dd59794f9c9ed4dd313a55e85c31eb257efe
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      {/* View Details Dialog */}
      <Dialog
        open={viewDetailsOpen}
        onClose={() => setViewDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Earning Details</DialogTitle>
        <DialogContent>
          {selectedEarning && (
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                {clients.find((client) => client.id === selectedEarning.clientId)?.name ||
                  "Unknown Client"}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <MDTypography variant="body2" color="textSecondary">
                    <strong>Earning ID:</strong> {selectedEarning.earningId}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    <strong>Amount:</strong> ${selectedEarning.amount}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    <strong>Date:</strong>{" "}
                    {selectedEarning.date?.toDate().toLocaleDateString() || "N/A"}
                  </MDTypography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MDTypography variant="body2" color="textSecondary">
                    <strong>Project ID:</strong> {selectedEarning.projectId || "N/A"}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    <strong>Account ID:</strong> {selectedEarning.accountId || "N/A"}
                  </MDTypography>
                  <MDTypography variant="body2" color="textSecondary">
                    <strong>Client Status:</strong>{" "}
                    <Chip
                      label={
                        clients.find((client) => client.id === selectedEarning.clientId)?.status ||
                        "Unknown"
                      }
                      sx={{
                        backgroundColor:
                          clients.find((client) => client.id === selectedEarning.clientId)
                            ?.status === "Active"
                            ? "#4CAF50"
                            : "#F44336",
                        color: "#fff",
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                      }}
                    />
                  </MDTypography>
                </Grid>
              </Grid>
            </CardContent>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDetailsOpen(false)}>Close</Button>
          <Button
            onClick={() => {
              setConfirmDeleteOpen(true);
              setViewDetailsOpen(false);
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this earning?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Earnings Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Earnings</DialogTitle>
        <DialogContent>{/* Add form fields here */}</DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="primary">{/* Add submit handler */}Add</Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
};

export default ManageEarning;
