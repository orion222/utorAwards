import { Box, Button, Collapse, IconButton, TextField, Pagination, Chip, FormControl, InputLabel, Select, MenuItem, useMediaQuery } from "@mui/material";
import { SearchIcon } from "lucide-react";
import FilterListIcon from "@mui/icons-material/FilterList"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

function FilterableList({ apiEndpoint, filterConfig, itemsPerPage = 10, children}) {
    const [searchInput, setSearchInput] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [tempFilters, setTempFilters] = useState({});
    const [appliedFilters, setAppliedFilters] = useState({});

    // const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const scrollRef = useRef(null);
    const isMobileWidth = useMediaQuery('(max-width:800px)');

    const { isLoading, error, data } = useQuery({
        queryKey: [],
        queryFn: () => fetchData(appliedFilters, page),
    });

    const fetchData = async (appliedFilters, page) => {

    }

    const checkScroll = () => {
        if (scrollRef.current) {
            setShowLeftArrow(scrollRef.current.scrollLeft > 0);
            setShowRightArrow(scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => {
            window.removeEventListener("resize", checkScroll);
        }
    }, [filterConfig, showFilters]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction * 300, behaviour: "smooth" });
        }
    };

    const applyFilters = () => {
        const newFilters = {...tempFilters};
        if (searchInput.trim()) {
            newFilters.name = searchInput;
        }
        setAppliedFilters(newFilters);
        setPage(1);
    };

    const updateTempFilter = (key, value) => {
        if (value) {
            setTempFilters(prev => ({ ...prev, [key]: value }));
        }
        else {
            setTempFilters(prev => {
                const newFilters = {...prev};
                delete newFilters[key];
                return newFilters;
            });
        }
    };

    const removeFilter = key => {
        const newApplied = {...appliedFilters};
        delete newApplied[key];
        setAppliedFilters(newApplied);
        setPage(1);

        if (key === "name") {
            setSearchInput("");
        }
        else {
            const newTemp = {...tempFilters};
            delete newTemp[key];
            setTempFilters(newTemp);
        }
    }

    return (
        <Box>
            {/* actual search bar + btn */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
                    fullWidth={isMobileWidth}
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
            <Collapse in={showFilters}>
                <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: isMobileWidth ? "stretch" : "center", flexDirection: isMobileWidth ? "column" : "row", minWidth: 0 }}>
                    <Box sx={{ position: "relative" }}>
                        {showLeftArrow && (
                            <IconButton
                                onClick={() => scroll(-1)}
                                size="small"
                                sx={{
                                    position: "absolute",
                                    left: 0,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 2,
                                    bgcolor: "white",
                                    boxShadow: 2,
                                    "&:hover": { bgcolor: "grey.100" }
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        )}

                        <Box
                            ref={scrollRef}
                            onScroll={checkScroll}
                            sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                overflowX: "auto",
                                maxWidth: "100%",
                                scrollbarWidth: "none",
                                "&::-webkit-scrollbar": { display: "none" },
                                pt: 1,
                                pl: showLeftArrow ? 5 : 0,
                                pr: showRightArrow ? 5 : 0,
                                transition: "padding 0.2s",
                                flexShrink: 1,
                                minWidth: 0,
                                maxWidth: "100%",
                            }}
                        >
                            {Object.entries(filterConfig).map(([key, config]) => config.type === "select" ? (
                                <FormControl
                                    key={key}
                                    size="small"
                                    sx={{ minWidth: 175, flexShrink: 0 }}
                                >
                                    <InputLabel>{config.label}</InputLabel>
                                    <Select
                                    value={tempFilters[key] || ""}
                                    onChange={e => updateTempFilter(key, e.target.value)}
                                    label={config.label}
                                    >
                                    <MenuItem value="">All</MenuItem>
                                    {config.options.map(option => (
                                        <MenuItem key={option} value={option}>
                                        {option}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                ) : (
                                <TextField
                                    key={key}
                                    label={config.label}
                                    value={tempFilters[key] || ""}
                                    onChange={e => updateTempFilter(key, e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && applyFilters()}
                                    size="small"
                                    sx={{ minWidth: 150, flexShrink: 0 }}
                                />
                                )
                            )}
                            </Box>

                        {showRightArrow && (
                            <IconButton
                                onClick={() => scroll(1)}
                                size="small"
                                sx={{
                                    position: "absolute",
                                    right: 0,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 2,
                                    bgcolor: "white",
                                    boxShadow: 2,
                                    "&:hover": { bgcolor: "grey.100" }
                                }}
                            >
                                <ChevronRightIcon />
                            </IconButton>
                        )}
                    </Box>
                    
                    <Box sx={{ pt: 1 }}>
                        <Button
                            variant="contained"
                            onClick={applyFilters}
                            size="small"
                            sx={{
                                height: 40,
                            }}
                            fullWidth={true}
                        >
                            Apply Filters
                        </Button>                        
                    </Box>

                </Box>
            </Collapse>
            
            {/* Small chips for filters */}
            <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(appliedFilters).map(([key, value]) => (
                    <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        onDelete={() => removeFilter(key)}
                        size="small"
                    />
                ))}
            </Box>
            
            {/* actual list content */}
            {children({ data, isLoading, totalCount })}
            
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                    />
                </Box>
            )}
        </Box>
    );
}

export default FilterableList;