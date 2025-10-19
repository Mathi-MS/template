import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Drawer,
  IconButton,
  Tooltip,
  type SxProps,
  type Theme,
} from "@mui/material";
import { CiFilter } from "react-icons/ci";
import { AiOutlineAudit } from "react-icons/ai";
import { Close } from "@mui/icons-material";
import UsersList from "./UserList";
import CustomButton from "../Custom/CustomButton";
import CardBox from "./card";
import SpendingChart from "./SpendingChart";
import AccountsCarousel from "./AccountsCarousel";
import StatsChart from "./TopStatsChart";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Controller, useForm } from "react-hook-form";
import { useApi } from "../api/apiService";
import { useGetDashboardData } from "../Hooks/dashboard";
import { useUser } from "../Config/userContext";
import { CustomAutocomplete } from "../Custom/CustomAutocomplete";
import { useGetCities } from "../Hooks/city";
import type { CityFormData } from "../Model/CityModel";
import { useGetLocations } from "../Hooks/locations";
import { useGetVendors } from "../Hooks/vendor";
import type { Locations } from "../Pages/Location";
import type { VendorFormData } from "../Model/VendorModel";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import LocationCityIcon from "@mui/icons-material/LocationCity";
import PlaceIcon from "@mui/icons-material/Place";
import PersonIcon from "@mui/icons-material/Person";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import dayjs from "dayjs";
// Layout base
export const DashboardContainerSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gap: 1.5,
};

dayjs.extend(isSameOrAfter);

export const SectionSx = (
  span: number,
  tabletSpan?: number,
  maxHeight?: string
): SxProps<Theme> => ({
  gridColumn: `span ${span}`,
  maxHeight: maxHeight || "auto",
  overflow: "hidden",
  "@media (max-width:1200px)": { gridColumn: `span ${tabletSpan || span}` },
  "@media (max-width:1024px)": { gridColumn: "span 12" },
});

const schema = z
  .object({
    cityId: z.string().optional(),
    locationId: z.string().optional(),
    vendorId: z.string().optional(),
    status: z.string().optional(),
    startDate: z
      .preprocess((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (dayjs.isDayjs(val)) return val.toDate();
        return new Date(val);
      }, z.date().nullable())
      .optional(),

    endDate: z
      .preprocess((val) => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (dayjs.isDayjs(val)) return val.toDate();
        return new Date(val);
      }, z.date().nullable())
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && !data.endDate) return false;
      if (data.startDate && data.endDate) {
        return dayjs(data.endDate).isSameOrAfter(dayjs(data.startDate));
      }
      return true;
    },
    {
      message: "End date is required and cannot be before start date",
      path: ["endDate"],
    }
  );

const Dashboard: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [filterValues, setFilterValues] = useState({
    cityId: "",
    locationId: "",
    vendorId: "",
    status: "",
    startDate: null,
    endDate: null,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      cityId: "",
      locationId: "",
      vendorId: "",
      status: "",
      startDate: null,
      endDate: null,
    },
  });

  const { user } = useUser();
  const { data } = useGetCities();
  const { data: locationData } = useGetLocations();
  const { data: vendorData } = useGetVendors();
  const role = user?.user?.role?.toLowerCase();

  const params = {
    cityId: filterValues.cityId || undefined,
    locationId: filterValues.locationId || undefined,
    vendorId: filterValues.vendorId || undefined,
    status: filterValues.status || undefined,
    startDate: filterValues.startDate
      ? new Date(filterValues.startDate).toISOString().split("T")[0]
      : undefined,
    endDate: filterValues.endDate
      ? new Date(filterValues.endDate).toISOString().split("T")[0]
      : undefined,
  };

  // Use combined hook
  const { data: dashboardData } = useGetDashboardData(params);

  const cityOptions = (data ?? []).map((d: CityFormData) => {
    return { label: d.cityName, title: d.id };
  });

  const locationOptions = (locationData ?? []).map((d: Locations) => {
    return { label: d.locationName, title: d.id };
  });

  const vendorOptions = (vendorData ?? []).map((d: VendorFormData) => {
    return { label: d.vendorName, title: d.id };
  });

  const slogans = [
    "Ride Fast, Manage Faster",
    "Every Ride, Under Your Control",
    "Track, Monitor, Optimize in Real-Time",
    "Powering Smooth Rides for Everyone",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { callApi } = useApi();

  const ridesByCitiesData = (dashboardData?.ridesByCities || []).map(
    (city: any) => ({
      label: city.cityName,
      value: city.count,
    })
  );

  return (
    <>
      {/* FILTER DRAWER */}
      <Drawer
        anchor="left"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
      >
        <Box
          sx={{
            width: 280,
            p: 3,
            background: "var(--backgroundInner)",
            minHeight: "100vh",
          }}
        >
          <form
            onSubmit={handleSubmit((data) => {
              console.log(data);

              setFilterValues({
                cityId: data.cityId || "",
                locationId: data.locationId || "",
                vendorId: data.vendorId || "",
                status: data.status || "",
                startDate: data.startDate || null,
                endDate: data.endDate || null,
              });
              setFilterOpen(false);
            })}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AiOutlineAudit size={26} color="var(--primary)" />
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--text-primary)",
                    fontFamily: "Bold_M",
                  }}
                >
                  TTMS
                </Typography>
              </Box>
              <IconButton
                onClick={() => setFilterOpen(false)}
                sx={{ color: "var(--text-secondary)" }}
              >
                <Close />
              </IconButton>
            </Box>

            <Typography
              variant="h6"
              sx={{ fontFamily: "Bold_M", mb: 2, color: "var(--text-primary)" }}
            >
              Filter Options
            </Typography>

            <Box sx={{ mb: 2 }}>
              <CustomAutocomplete
                name="cityId"
                required
                label="City"
                placeholder="Select City"
                register={register}
                errors={errors}
                options={cityOptions}
                control={control}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <CustomAutocomplete
                name="locationId"
                required
                label="Location"
                placeholder="Select Location"
                register={register}
                errors={errors}
                options={locationOptions}
                control={control}
              />

              <CustomAutocomplete
                name="vendorId"
                required
                label="Vendor"
                placeholder="Select Vendor"
                register={register}
                errors={errors}
                options={vendorOptions}
                control={control}
              />
              <CustomAutocomplete
                name="status"
                required
                label="Status"
                placeholder="Select Status"
                register={register}
                errors={errors}
                options={[
                  { label: "Pending", title: "pending" },
                  { label: "Completed", title: "completed" },
                ]}
                control={control}
              />
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ mb: 2 }}>
                <Tooltip title="Start Date" arrow>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Medium_M",
                      color: "var(--text-primary)",
                      mb: "6px",
                      display: "inline-block",
                    }}
                    component={"span"}
                  >
                    {"startDate".length > 20
                      ? "startDate".slice(0, 20) + "..."
                      : "startDate"}
                  </Typography>
                </Tooltip>
                <Box component={"span"} color={"var(--error)"}>
                  *
                </Box>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          error: !!errors.startDate,
                          helperText: errors.startDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Tooltip title="End Date" arrow>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "Medium_M",
                      color: "var(--text-primary)",
                      mb: "6px",
                      display: "inline-block",
                    }}
                    component={"span"}
                  >
                    {"endDate".length > 20
                      ? "endDate".slice(0, 20) + "..."
                      : "endDate"}
                  </Typography>
                </Tooltip>
                <Box component={"span"} color={"var(--error)"}>
                  *
                </Box>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: "outlined",
                          error: !!errors.endDate,
                          helperText: errors.endDate?.message,
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </LocalizationProvider>
            <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
              <CustomButton
                type="button"
                variant="outlined"
                label="Clear"
                onClick={() => {
                  reset();
                  setFilterValues({
                    cityId: "",
                    locationId: "",
                    vendorId: "",
                    status: "",
                    startDate: null,
                    endDate: null,
                  });
                  setFilterOpen(false);
                }}
                boxSx={{
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  width: "100%",
                  backgroundColor: "transparent",
                  "&:hover": { border: "1px solid var(--border)" },
                }}
              />
              <CustomButton
                type="submit"
                variant="contained"
                label="Apply"
                boxSx={{
                  backgroundColor: "var(--primary)",
                  color: "var(--white)",
                  width: "100%",
                  "&:hover": { backgroundColor: "var(--primary-dark)" },
                }}
                onClick={() => {
                  console.log(getValues());
                }}
              />
            </Box>
          </form>
        </Box>
      </Drawer>

      {/* DASHBOARD GRID */}
      <Box sx={DashboardContainerSx}>
        {/* HEADER */}
        <Box
          sx={{
            gridColumn: "span 12",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "var(--text-primary)",
              fontFamily: "Bold_M",
              fontSize: "1.1rem",
            }}
          >
            "{slogans[currentSlogan]}"
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Filter" placement="left">
              <Box
                onClick={() => setFilterOpen(true)}
                sx={{
                  color: "var(--white)",
                  background: "var(--primary)",
                  p: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  "&:hover": { background: "var(--primary)" },
                }}
              >
                <CiFilter size={20} />
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* METRIC CARDS */}
        <Box
          sx={{
            gridColumn: "span 2",
            "@media (max-width:1200px)": { gridColumn: "span 6" },
            "@media (max-width:1024px)": { gridColumn: "span 6" },
            "@media (max-width:912px)": { gridColumn: "span 12" },
            "@media (max-width:768px)": { gridColumn: "span 12" },
            borderRadius: "8px",
            padding: "1px",
          }}
        >
          <CardBox
            title="City"
            icon={<LocationCityIcon style={{ color: "var(--primary)" }} />}
            titleStyle={{ color: "var(--text-secondary)" }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: "Bold_M", color: "var(--text-primary)" }}
            >
              {dashboardData?.cityCount ?? 0}
            </Typography>
          </CardBox>
        </Box>

        <Box
          sx={{
            gridColumn: "span 2",
            "@media (max-width:1200px)": { gridColumn: "span 6" },
            "@media (max-width:1024px)": { gridColumn: "span 6" },
            "@media (max-width:912px)": { gridColumn: "span 12" },
            "@media (max-width:768px)": { gridColumn: "span 12" },
            borderRadius: "8px",
            padding: "1px",
          }}
        >
          <CardBox
            title="Location"
            icon={<PlaceIcon style={{ color: "var(--error)" }} />}
            titleStyle={{ color: "var(--text-secondary)" }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: "Bold_M", color: "var(--error)" }}
            >
              {dashboardData?.locationCount ?? 0}
            </Typography>
          </CardBox>
        </Box>

        <Box
          sx={{
            gridColumn: "span 2",
            "@media (max-width:1200px)": { gridColumn: "span 6" },
            "@media (max-width:1024px)": { gridColumn: "span 6" },
            "@media (max-width:912px)": { gridColumn: "span 12" },
            "@media (max-width:768px)": { gridColumn: "span 12" },
            borderRadius: "8px",
            padding: "1px",
          }}
        >
          <CardBox
            title="User"
            icon={<PersonIcon style={{ color: "var(--success)" }} />}
            titleStyle={{ color: "var(--text-secondary)" }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: "Bold_M", color: "var(--success)" }}
            >
              {dashboardData?.userCount ?? 0}
            </Typography>
          </CardBox>
        </Box>

        <Box
          sx={{
            gridColumn: "span 2",
            "@media (max-width:1200px)": { gridColumn: "span 6" },
            "@media (max-width:1024px)": { gridColumn: "span 6" },
            "@media (max-width:912px)": { gridColumn: "span 12" },
            "@media (max-width:768px)": { gridColumn: "span 12" },
            borderRadius: "8px",
            padding: "1px",
          }}
        >
          <CardBox
            title="Ride Ticket"
            icon={
              <ConfirmationNumberIcon
                style={{ color: "var(--primary-dark)" }}
              />
            }
            titleStyle={{ color: "var(--text-secondary)" }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: "Bold_M", color: "var(--primary-dark)" }}
            >
              {dashboardData?.rideTicketCount ?? 0}
            </Typography>
          </CardBox>
        </Box>

        <Box
          sx={{
            gridColumn: "span 2",
            "@media (max-width:1200px)": { gridColumn: "span 6" },
            "@media (max-width:1024px)": { gridColumn: "span 6" },
            "@media (max-width:912px)": { gridColumn: "span 12" },
            "@media (max-width:768px)": { gridColumn: "span 12" },
            borderRadius: "8px",
            padding: "1px",
          }}
        >
          <CardBox
            title="Transport"
            icon={
              <LocalShippingIcon style={{ color: "var(--primary-dark)" }} />
            }
            titleStyle={{ color: "var(--text-secondary)" }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: "Bold_M", color: "var(--primary-dark)" }}
            >
              {dashboardData?.transportCount ?? 0}
            </Typography>
          </CardBox>
        </Box>

        <Box
          sx={{
            gridColumn: "span 2",
            "@media (max-width:1200px)": { gridColumn: "span 6" },
            "@media (max-width:1024px)": { gridColumn: "span 6" },
            "@media (max-width:912px)": { gridColumn: "span 12" },
            "@media (max-width:768px)": { gridColumn: "span 12" },
            borderRadius: "8px",
            padding: "1px",
          }}
        >
          <CardBox
            title="Vendor"
            icon={<StorefrontIcon style={{ color: "var(--primary-dark)" }} />}
            titleStyle={{ color: "var(--text-secondary)" }}
          >
            <Typography
              variant="h5"
              sx={{ fontFamily: "Bold_M", color: "var(--primary-dark)" }}
            >
              {dashboardData?.vendorCount ?? 0}
            </Typography>
          </CardBox>
        </Box>

        {/* CHARTS & TABLES */}
        <Box sx={SectionSx(4, 12, "380px")}>
          <SpendingChart dashboardData={dashboardData} />
        </Box>

        <Box sx={SectionSx(8, 12, "380px")}>
          <AccountsCarousel cityCostMap={dashboardData?.cityCostMap} />
        </Box>

        {(role === "admin" || role === "superadmin") && (
          <Box sx={SectionSx(5, 12, "350px")}>
            <UsersList />
          </Box>
        )}

        <Box
          sx={SectionSx(
            role === "admin" || role === "superadmin" ? 7 : 12,
            12,
            "350px"
          )}
        >
          <StatsChart
            title="Top Rides by Cities"
            data={ridesByCitiesData}
            color="var(--primary)"
          />
        </Box>

        {/* <Box sx={SectionSx(12, 12, "600px")}>
          <RecentTransactions />
        </Box> */}

        {/* {(role === "admin" || role === "superadmin") && (
          <Box sx={SectionSx(3, 12, "600px")}>
            <OverView />
          </Box>
        )} */}
      </Box>
    </>
  );
};

export default Dashboard;
