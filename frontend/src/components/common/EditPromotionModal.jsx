import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DesktopDateTimePicker,
  MobileDateTimePicker,
} from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  Stack,
  Box,
  TextField,
  Button,
  Typography,
  useMediaQuery,
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";

import FormCard from "../../components/common/FormCard.jsx";
import api from "../../api/api.js";
import PeopleIcon from "@mui/icons-material/People";
import { useToast } from "../../context/ToastContext.jsx";

function EditPromotionModal() {
    return <Box>promotion modal goes here</Box>
}

export default EditPromotionModal;