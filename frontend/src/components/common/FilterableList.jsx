import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  Pagination,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import api from "../../api/api.js";

function FilterableList({
  apiEndpoint,
  queryKey,
  filterConfig,
  orderByConfig,
  limit = 10,
  children,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const appliedFilters = Object.fromEntries(searchParams.entries());

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  const isMobileWidth = useMediaQuery("(max-width:800px)");

  if (!filterConfig || !apiEndpoint || !queryKey) {
    return <Typography>Missing FilterableList props</Typography>;
  }

  const fetchData = async () => {
    const params = new URLSearchParams({ ...appliedFilters, page, limit });

    try {
      const { data } = await api.get(`${apiEndpoint}?${params}`);
      setTotalCount(data.count);
      return data.results;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: [queryKey, appliedFilters, page],
    queryFn: fetchData,
    retry: 1,
  });

  const applyFilters = () => {
    const newFilters = Object.fromEntries(
      Object.entries(tempFilters).map(([key, value]) => {
        if (
          key !== "name" &&
          key !== "description" &&
          key !== "remark" &&
          key !== "location" &&
          key !== "orderBy"
        ) {
          return [key, typeof value === "string" ? value.toLowerCase() : value];
        }
        return [key, value];
      }),
    );

    if (searchInput.trim()) {
      newFilters.search = searchInput;
    }
    setSearchParams({ ...newFilters, page: 1 });
    setPage(1);
  };

  const updateTempFilter = (key, value) => {
    if (value) {
      setTempFilters((prev) => ({ ...prev, [key]: value }));
    } else {
      setTempFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    }
  };

  const removeFilter = (key) => {
    const newParams = Object.fromEntries(searchParams.entries());
    delete newParams[key];
    setSearchParams({ ...newParams, page: 1 });
    setPage(1);

    if (key === "search") {
      setSearchInput("");
    } else {
      const newTemp = { ...tempFilters };
      delete newTemp[key];
      setTempFilters(newTemp);
    }
  };

  useEffect(() => {
    Object.entries(filterConfig).forEach(([key, config]) => {
      if (config.dependsOn) {
        const parentValue = tempFilters[config.dependsOn];
        const childValue = tempFilters[key];

        if (!parentValue && childValue) {
          updateTempFilter(key, "");
        }
      }
    });
  }, [tempFilters]);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam && Number(pageParam) !== page) {
      setPage(Number(pageParam));
    }
  }, [searchParams]);

  return (
    <Box>
      {/* actual search bar + btn */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
          flexWrap: "nowrap",
        }}
      >
        <TextField
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="Search..."
          slotProps={{
            input: {
              endAdornment: (
                <IconButton size="small" onClick={applyFilters}>
                  <SearchIcon />
                </IconButton>
              ),
            },
          }}
          sx={{
            width: isMobileWidth ? "100%" : "50%",
          }}
        />

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          size="small"
        >
          Filters
        </Button>
      </Box>

      {/* filter options */}
      <Collapse in={showFilters} sx={{ maxWidth: "100%", minWidth: 0 }}>
        <Box sx={{ mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: isMobileWidth ? "stretch" : "center",
              flexDirection: isMobileWidth ? "column" : "row",
              minWidth: 0,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                width: "100%",
                alignItems: "center",
              }}
            >
              {Object.entries(filterConfig).map(([key, config]) => {
                const dependsValue = config.dependsOn
                  ? tempFilters[config.dependsOn]
                  : null;
                const isDisabled = config.dependsOn && !dependsValue;

                if (config.type === "text") {
                  return (
                    <TextField
                      key={key}
                      label={config.label}
                      value={tempFilters[key] || ""}
                      onChange={(e) => updateTempFilter(key, e.target.value)}
                      size="small"
                      disabled={isDisabled}
                    />
                  );
                }

                if (config.type === "number") {
                  return (
                    <TextField
                      key={key}
                      type="number"
                      label={config.label}
                      value={tempFilters[key] || ""}
                      onChange={(e) => updateTempFilter(key, e.target.value)}
                      size="small"
                      disabled={isDisabled}
                      slotProps={{
                        htmlInput: {
                          min: config.min ?? undefined,
                          max: config.max ?? undefined,
                        },
                      }}
                    />
                  );
                }

                if (config.type === "select") {
                  return (
                    <FormControl key={key} size="small" sx={{ width: 130 }}>
                      <InputLabel>{config.label}</InputLabel>
                      <Select
                        value={tempFilters[key] || ""}
                        onChange={(e) => updateTempFilter(key, e.target.value)}
                        label={config.label}
                        disabled={isDisabled}
                      >
                        <MenuItem value="">All</MenuItem>
                        {config.options.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }

                return null;
              })}

              {/* ORDER BY SELECT */}
              {orderByConfig && (
                <FormControl size="small" sx={{ width: 160 }}>
                  <InputLabel>Order By</InputLabel>
                  <Select
                    label="Order By"
                    value={tempFilters.orderBy || ""}
                    onChange={(e) =>
                      updateTempFilter("orderBy", e.target.value)
                    }
                  >
                    {orderByConfig.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                variant="contained"
                onClick={applyFilters}
                size="small"
                sx={{
                  flex: "0 0 auto",
                  minWidth: 120,
                  height: 37,
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Small chips for filters */}
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {Object.entries(appliedFilters)
          .filter(([key]) => key !== "page")
          .map(([key, value]) => (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              onDelete={() => removeFilter(key)}
              size="small"
            />
          ))}
      </Box>

      {/* actual list content */}
      {children({ data, isFetching, error, refetch })}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, value) => {
              setPage(value);
              setSearchParams({ ...appliedFilters, page: value });
            }}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default FilterableList;
