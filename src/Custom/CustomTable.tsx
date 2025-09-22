import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Box,
  Button,
  Typography,
  TableSortLabel,
  Menu,
  MenuItem,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import CustomButton from "./CustomButton";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { CustomInputStyles } from "../assets/Styles/CustomStyles";
interface Column {
  id: string;
  label: string;
  sortable?: boolean;
  // When false (or "false"), this column is excluded from global search
  search?: boolean | "true" | "false";
  render?: (row: any) => React.ReactNode;
}

interface CustomTableProps {
  rows: any[];
  title?: string;
  columns: Column[];
  showCheckbox?: boolean;
  sortable?: boolean;
  exportBoolean?: boolean;
  colvis?: boolean; // enables the column visibility dropdown
  search?: boolean; // show global search input and enable filtering
}

export default function CustomNew({
  rows,
  columns,
  showCheckbox = false,
  sortable = false,
  colvis = false,
  search = false,
  title,
  exportBoolean,
}: CustomTableProps) {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [selected, setSelected] = useState<number[]>([]);
  const [orderBy, setOrderBy] = useState<string>("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // Global search
  const [globalSearch, setGlobalSearch] = useState<string>("");

  // Column visibility state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(() =>
    columns.map((c) => c.id)
  );

  // Keep visible columns in sync when `columns` prop changes
  useEffect(() => {
    setVisibleColumnIds(columns.map((c) => c.id));
  }, [columns]);

  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const toggleColumn = (id: string) => {
    setVisibleColumnIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selectAllColumns = () => setVisibleColumnIds(columns.map((c) => c.id));
  const clearAllColumns = () => setVisibleColumnIds([]);

  const displayedColumns = useMemo(
    () => columns.filter((c) => visibleColumnIds.includes(c.id)),
    [columns, visibleColumnIds]
  );

  // Global-filter rows across displayed columns
  const globallyFilteredRows = useMemo(() => {
    if (!search) return rows; // search disabled
    const term = globalSearch.trim().toLowerCase();
    if (!term) return rows;

    // Only include columns with search enabled (default true if undefined)
    const searchableColumns = displayedColumns.filter((c) => {
      if (c.search === undefined) return true; // default searchable
      if (typeof c.search === "string") return c.search !== "false";
      return c.search !== false;
    });

    if (searchableColumns.length === 0) return rows; // nothing to search across

    return rows.filter((row) =>
      searchableColumns.some((c) => {
        const value = row?.[c.id];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(term);
      })
    );
  }, [rows, displayedColumns, globalSearch, search]);

  const totalPages = Math.ceil(globallyFilteredRows.length / rowsPerPage);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIds = rows
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((_, idx) => idx + page * rowsPerPage);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (index: number) => {
    setSelected((prev) =>
      prev.includes(index)
        ? prev.filter((id) => id !== index)
        : [...prev, index]
    );
  };

  const handleSort = (columnId: string) => {
    if (!sortable) return;
    const isAsc = orderBy === columnId && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const sortedRows = orderBy
    ? [...globallyFilteredRows].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
      })
    : globallyFilteredRows;

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Export currently visible columns and filtered/sorted rows to CSV
  const exportToCSV = () => {
    // Only export columns that are visible and not custom-rendered
    const exportableColumns = displayedColumns.filter((c) => !c.render);
    const headers = exportableColumns.map((c) => c.label);
    const keys = exportableColumns.map((c) => c.id);

    // Use sortedRows to respect search and sorting; exports all filtered rows
    const dataLines = sortedRows.map((row) =>
      keys
        .map((key) => {
          const value = row?.[key];
          const str =
            value === undefined || value === null ? "" : String(value);
          const escaped = str.replace(/"/g, '""');
          return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(",")
    );

    const csv = [headers.join(","), ...dataLines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (title ? title.replace(/\s+/g, "_") : "export") + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrevious = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setPage((prev) => Math.min(prev + 1, totalPages - 1));

  const noDataColSpan = displayedColumns.length + (showCheckbox ? 1 : 0);

  return (
    <Paper
      sx={{ boxShadow: "none", border: "1px solid #e0e0e0", borderRadius: 2 }}
    >
      {/* Header title row */}
      {title && (
        <Box p={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Box>
      )}
      {/* Header actions row */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        gap={1.5}
      >
        {/* Global search */}
        {search && (
          <Box sx={{ flex: 1, maxWidth: 220, ...CustomInputStyles }}>
            <TextField
              size="small"
              placeholder="Search"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setPage(0);
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { fontSize: "12px", height: 36 },
              }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1 }}>
          {colvis && (
            <Box>
              <CustomButton
                type="button"
                size="small"
                variant="contained"
                label="Colvis"
                endIcon={<ArrowDropDownIcon />}
                onClick={handleOpenMenu}
              />
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleCloseMenu}
                sx={{ maxHeight: "300px" }}
              >
                <Box display="flex" gap={1} px={1.5} py={1}>
                  <Button
                    size="small"
                    onClick={selectAllColumns}
                    sx={{ textTransform: "none", fontSize: "11px" }}
                  >
                    Select All
                  </Button>
                  <Button
                    size="small"
                    onClick={clearAllColumns}
                    sx={{ textTransform: "none", fontSize: "11px" }}
                  >
                    Clear All
                  </Button>
                </Box>
                <Divider />
                {columns.map((col) => (
                  <MenuItem
                    key={col.id}
                    dense
                    onClick={() => toggleColumn(col.id)}
                  >
                    <Checkbox
                      size="small"
                      checked={visibleColumnIds.includes(col.id)}
                      sx={{
                        mr: 1,
                        "&.Mui-checked": { color: "var(--primary)" },
                      }}
                    />
                    <Typography variant="body2" sx={{ fontSize: "12px" }}>
                      {col.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}

          {/* Export CSV button */}
          {exportBoolean && (
            <CustomButton
              type="button"
              size="small"
              variant="contained"
              label="Export"
              onClick={exportToCSV}
            />
          )}
        </Box>
      </Box>

      <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  fontWeight: 600,
                  fontSize: { xs: "11px", sm: "12px" },
                  padding: showCheckbox
                    ? "5px 8px"
                    : { xs: "10px 12px", sm: "15px 18px" },
                  whiteSpace: "nowrap",
                },
              }}
            >
              {showCheckbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length < paginatedRows.length
                    }
                    checked={
                      selected.length === paginatedRows.length &&
                      paginatedRows.length > 0
                    }
                    onChange={handleSelectAll}
                    sx={{ "&.Mui-checked": { color: "var(--primary)" } }}
                  />
                </TableCell>
              )}
              {displayedColumns.map((col) => (
                <TableCell
                  key={col.id}
                  sx={
                    col.id === "difference"
                      ? {
                          backgroundColor: "#d3f8e06e",
                          color: "var(--primary)",
                          fontWeight: 700,
                        }
                      : undefined
                  }
                >
                  {sortable && col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row, idx) => {
                const rowIndex = idx + page * rowsPerPage;
                const isSelected = selected.includes(rowIndex);
                return (
                  <TableRow
                    key={rowIndex}
                    hover
                    sx={{
                      "& td": {
                        fontSize: "12px",
                        borderBottom: "1px solid #f0f0f0",
                        padding: showCheckbox ? "5px 8px" : "10px 18px",
                      },
                    }}
                  >
                    {showCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowIndex)}
                          sx={{ "&.Mui-checked": { color: "var(--primary)" } }}
                        />
                      </TableCell>
                    )}
                    {displayedColumns.map((col) => (
                      <TableCell
                        key={col.id}
                        sx={
                          col.id === "difference"
                            ? {
                                backgroundColor: "#d3f8e06e",
                                color: "var(--primary)",
                                fontWeight: 600,
                              }
                            : undefined
                        }
                      >
                        {col.render ? col.render(row) : row[col.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={noDataColSpan}
                  align="center"
                  sx={{
                    fontSize: "13px",
                    padding: "20px",
                    color: "var(--titleThird)",
                    fontFamily: "SemiBold_M",
                  }}
                >
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        py={1.5}
        borderTop="1px solid #e0e0e0"
      >
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ fontSize: "12px" }}
        >
          Page {page + 1} of {totalPages}
        </Typography>
        <Box>
          <Button
            size="small"
            onClick={handlePrevious}
            disabled={page === 0}
            sx={{
              textTransform: "none",
              mr: 1,
              fontSize: "12px",
              color: "var(--titleThird)",
              border: "solid 1px var(--borderColor)",
            }}
          >
            Previous
          </Button>
          <Button
            size="small"
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            sx={{
              textTransform: "none",
              mr: 1,
              fontSize: "12px",
              color: "var(--titleThird)",
              border: "solid 1px var(--borderColor)",
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
