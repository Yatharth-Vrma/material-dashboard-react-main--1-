import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { db } from "../manage-employee/firebase";
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";

// Helper function to format Firestore Timestamps (if applicable)
const formatTimestamp = (timestamp) => {
  if (timestamp && typeof timestamp.toDate === "function") {
    return timestamp.toDate().toLocaleDateString();
  }
  return timestamp;
};

// Available statuses for accounts
const statuses = ["Active", "Closed"];
// Example industries (adjust as needed)
const industries = ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing"];

const ManageAccount = () => {
  const [open, setOpen] = useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [contractStartDate, setContractStartDate] = useState("");
  const [contractEndDate, setContractEndDate] = useState("");
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [profitMargin, setProfitMargin] = useState("");
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch projects and clients from Firebase
  const [projectList, setProjectList] = useState([]);
  const [clientList, setClientList] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const querySnapshot = await getDocs(collection(db, "accounts"));
      setAccounts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAccounts();

    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjectList(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();

    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clients"));
      setClientList(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchClients();
  }, []);

  // Open Add/Edit dialog and reset form fields
  const handleClickOpen = () => {
    setOpen(true);
    resetForm();
  };

  // Close dialog and reset form fields
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // When editing an account, populate the form fields
  const handleEdit = (account) => {
    setEditingAccount(account);
    setName(account.name || "");
    setContractStartDate(
      account.contractStartDate && typeof account.contractStartDate.toDate === "function"
        ? account.contractStartDate.toDate().toISOString().substring(0, 10)
        : account.contractStartDate || ""
    );
    setContractEndDate(
      account.contractEndDate && typeof account.contractEndDate.toDate === "function"
        ? account.contractEndDate.toDate().toISOString().substring(0, 10)
        : account.contractEndDate || ""
    );
    setIndustry(account.industry || "");
    setRevenue(account.revenue || "");
    setExpenses(account.expenses || "");
    setProfitMargin(account.profitMargin || "");
    setEmail(account.email || ""); // corrected from client.email to account.email
    setPhone(account.phone || ""); // corrected from client.phone to account.phone
    setProjects(account.projects || []);
    setClients(account.clients || []);
    setStatus(account.status || "");
    setNotes(account.notes || "");
    setOpen(true);
  };

  const handleSubmit = async () => {
    setConfirmUpdateOpen(true);
  };

  // When update is confirmed, generate accountId and contractId if new, then update/add account.
  const confirmUpdate = async () => {
    const accountId = editingAccount
      ? editingAccount.accountId
      : `ACC-${Math.floor(1000 + Math.random() * 9000)}`;
    const contractId = editingAccount
      ? editingAccount.contractId
      : `CON-${Math.floor(1000 + Math.random() * 9000)}`;

    const calculatedProfitMargin =
      revenue && expenses ? ((Number(revenue) - Number(expenses)) / Number(revenue)) * 100 : 0;

    const newAccount = {
      accountId,
      name,
      email,
      phone,
      industry,
      revenue,
      expenses,
      profitMargin: calculatedProfitMargin.toFixed(2),
      projects,
      contractStartDate,
      contractEndDate,
      clients,
      status,
      notes,
    };

    if (editingAccount) {
      await updateDoc(doc(db, "accounts", editingAccount.id), newAccount);
      setAccounts(
        accounts.map((acc) => (acc.id === editingAccount.id ? { ...acc, ...newAccount } : acc))
      );
    } else {
      const docRef = await addDoc(collection(db, "accounts"), newAccount);
      setAccounts([...accounts, { id: docRef.id, ...newAccount }]);
    }

    setConfirmUpdateOpen(false);
    handleClose();
  };

  // Removed custom textFieldStyle from the form fields.

  const resetForm = () => {
    setName("");
    setIndustry("");
    setEmail("");
    setPhone("");
    setRevenue("");
    setExpenses("");
    setProfitMargin("");
    setProjects([]);
    setClients([]);
    setContractStartDate("");
    setContractEndDate("");
    setStatus("");
    setNotes("");
    setEditingAccount(null);
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
              mx={0}
              mt={-4.5}
              py={3}
              px={3}
              variant="gradient"
              bgColor="info"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h6" color="white">
                Account Management
              </MDTypography>
            </MDBox>
            <MDBox pt={3} pb={2} px={2}>
              <Button variant="gradient" color="info" onClick={handleClickOpen} sx={{ mb: 2 }}>
                Add Accounts
              </Button>
            </MDBox>

            {/* Account Cards Grid */}
            <Grid container spacing={3} sx={{ padding: "16px" }}>
              {accounts.map((account) => (
                <Grid item xs={12} md={12} key={account.id}>
                  <Card
                    sx={{
                      background: "linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      padding: "20px",
                      transition: "0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333", mb: 2 }}>
                        {account.name}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>ID:</strong> {account.accountId}
                          </MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>Email:</strong> {account.email}
                          </MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>Phone:</strong> {account.phone}
                          </MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>Industry:</strong> {account.industry}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>Contract:</strong> {account.contractId}
                          </MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>Start:</strong> {formatTimestamp(account.contractStartDate)}
                          </MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>End:</strong>{" "}
                            {account.contractEndDate
                              ? formatTimestamp(account.contractEndDate)
                              : "Ongoing"}
                          </MDTypography>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>Status:</strong>{" "}
                            <Chip
                              label={account.status}
                              sx={{
                                backgroundColor:
                                  account.status === "Active" ? "#4CAF50" : "#F44336",
                                color: "#fff",
                                fontSize: "12px",
                                padding: "4px 8px",
                                borderRadius: "6px",
                              }}
                            />
                          </MDTypography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} md={4}>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>CAC:</strong> ${account.Metrics?.cac || "N/A"}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>CLTV:</strong> ${account.Metrics?.cltv || "N/A"}
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <MDTypography variant="body2" color="textSecondary">
                            <strong>Revenue:</strong> ${account.Metrics?.revenueGenerated || "N/A"}
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <MDButton
                        variant="text"
                        onClick={() => handleEdit(account)}
                        sx={{
                          background:
                            "linear-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%)",
                          color: "#000",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          padding: "12px 24px",
                        }}
                      >
                        <Icon fontSize="medium">edit</Icon>&nbsp;Edit
                      </MDButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Account Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingAccount ? "Edit Account" : "Add Account"}</DialogTitle>
        <DialogContent sx={{ py: 2, padding: "30px" }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Removed Client ID field */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                {industries.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Revenue"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                InputProps={{
                  startAdornment:
                    revenue.trim() === "" ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : null,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Expenses"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value)}
                InputProps={{
                  startAdornment:
                    expenses.trim() === "" ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : null,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Profit Margin (%)"
                value={profitMargin}
                onChange={(e) => setProfitMargin(e.target.value)}
                InputProps={{
                  startAdornment:
                    profitMargin.trim() === "" ? (
                      <InputAdornment position="start">$</InputAdornment>
                    ) : null,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Contract Start Date"
                value={contractStartDate}
                onChange={(e) => setContractStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Contract End Date"
                value={contractEndDate}
                onChange={(e) => setContractEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Projects</InputLabel>
                <Select
                  multiple
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {projectList.map((project) => (
                    <MenuItem key={project.id} value={project.name}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Clients</InputLabel>
                <Select
                  multiple
                  value={clients}
                  onChange={(e) => setClients(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {clientList.map((client) => (
                    <MenuItem key={client.id} value={client.name}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Update Dialog */}
      <Dialog open={confirmUpdateOpen} onClose={() => setConfirmUpdateOpen(false)}>
        <DialogTitle>Are you sure you want to save changes?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmUpdateOpen(false)}>Cancel</Button>
          <Button onClick={confirmUpdate} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </MDBox>
  );
};

export default ManageAccount;
