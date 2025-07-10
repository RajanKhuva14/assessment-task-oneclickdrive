import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLoading } from "@/context/Loader";
import { useToaster } from "@/context/ToasterContext";

export function EditModal({ open, rowData, onClose, onSave }) {
  let moment = require("moment-timezone");
  const { showLoading } = useLoading();
  const toaster = useToaster();
  const [formData, setFormData] = useState({
    carIndex: "",
    carName: "",
    carImage: "",
    customerName: "",
    customerNumber: "",
    customerEmail: "",
    createdBy: "",
    createdAt: "",
    updatedBy: "",
    updatedAt: "",
  });

  useEffect(() => {
    if (rowData) {
      setFormData({
        carIndex: rowData.carIndex || "",
        carName: rowData.carName || "",
        carImage: rowData.carImage || "",
        customerName: rowData.customerName || "",
        customerNumber: rowData.customerNumber || "",
        customerEmail: rowData.customerEmail || "",
        createdBy: rowData.createdBy || "",
        createdAt: rowData.createdAt || "",
        updatedBy: rowData.updatedBy || "",
        updatedAt: rowData.updatedAt || "",
      });
    }
  }, [rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();
    onClose();
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rowData.id, action: "edit", data: formData }),
    });
    const data = await res.json();
    if (data.success) {
      toaster.addToast(`Record updated successfully!`, "success");
      onSave(data.listing);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: "#f5f5f5" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" fontWeight="bold">
            Edit Car Details
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
              "&:hover": {
                color: (theme) => theme.palette.grey[700],
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Car Name"
              name="carName"
              value={formData.carName}
              onChange={handleChange}
              variant="outlined"
              size="medium"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              variant="outlined"
              size="medium"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Number"
              name="customerNumber"
              value={formData.customerNumber}
              onChange={handleChange}
              variant="outlined"
              size="medium"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Customer Email"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
              variant="outlined"
              size="medium"
            />
          </Grid>

          <Grid item xs={12} sm={6}></Grid>
        </Grid>
        <Box className="flex flex-col items-start justify-start p-2">
          <DialogContentText className="!text-[12px]">
            Created by :{formData.createdBy}
          </DialogContentText>
          <DialogContentText className="!text-[12px]">
            Created date :
            {formData.createdAt
              ? moment(formData.createdAt).format("DD-MM-YYYY hh:mm A")
              : "N/A"}
          </DialogContentText>
          <DialogContentText className="!text-[12px]">
            Updated by:{formData.updatedBy}
          </DialogContentText>
          <DialogContentText className="!text-[12px]">
            Updated date :
            {formData.updatedAt
              ? moment(formData.updatedAt).format("DD-MM-YYYY hh:mm A")
              : "N/A"}
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, bgcolor: "#f5f5f5" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            minWidth: 100,
            borderColor: "#ccc",
            color: "#666",
            "&:hover": {
              borderColor: "#999",
              bgcolor: "#f9f9f9",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            minWidth: 100,
            bgcolor: "#413815",
            "&:hover": {
              bgcolor: "#2d2710",
            },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
