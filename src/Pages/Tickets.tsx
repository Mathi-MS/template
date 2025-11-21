import { Box, Typography, IconButton, Modal } from "@mui/material";
import { useState, useMemo, useEffect } from "react";
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

  // Active filters (only applied after clicking Apply Filters)
  const [filters, setFilters] = useState({
    vendor: null,
    city: null,
    dateRange: null,
  });

  // Form for filter inputs + edit modal inputs
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
        if (!acc.find((c) => c.id === curr.id)) {
          acc.push(curr);
        }
        return acc;
      }, [])
      .map((city) => ({
        label: city.cityName,
        title: city.id,
        value: city,
      })) || [];

  // FILTER LOGIC - uses only "filters" (NOT form values)
  const filteredRows = useMemo(() => {
    return numberedRows.filter((ticket: any) => {
      const vendorMatch = filters.vendor
        ? ticket.transport?.vendorId === filters.vendor
        : true;

      const cityMatch = filters.city ? ticket.city?.id === filters.city : true;

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


      return vendorMatch && cityMatch && dateMatch;
    });
  }, [numberedRows, filters]);

  // Table columns
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

        {/* BUTTONS (Apply / Clear / PDF) */}
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
              setFilters({ vendor: null, city: null, dateRange: null });
            }}
          />

          {/* Apply Filters */}
          <CustomButton
            type="submit"
            variant="contained"
            label="Apply Filters"
            onClick={() => {
              const vals = getValues();
              console.log(vals.city);

              setFilters({
                vendor: vals.vendor,
                city: vals.city,
                dateRange: vals.dateRange,
              });
            }}
          />

          {/* PDF Download */}
          <CustomButton
            type="button"
            variant="contained"
            label="Download PDF"
            onClick={() => {
              const selectedCity = cityOptions.find(
                (c) =>
                  c.title === filters.city
              );
              
              const cityName = selectedCity?.label || "";
              downloadInvoicePDF(
                filteredRows,
                "My_Tickets",
                new Date().toLocaleDateString(),
                filters.vendor,
                { cityName: cityName || "" }
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
        onClose={(_, reason) => {
          if (reason !== "backdropClick") setEditOpen(false);
        }}
      >
        <Box sx={styleModalNew}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">Edit Remarks</Typography>
            <IconButton onClick={() => setEditOpen(false)} sx={iconStyle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit(() => {})}
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
                  variant="outlined"
                  label="Cancel"
                  onClick={() => setEditOpen(false)}
                />
                <CustomButton
                  type="submit"
                  variant="contained"
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
