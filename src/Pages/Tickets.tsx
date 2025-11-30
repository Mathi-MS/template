import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { MdOutlineRemoveRedEye, MdEdit } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
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
  const { data: vendorData } = useGetVendors();

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  // Active filters
  const [filters, setFilters] = useState({
    vendor: null,
    city: null,
    dateRange: null,
    user: null, // NEW user filter
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vendor: null,
      city: null,
      dateRange: null,
      user: null, // NEW
      pickupLocation: "",
      dropLocation: "",
    },
  });

  const { mutate: updateRemarks, isPending: isLoading } = useUpdateRemarks();

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

  const numberedRows = (data ?? []).map((row: any, idx: number) => ({
    ...row,
    sno: idx + 1,
    vendorInfo:
      vendorData?.find((v: any) => v.id === row.transport?.vendorId) || null,
  }));

  const vendorOptions =
    vendorData?.map((v: any) => ({
      label: v.vendorName,
      title: v.id,
    })) || [];

  const cityOptions =
    data
      ?.map((t: any) => t.city)
      .filter(Boolean)
      .reduce((acc: any[], curr: any) => {
        if (!acc.find((c) => c.id === curr.id)) acc.push(curr);
        return acc;
      }, [])
      .map((city) => ({
        label: city.cityName,
        title: city.id,
        value: city,
      })) || [];

  // NEW - Username dropdown options
  const userOptions =
    data?.map((t: any) => ({
      label: t.userName,
      title: t.userId,
    })) || [];

  // FILTER LOGIC
  const filteredRows = useMemo(() => {
    return numberedRows.filter((ticket: any) => {
      const vendorMatch = filters.vendor
        ? ticket.transport?.vendorId === filters.vendor
        : true;

      const cityMatch = filters.city ? ticket.city?.id === filters.city : true;

      const userMatch = filters.user ? ticket.userId === filters.user : true;

      const start = filters.dateRange?.[0];
      const end = filters.dateRange?.[1];

      const dateMatch =
        start && end
          ? ticket.pickupDate
            ? dayjs(ticket.rideStartTime).isBetween(
                dayjs(start).startOf("day"),
                dayjs(end).endOf("day"),
                null,
                "[]"
              )
            : false
          : true;

      return vendorMatch && cityMatch && userMatch && dateMatch;
    });
  }, [numberedRows, filters]);

  // TABLE COLUMNS
  const columns = [
    { id: "sno", label: "S.No" },
    { id: "userName", label: "Recipient Name" },
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

  return (
    <Box>
      {/* FILTERS SECTION */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          {/* Vendor */}
          <Box sx={{ width: { xs: "100%", sm: 240 } }}>
            <CustomAutocomplete
              name="vendor"
              label="Vendor"
              placeholder="Select Vendor"
              control={control}
              options={vendorOptions}
              multiple={false}
            />
          </Box>

          {/* City */}
          <Box sx={{ width: { xs: "100%", sm: 240 } }}>
            <CustomAutocomplete
              name="city"
              label="City"
              placeholder="Select City"
              control={control}
              options={cityOptions}
            />
          </Box>

          {/* Username */}
          <Box sx={{ width: { xs: "100%", sm: 240 } }}>
            <CustomAutocomplete
              name="user"
              label="Username"
              placeholder="Select Username"
              control={control}
              options={userOptions}
              multiple={false}
            />
          </Box>

          {/* Date Range */}
          <Box sx={{ width: { xs: "100%", sm: 280 } }}>
            <Typography sx={{ mb: 1, fontSize: 14 }}>Date Range</Typography>
            <Controller
              name="dateRange"
              control={control}
              render={({ field }) => (
                <RangePicker
                  {...field}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  style={{ width: "100%", height: 40 }}
                />
              )}
            />
          </Box>
        </Box>

        {/* BUTTONS */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-end",
          }}
        >
          {/* Clear Filters */}
          <CustomButton
            type="submit"
            variant="contained"
            label="Clear Filters"
            onClick={() => {
              reset();
              setFilters({
                vendor: null,
                city: null,
                dateRange: null,
                user: null,
              });
            }}
          />

          {/* Apply Filters */}
          <CustomButton
            type="submit"
            variant="contained"
            label="Apply Filters"
            onClick={() => {
              const vals = getValues();

              setFilters({
                vendor: vals.vendor,
                city: vals.city,
                dateRange: vals.dateRange,
                user: vals.user,
              });
            }}
          />

          {/* PDF Download */}
          <CustomButton
            type="button"
            variant="contained"
            label="Download PDF"
            disabled={!filters.vendor && !filters.user}
            onClick={() => {
              // 1. City selected from city filter
              const selectedCity = cityOptions.find(
                (c) => c.title === filters.city
              );

              // 2. Get user's city if user is selected
              let autoCityName = "";
              if (filters.user) {
                const userTicket = data?.find(
                  (t: any) => t.userId === filters.user
                );
                autoCityName = userTicket?.city?.cityName || "";
              }

              // 3. Priority: user city → selected city → empty
              const cityName = filters.user
                ? autoCityName
                : selectedCity?.label || "";

              // 4. Generate PDF
              downloadInvoicePDF(
                filteredRows,
                "Invoice",
                new Date().toLocaleDateString(),
                filters.vendor,
                { cityName }
              );
            }}
          />
        </Box>
      </Box>

      {/* TABLE */}
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

      {/* VIEW MODAL */}
      <TicketModal
        open={open}
        onClose={() => setOpen(false)}
        userData={selectedTicket}
      />

      {/* EDIT MODAL */}
      <Modal
        open={editOpen}
        onClose={(_event, reason) => {
          if (reason === "backdropClick") return;
          handleEditClose();
        }}
      >
        <Box sx={styleModalNew}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Edit Remarks</Typography>
            <IconButton onClick={handleEditClose} sx={iconStyle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            <CustomInput
              label="City"
              name="city"
              register={register}
              disabled
              errors={errors}
              boxSx={{ mb: 2 }}
            />

            <CustomInput
              label="Pickup Location"
              name="pickupLocation"
              register={register}
              disabled
              errors={errors}
              boxSx={{ mb: 2 }}
            />

            <CustomInput
              label="Drop Location"
              name="dropLocation"
              register={register}
              disabled
              errors={errors}
            />

            {selectedTicket?.status?.toLowerCase() === "ride started" && (
              <Box sx={{ ...btnStyleContainer, justifyContent: "end", mt: 3 }}>
                <CustomButton
                  type="button"
                  variant="contained"
                  label="Cancel"
                  onClick={() => setEditOpen(false)}
                />
                <CustomButton
                  type="submit"
                  variant="contained"
                  label="End Ride"
                  loading={isLoading}
                  onClick={() => {
                    console.log(getValues());
                    console.log(errors);
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};
