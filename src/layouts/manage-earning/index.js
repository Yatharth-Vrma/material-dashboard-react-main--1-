import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  Card,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { db } from "../manage-employee/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

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
>>>>>>> b288dd59794f9c9ed4dd313a55e85c31eb257efe
  const [earnings, setEarnings] = useState([]);
  const [selectedEarning, setSelectedEarning] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const completedEarnings = snapshot.docs
        .filter((doc) => doc.data().status?.toLowerCase() === "completed")
        .map((doc) => {
          const data = doc.data();
          return {
            earningId: `E-${Math.floor(10000 + Math.random() * 90000)}`,
            clientId: data.clientId || "N/A",
            accountId: data.accountId || "N/A",
            amount: data.revenueGenerated || 0,
            date: data.endDate || "N/A"
              ? data.endDate instanceof Timestamp
                ? data.endDate.toDate().toLocaleDateString()
                : new Date(data.endDate).toLocaleDateString()
              : "N/A",
            projectId: data.projectId || "N/A",
          };
        });
      setEarnings(completedEarnings);
    });
    
    return () => unsubscribe();
  }, []);

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
  const tableData = {
    columns: [
      { Header: "Earning ID", accessor: "earningId", align: "left" },
      { Header: "Client ID", accessor: "clientId", align: "left" },
      { Header: "Amount", accessor: "amount", align: "left" },
      { Header: "Date", accessor: "date", align: "left" },
      { Header: "Project ID", accessor: "projectId", align: "left" },
      { Header: "Account ID", accessor: "accountId", align: "left" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: earnings.map((earning) => ({
      earningId: earning.earningId,
      clientId: earning.clientId,
      amount: `$${earning.amount}`, // Display amount in currency format
      date: earning.date,
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
    <MDBox p={3} sx={{ marginLeft: "250px", marginTop: "30px", width: "calc(100% - 250px)" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ marginTop: "20px", borderRadius: "12px", overflow: "visible" }}>
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
              <MDTypography variant="h6" color="white">Earnings</MDTypography>
            </MDBox>
            <MDBox pt={3} pb={2} px={2}>
<<<<<<< HEAD
              {/* You might consider using MDButton here if "gradient" is a custom variant */}
              <Button variant="gradient" color="info" onClick={handleClickOpen} sx={{ mb: 2 }}>
                Add Earnings
              </Button>
=======
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
    </MDBox>
  );
};

export default ManageEarning;
