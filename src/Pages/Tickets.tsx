import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
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
import { useGetVendors } from "../Hooks/vendor";

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

  const handleView = (ticket: any) => {
    setSelectedTicket(ticket);
    setOpen(true);
  };

  const handleEdit = (ticket: any) => {
    setSelectedTicket(ticket);
    reset({
      city: ticket?.city?.cityName || "",
      pickupLocation: ticket?.pickupLocation?.locationName || "",
      dropLocation: ticket?.dropLocation?.locationName || "",
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

  const { data: vendorData } = useGetVendors();

  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
    vendorInfo:
      vendorData?.find((v: any) => v.id === row.transport?.vendorId) || null,
  }));

  const vendorOptions =
    vendorData?.map((v: any) => ({
      label: v.vendorName,
      value: v.id,
    })) || [];

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

  useEffect(() => {
    if (vendorData?.length === 1) {
      setSelectedVendor(vendorData[0]);
    }
  }, [vendorData]);

  return (
    <Box>
      {/* 🧭 Filters */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 2,
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
            onClick={() => {
              const vendorCity = selectedVendor?.city?.cityName || "";
              downloadInvoicePDF(
                filteredRows,
                "My_Tickets",
                "INV-1001",
                new Date().toLocaleDateString(),
                selectedVendor,
                { cityName: vendorCity }
              );
            }}
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

      {/* 👁 Ticket Modal */}
      <TicketModal
        open={open}
        onClose={handleClose}
        userData={selectedTicket}
      />

      {/* ✏️ Edit Remarks Modal */}
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
              Edit Remarks
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

            {/* 🔒 Drop Location (Readonly) */}
            <CustomInput
              label="Drop Location"
              placeholder="Drop Location"
              type="text"
              name="dropLocation"
              register={register}
              errors={errors}
              disabled
              boxSx={{ mb: 2 }}
            />

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
                  label="End Ride"
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
