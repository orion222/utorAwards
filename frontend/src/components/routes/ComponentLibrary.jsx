import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Badge,
  Tooltip,
  Fab,
  Switch,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  LinearProgress,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Breadcrumbs,
  Link,
  Grid,
  Stack,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Home,
  Settings,
  Search,
  Add,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  ExpandMore,
  Menu,
  Close,
  Star,
  Email,
  Phone,
  Person,
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7CD93A",
      dark: "#6ABB30",
    },
    secondary: {
      main: "#F59B66",
    },
    background: {
      default: "#FCFEFB",
      paper: "#F8FAF4",
    },
    text: {
      primary: "#232715",
      secondary: "#6B6F5A",
    },
    success: {
      main: "#62C53C",
    },
    error: {
      main: "#E4584F",
    },
    info: {
      main: "#7DA4F2",
    },
    warning: {
      main: "#F2C94C",
    },
  },
  typography: {
    fontFamily: `"Inter", sans-serif`,
  },
});

export default function ComponentLibrary() {
  const [tabValue, setTabValue] = useState(0);
  const [sliderValue, setSliderValue] = useState(30);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState("option1");
  const [selectValue, setSelectValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  const ComponentSection = ({ title, children }) => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: "primary.main", fontWeight: "bold" }}
      >
        {title}
      </Typography>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            MUI Component Library
          </Typography>
          <Typography variant="h6" color="text.secondary">
            A comprehensive showcase of Material-UI components for developers
          </Typography>
        </Box>

        {/* Typography */}
        <ComponentSection title="Typography">
          <Stack spacing={2}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
            <Typography variant="body1">
              Body 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
            <Typography variant="body2">
              Body 2 - Smaller body text for secondary information.
            </Typography>
            <Typography variant="caption">Caption text</Typography>
            <Typography variant="overline">OVERLINE TEXT</Typography>
          </Stack>
        </ComponentSection>

        {/* Buttons */}
        <ComponentSection title="Buttons">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Contained Buttons
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="contained">Primary</Button>
                <Button variant="contained" color="secondary">
                  Secondary
                </Button>
                <Button variant="contained" color="success">
                  Success
                </Button>
                <Button variant="contained" color="error">
                  Error
                </Button>
                <Button variant="contained" disabled>
                  Disabled
                </Button>
                <Button variant="contained" startIcon={<Add />}>
                  With Icon
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Outlined Buttons
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button variant="outlined">Primary</Button>
                <Button variant="outlined" color="secondary">
                  Secondary
                </Button>
                <Button variant="outlined" color="success">
                  Success
                </Button>
                <Button variant="outlined" color="error">
                  Error
                </Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Text Buttons
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button>Primary</Button>
                <Button color="secondary">Secondary</Button>
                <Button color="success">Success</Button>
                <Button color="error">Error</Button>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Icon Buttons
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton>
                  <Home />
                </IconButton>
                <IconButton color="primary">
                  <Favorite />
                </IconButton>
                <IconButton color="secondary">
                  <Settings />
                </IconButton>
                <IconButton disabled>
                  <Delete />
                </IconButton>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Floating Action Buttons
              </Typography>
              <Stack direction="row" spacing={2}>
                <Fab color="primary">
                  <Add />
                </Fab>
                <Fab color="secondary">
                  <Edit />
                </Fab>
                <Fab variant="extended" color="primary">
                  <Add sx={{ mr: 1 }} />
                  Extended
                </Fab>
              </Stack>
            </Box>
          </Stack>
        </ComponentSection>

        {/* Form Controls */}
        <ComponentSection title="Form Controls">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <TextField label="Standard TextField" variant="standard" />
                <TextField label="Filled TextField" variant="filled" />
                <TextField label="Outlined TextField" variant="outlined" />
                <TextField
                  label="With Helper Text"
                  helperText="Some important text"
                />
                <TextField
                  label="Error State"
                  error
                  helperText="This field is required"
                />
                <TextField label="Disabled" disabled value="Disabled value" />
                <TextField
                  label="With Icon"
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                />
                <TextField label="Multiline" multiline rows={4} />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Option</InputLabel>
                  <Select
                    value={selectValue}
                    label="Select Option"
                    onChange={(e) => setSelectValue(e.target.value)}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={switchValue}
                      onChange={(e) => setSwitchValue(e.target.checked)}
                    />
                  }
                  label="Switch Control"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkboxValue}
                      onChange={(e) => setCheckboxValue(e.target.checked)}
                    />
                  }
                  label="Checkbox"
                />

                <Box>
                  <Typography gutterBottom>Radio Group</Typography>
                  <RadioGroup
                    value={radioValue}
                    onChange={(e) => setRadioValue(e.target.value)}
                  >
                    <FormControlLabel
                      value="option1"
                      control={<Radio />}
                      label="Option 1"
                    />
                    <FormControlLabel
                      value="option2"
                      control={<Radio />}
                      label="Option 2"
                    />
                    <FormControlLabel
                      value="option3"
                      control={<Radio />}
                      label="Option 3"
                    />
                  </RadioGroup>
                </Box>

                <Box>
                  <Typography gutterBottom>Slider: {sliderValue}</Typography>
                  <Slider
                    value={sliderValue}
                    onChange={(e, value) => setSliderValue(value)}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </ComponentSection>

        {/* Cards */}
        <ComponentSection title="Cards">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Basic Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This is a simple card with some content and actions.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                  <Button size="small">Share</Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card raised>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Raised Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This card has elevated shadow styling.
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton>
                    <Favorite />
                  </IconButton>
                  <IconButton>
                    <Settings />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card
                sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Colored Card
                  </Typography>
                  <Typography variant="body2">
                    This card uses the primary theme color.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </ComponentSection>

        {/* Data Display */}
        <ComponentSection title="Data Display">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Chips
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="Default" />
                <Chip label="Primary" color="primary" />
                <Chip label="Secondary" color="secondary" />
                <Chip label="Deletable" onDelete={() => {}} />
                <Chip label="Clickable" onClick={() => {}} />
                <Chip label="With Avatar" avatar={<Avatar>A</Avatar>} />
                <Chip label="With Icon" icon={<Star />} />
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Avatars & Badges
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>A</Avatar>
                <Avatar sx={{ bgcolor: "secondary.main" }}>B</Avatar>
                <Avatar src="/api/placeholder/40/40" />
                <Badge badgeContent={4} color="primary">
                  <Avatar>C</Avatar>
                </Badge>
                <Badge badgeContent={99} color="error">
                  <Avatar>D</Avatar>
                </Badge>
                <Badge variant="dot" color="success">
                  <Avatar>E</Avatar>
                </Badge>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Tooltips
              </Typography>
              <Stack direction="row" spacing={2}>
                <Tooltip title="Basic tooltip">
                  <Button>Hover me</Button>
                </Tooltip>
                <Tooltip title="Arrow tooltip" arrow>
                  <Button>With arrow</Button>
                </Tooltip>
                <Tooltip title="Custom placement" placement="top">
                  <Button>Top placement</Button>
                </Tooltip>
              </Stack>
            </Box>
          </Stack>
        </ComponentSection>

        {/* Feedback */}
        <ComponentSection title="Feedback">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Alerts
              </Typography>
              <Stack spacing={2}>
                <Alert severity="success">This is a success alert</Alert>
                <Alert severity="info">This is an info alert</Alert>
                <Alert severity="warning">This is a warning alert</Alert>
                <Alert severity="error">This is an error alert</Alert>
                <Alert severity="success" variant="outlined">
                  Outlined success alert
                </Alert>
                <Alert severity="error" variant="filled">
                  Filled error alert
                </Alert>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Progress Indicators
              </Typography>
              <Stack spacing={2}>
                <LinearProgress />
                <LinearProgress color="secondary" />
                <LinearProgress variant="determinate" value={50} />
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <CircularProgress />
                  <CircularProgress color="secondary" />
                  <CircularProgress variant="determinate" value={75} />
                </Box>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Interactive Elements
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => setSnackbarOpen(true)}
                >
                  Show Snackbar
                </Button>
                <Button variant="contained" onClick={() => setDialogOpen(true)}>
                  Open Dialog
                </Button>
                <Button variant="contained" onClick={() => setDrawerOpen(true)}>
                  Open Drawer
                </Button>
              </Stack>
            </Box>
          </Stack>
        </ComponentSection>

        {/* Navigation */}
        <ComponentSection title="Navigation">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Breadcrumbs
              </Typography>
              <Breadcrumbs>
                <Link underline="hover" color="inherit" href="#">
                  Home
                </Link>
                <Link underline="hover" color="inherit" href="#">
                  Library
                </Link>
                <Typography color="text.primary">Components</Typography>
              </Breadcrumbs>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Tabs
              </Typography>
              <Tabs
                value={tabValue}
                onChange={(e, value) => setTabValue(value)}
              >
                <Tab label="Tab One" />
                <Tab label="Tab Two" />
                <Tab label="Tab Three" />
              </Tabs>
              <Box
                sx={{ p: 2, border: 1, borderColor: "divider", borderTop: 0 }}
              >
                {tabValue === 0 && <Typography>Content for Tab One</Typography>}
                {tabValue === 1 && <Typography>Content for Tab Two</Typography>}
                {tabValue === 2 && (
                  <Typography>Content for Tab Three</Typography>
                )}
              </Box>
            </Box>
          </Stack>
        </ComponentSection>

        {/* Surfaces */}
        <ComponentSection title="Surfaces">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Accordion
              </Typography>
              <Accordion
                expanded={expandedAccordion}
                onChange={() => setExpandedAccordion(!expandedAccordion)}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Accordion Header</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Lists
              </Typography>
              <Paper sx={{ maxWidth: 400 }}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Home />
                    </ListItemIcon>
                    <ListItemText
                      primary="Home"
                      secondary="Navigate to home page"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText
                      primary="Settings"
                      secondary="Manage preferences"
                    />
                  </ListItem>
                  <ListItemButton>
                    <ListItemIcon>
                      <Person />
                    </ListItemIcon>
                    <ListItemText
                      primary="Profile"
                      secondary="View profile information"
                    />
                  </ListItemButton>
                </List>
              </Paper>
            </Box>
          </Stack>
        </ComponentSection>

        {/* Data Grid */}
        <ComponentSection title="Data Tables">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Role</TableCell>
                  <TableCell align="right">Email</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell align="right">Developer</TableCell>
                  <TableCell align="right">john@example.com</TableCell>
                  <TableCell align="right">
                    <Chip label="Active" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jane Smith</TableCell>
                  <TableCell align="right">Designer</TableCell>
                  <TableCell align="right">jane@example.com</TableCell>
                  <TableCell align="right">
                    <Chip label="Pending" color="warning" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bob Johnson</TableCell>
                  <TableCell align="right">Manager</TableCell>
                  <TableCell align="right">bob@example.com</TableCell>
                  <TableCell align="right">
                    <Chip label="Inactive" color="error" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </ComponentSection>

        {/* Layout Examples */}
        <ComponentSection title="Layout Examples">
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Grid System
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    xs=12 sm=6 md=4
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    xs=12 sm=6 md=4
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    xs=12 sm=6 md=4
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Stack Layout
              </Typography>
              <Stack direction="row" spacing={2}>
                <Paper sx={{ p: 2, flex: 1 }}>Item 1</Paper>
                <Paper sx={{ p: 2, flex: 1 }}>Item 2</Paper>
                <Paper sx={{ p: 2, flex: 1 }}>Item 3</Paper>
              </Stack>
            </Box>
          </Stack>
        </ComponentSection>

        {/* Dialogs and Overlays */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Example Dialog</DialogTitle>
          <DialogContent>
            <Typography>
              This is an example dialog with content and actions.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setDialogOpen(false)} variant="contained">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Drawer Content
            </Typography>
            <List>
              <ListItemButton>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </List>
          </Box>
        </Drawer>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="This is a snackbar notification"
        />
      </Container>
    </ThemeProvider>
  );
}
