import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineRemoveRedEye, MdEdit } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { DatePicker } from "antd";

import CustomTable from "../Custom/CustomTable";
import TicketModal from "../Model/TicketModel";
import CustomButton from "../Custom/CustomButton";
import { useGetMyTickets, useUpdateRemarks } from "../Hooks/ticket";
import {
  btnStyleContainer,
  iconStyle,
  styleModalNew,
} from "../assets/Styles/CustomModelStyle";
import { CustomInput } from "../Custom/CustomInput";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import { downloadInvoicePDF } from "../Config/pdf";

const { RangePicker } = DatePicker;

export const Tickets = () => {
  const { data } = useGetMyTickets();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // 🧭 Filter states
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [dateRange, setDateRange] = useState<[any, any] | null>(null);

  const { mutate: updateRemarks, isPending: isLoading } = useUpdateRemarks();

  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      city: "",
      pickupLocation: "",
      dropLocation: "",
    },
  });

  const [filters, setFilters] = useState({
    vendor: null,
    city: null,
    dateRange: null,
  });

  // 📦 Handlers
  const handleView = (ticket: any) => {
    setSelectedTicket(ticket);
    setOpen(true);
  };

  const handleEdit = (ticket: any) => {
    setSelectedTicket(ticket);
    reset({
      city: ticket?.city?.cityName || "",
      pickupLocation: ticket?.pickupLocation?.locationName || "",
      dropLocation: ticket?.dropLocation?.id || "",
    });
    setEditOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTicket(null);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedTicket(null);
  };

  const onSubmit = () => {
    if (!selectedTicket) return;
    const formData = getValues();

    updateRemarks(
      {
        id: selectedTicket.id,
        dropLocation: formData.dropLocation || undefined,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedTicket(null);
        },
      }
    );
  };

  // 🔢 Table Data
  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
  }));

  const vendorOptions =
    Array.from(
      new Set(data?.map((t: any) => t.vendor?.name).filter(Boolean))
    ).map((name) => ({ label: name, value: name })) || [];

  const cityOptions =
    Array.from(
      new Set(data?.map((t: any) => t.city?.cityName).filter(Boolean))
    ).map((city) => ({ label: city, value: city })) || [];

const filteredRows = useMemo(() => {
  return numberedRows.filter((ticket: any) => {
    const matchesVendor = filters.vendor
      ? ticket.vendor?.name === filters.vendor
      : true;

    const matchesCity = filters.city
      ? ticket.city?.cityName === filters.city
      : true;

    const matchesDate =
      filters.dateRange && filters.dateRange[0] && filters.dateRange[1]
        ? dayjs(ticket.pickupDate).isAfter(
            dayjs(filters.dateRange[0]).startOf("day")
          ) &&
          dayjs(ticket.pickupDate).isBefore(
            dayjs(filters.dateRange[1]).endOf("day")
          )
        : true;

    return matchesVendor && matchesCity && matchesDate;
  });
}, [numberedRows, filters]);


  const columns = [
    { id: "sno", label: "S.No" },
    { id: "userId", label: "Recipient Name" },
    { id: "mobileNo", label: "Recipient Contact No" },
    {
      id: "pickupLocation",
      label: "Pickup Location",
      render: (row: any) => row.pickupLocation?.locationName,
    },
    {
      id: "pickupDate",
      label: "Date",
      render: (row: any) => {
        const dateToShow = row.pickupDate || row.createdAt;
        return dateToShow
          ? new Date(dateToShow).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-";
      },
    },
    { id: "status", label: "Status" },
    {
      id: "action",
      label: "Action",
      render: (row: any) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton onClick={() => handleView(row)} size="small">
            <MdOutlineRemoveRedEye
              style={{ color: "var(--grey)", fontSize: "16px" }}
            />
          </IconButton>
          <IconButton onClick={() => handleEdit(row)} size="small">
            <MdEdit style={{ color: "var(--grey)", fontSize: "16px" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  // 🏙 Drop Location Options (excluding pickup)
  const locationOptions =
    selectedTicket?.city?.locations
      ?.filter((loc: any) => loc.id !== selectedTicket?.pickupLocation?.id)
      ?.map((loc: any) => ({
        label: loc.locationName,
        title: loc.id,
      })) || [];

  return (
    <Box>
      {/* 🧭 Filters + Actions */}
      <Box sx={{ mb: 3 }}>
        {/* Filters Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2, // spacing between filters
            mb: 2, // spacing below filters
          }}
        >
          <CustomAutocomplete
            label=""
            name="vendor"
            placeholder="Select Vendor"
            options={vendorOptions}
            value={selectedVendor}
            control={control}
            onChange={(e: any, val: any) => setSelectedVendor(val)}
          />

          <CustomAutocomplete
            label=""
            name="city"
            placeholder="Select City"
            options={cityOptions}
            value={selectedCity}
            control={control}
            onChange={(e: any, val: any) => setSelectedCity(val)}
          />

          <Box>
            <Typography
              sx={{
                mb: 1,
                fontSize: 14,
                fontFamily: "Medium_M",
                color: "var(--text-primary)",
              }}
            >
              Date Range
            </Typography>
            <RangePicker
              value={dateRange}
              onChange={(values) => setDateRange(values)}
              format="YYYY-MM-DD"
              allowClear
              style={{ height: 40 }}
            />
          </Box>
        </Box>

        {/* Buttons Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <CustomButton
            type="button"
            variant="outlined"
            label="Clear Filters"
            boxSx={{
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              border: "1px solid var(--border) !important",
            }}
            onClick={() => {
              setSelectedVendor(null);
              setSelectedCity(null);
              setDateRange(null);
              setFilters({
                vendor: null,
                city: null,
                dateRange: null,
              });
            }}
          />

          <CustomButton
            type="button"
            variant="contained"
            label="Apply Filters"
            onClick={() => {
              setFilters({
                vendor: selectedVendor?.id || null,
                city: selectedCity?.id || null,
                dateRange,
              });
            }}
          />

          <CustomButton
            type="button"
            variant="contained"
            label="Download PDF"
            onClick={() => downloadInvoicePDF(filteredRows, "My_Tickets")}
          />
        </Box>
      </Box>

      {/* 📋 Tickets Table */}
      <CustomTable
        rows={filteredRows}
        columns={columns}
        showCheckbox={false}
        sortable
        colvis
        search
        exportBoolean
        title="My Tickets"
      />

      {/* 👁 View Ticket Modal */}
      <TicketModal
        open={open}
        onClose={handleClose}
        userData={selectedTicket}
      />

      {/* ✏️ Edit Modal */}
      <Modal
        open={editOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          handleEditClose();
        }}
        sx={{ zIndex: 999999999 }}
      >
        <Box sx={styleModalNew}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontSize: "16px",
                fontFamily: "Medium_M",
                color: "var(--text-primary)",
              }}
            >
              Edit Remarks & Drop Location
            </Typography>
            <IconButton onClick={handleEditClose} sx={iconStyle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ m: "10px 0px 20px 0px" }}
          >
            <CustomInput
              label="City"
              required
              placeholder="Enter City"
              type="text"
              name="city"
              register={register}
              errors={errors}
              disabled
              boxSx={{ mb: 2 }}
            />
            <CustomInput
              label="Pickup Location"
              required
              placeholder="Enter Pickup Location"
              type="text"
              name="pickupLocation"
              register={register}
              errors={errors}
              disabled
              boxSx={{ mb: 2 }}
            />
            {
              <CustomAutocomplete
                label="Drop Location"
                required
                placeholder="Select Drop Location"
                name="dropLocation"
                control={control}
                errors={errors}
                options={locationOptions}
                multiple={false}
                disabled={selectedTicket?.dropLocation}
              />
            }
            {selectedTicket?.status?.toLowerCase() === "ride started" && (
              <Box sx={{ ...btnStyleContainer, justifyContent: "end", mt: 3 }}>
                <CustomButton
                  type="reset"
                  variant="outlined"
                  label="Cancel"
                  onClick={handleEditClose}
                  boxSx={{
                    backgroundColor: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border) !important",
                  }}
                />
                <CustomButton
                  type="submit"
                  variant="contained"
                  size="medium"
                  label={
                    selectedTicket?.status?.toLowerCase() === "ride started"
                      ? "End Ride"
                      : "Create Ride"
                  }
                  loading={isLoading}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
