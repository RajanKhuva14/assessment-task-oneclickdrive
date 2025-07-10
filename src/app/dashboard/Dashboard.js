"use client";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Box, Tooltip, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { useLoading } from "@/context/Loader";
import { EditModal } from "../component/EditModal";
import { useToaster } from "@/context/ToasterContext";

export default function Dashboard({
  initialRows,
  rowCount,
  currentPage,
  currentPageSize,
}) {
  let moment = require("moment-timezone");
  const router = useRouter();
  const toaster = useToaster();
  const { showLoading, hideLoading } = useLoading();
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (initialRows && initialRows.length > 0) {
      hideLoading();
    }
  }, [initialRows]);
  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}&pageSize=${currentPageSize}`);
  };

  const handlePageSizeChange = (newSize) => {
    router.push(`?page=${currentPage}&pageSize=${newSize}`);
  };

  const handleAction = async (id, action) => {
    showLoading();
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    const data = await res.json();
    if (data.success) {
      toaster.addToast(`Record updated successfully!`, "success");
      router.push(`?page=${currentPage}&pageSize=${currentPageSize}`);
    }
  };
  const handleEdit = (row) => {
    setSelected(row);
    setEditOpen(true);
  };

  const columns = [
    { field: "carIndex", headerName: "Index", width: 70 },
    { field: "carName", headerName: "Car Name", width: 130 },
    {
      field: "carImage",
      headerName: "Car Image",
      width: 90,
      renderCell: (params) => (
        <div className="flex items-center justify-center w-full h-full">
          <Image
            src={`/assets/${params.value}`}
            alt="car"
            width={40}
            height={40}
            className="rounded-full object-cover"
            loading="lazy"
          />
        </div>
      ),
      sortable: false,
      filterable: false,
    },
    { field: "customerName", headerName: "Customer Name", width: 130 },
    { field: "customerNumber", headerName: "Customer Number", width: 130 },
    { field: "customerEmail", headerName: "Customer Email", width: 180 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      renderCell: (params) => (
        <span>
          {params.value
            ? moment(params.value).format("DD-MM-YYYY hh:mm A")
            : "N/A"}
        </span>
      ),
    },
    { field: "createdBy", headerName: "Created By", width: 100 },
    { field: "updatedBy", headerName: "Updated By", width: 150 },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 160,
      renderCell: (params) => (
        <span>
          {params.value
            ? moment(params.value).format("DD-MM-YYYY hh:mm A")
            : "N/A"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      renderCell: (params) => (
        <>
          <Tooltip title="Approve">
            <IconButton
              onClick={() => handleAction(params.row.id, "approve")}
              size="small"
              sx={{
                color: "#2e7d32",
                "&:hover": { backgroundColor: "#e8f5e9" },
              }}
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject">
            <IconButton
              onClick={() => handleAction(params.row.id, "reject")}
              size="small"
              sx={{
                color: "#c62828",
                "&:hover": { backgroundColor: "#ffebee" },
              }}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              onClick={() => handleEdit(params.row)}
              size="small"
              sx={{
                color: "#413815",
                "&:hover": { backgroundColor: "#fef9e7" },
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const handleCloseEdit = () => {
    router.push(`?page=${currentPage}&pageSize=${currentPageSize}`);
  };

  return (
    <div className="min-h-screen bg-[#ffd966]">
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="h-12 w-36 relative flex-shrink-0">
          <Image src="/assets/logo.svg" alt="Logo" fill />
        </div>
        <h1 className="text-3xl font-semibold text-[#252f40]">Dashboard</h1>
        <div className="w-20" />
      </header>

      <main className="p-6">
        <div className="bg-white shadow-md rounded-lg h-[600px] overflow-auto">
          <DataGrid
            rows={initialRows}
            columns={columns}
            pagination
            paginationMode="server"
            rowCount={rowCount}
            page={currentPage}
            pageSize={currentPageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 25]}
            paginationModel={{
              page: currentPage - 1,
              pageSize: currentPageSize,
            }}
            onPaginationModelChange={(model) => {
              router.push(`?page=${model.page + 1}&pageSize=${model.pageSize}`);
            }}
            disableSelectionOnClick
          />
        </div>
      </main>

      {editOpen && (
        <EditModal
          open={editOpen}
          rowData={selected}
          onClose={() => setEditOpen(false)}
          onSave={handleCloseEdit}
        />
      )}
    </div>
  );
}
