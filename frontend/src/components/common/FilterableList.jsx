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
  Checkbox,
  FormControlLabel,
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
  additionalParams = {},
  initialFilters = {},
}) {
  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasFilters, setHasFilters] = useState(false);
  const appliedFilters = Object.fromEntries(searchParams.entries());

  const getAppliedFilters = () => {
    const params = Object.fromEntries(searchParams.entries());
    for (const [key, config] of Object.entries(filterConfig)) {
      if (config.type === "boolean") {
        if (params[key] === "true") {
          params[key] = true;
        } else if (params[key] === "false") {
          params[key] = false;
        } else {
          delete params[key];
        }
      }
    }

    return params;
  };

  const [tempFilters, setTempFilters] = useState(() => {
    const applied = getAppliedFilters();
    return Object.keys(applied).length > 0 ? applied : initialFilters;
  });

  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? Number(pageParam) : 1;
  });
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  const isMobileWidth = useMediaQuery("(max-width:800px)");

  useEffect(() => {
    const applied = getAppliedFilters();
    if (
      Object.keys(applied).length === 0 &&
      Object.keys(initialFilters).length > 0
    ) {
      setSearchParams(initialFilters, { replace: true });
    }
  }, []);

  if (!filterConfig || !apiEndpoint || !queryKey) {
    return <Typography>Missing FilterableList props</Typography>;
  }

  const fetchData = async () => {
    const params = new URLSearchParams({
      ...getAppliedFilters(),
      ...additionalParams,
      limit,
      page,
    });
    try {
      const { data } = await api.get(`${apiEndpoint}?${params}`);
      setTotalCount(data.count);
      return data.results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: [queryKey, getAppliedFilters(), page],
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
    setTempFilters((prev) => {
      const newFilters = { ...prev };

      // Remove this key if value is empty
      if (!value) {
        delete newFilters[key];
        return newFilters;
      }

      // Handle mutually exclusive filters
      const config = filterConfig[key];
      if (config?.exclusiveWith) {
        config.exclusiveWith.forEach((otherKey) => {
          if (newFilters[otherKey]) {
            delete newFilters[otherKey];
          }
        });
      }

      // Apply new value
      newFilters[key] = value;

      return newFilters;
    });
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
    const newPage = pageParam ? Number(pageParam) : 1;
    if (newPage !== page) {
      setPage(newPage);
    }
    setTempFilters(getAppliedFilters());
  }, [searchParams]);

  useEffect(() => {
    const filterKeys = Object.keys(appliedFilters).filter(
      (key) => key !== "page",
    );
    setHasFilters(filterKeys.length > 0);
  }, [appliedFilters]);


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
              )
            }
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
                      InputProps={{
                        inputProps: {
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

                if (config.type === "boolean") {
                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={!!tempFilters[key]}
                          onChange={(e) =>
                            updateTempFilter(key, e.target.checked)
                          }
                          disabled={isDisabled}
                        />
                      }
                      label={config.label}
                    />
                  );
                }

                return null;
              })}

              {/* ORDER BY SELECT */}
              {(orderByConfig && orderByConfig.length > 0) && (
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
        {Object.entries(getAppliedFilters())
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
      {children({ data, isFetching, error, refetch, getAppliedFilters })}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, value) => {
              setPage(value);
              setSearchParams({ ...getAppliedFilters(), page: value });
            }}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}

export default FilterableList;
