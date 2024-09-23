import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import handleApiCall from "../services/HandleAPiCall";
import {
  Typography,
  TextField,
  Button,
  Snackbar,
  InputAdornment,
  IconButton,
  Paper,
  Box,
  CssBaseline,
  createTheme,
  ThemeProvider, Grid2, CircularProgress,
} from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Image from "../assets/ServAll.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import styles from "../css/Login.module.css";
import {useAuthContext} from "../context/authContext.jsx";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    tab_device_token: "123",
    is_tab_login: true,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const {setUser} = useAuthContext();

  // Function to handle input changes
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  // Function to handle API errors
  const handleApiError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };
  // Function to handle form submission
  const handleSubmit = () => {
    if (!formData.userName || !formData.password) {
      setFormError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    handleApiCall({
      data: formData,
      cb: handleApiResponse,// Callback function for API response handling
      setLoading,
      onError: () => handleApiError("Failed to connect to the server."),// Error handling for API call failure
    });
  };

  // Function to handle API response
  const handleApiResponse = (data, status) => {
    if (status === 200) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data));
      navigate("/");
      setUser(data);
    } else {
      handleApiError("Login failed. Please check your credentials.");
    }
  };
  // Effect hook to check if user is already logged in
  useEffect(() => {
    const loggedToken = localStorage.getItem("token");
    if (loggedToken) {
      navigate("/");
    }
  }, [navigate]);

  // Function to handle close event of Snackbar for form errors
  const handleSnackbarClose = () => {
    setError(null);
  };
  // Function to handle close event of Snackbar for general errors
  const handleFormErrorClose = () => {
    setFormError(null);
  };


  // Rendering JSX using CSS modules for styling
  return (
      <ThemeProvider theme={createTheme()}>
        <Grid2 container component="main" className={styles.loginRoot}>
          <CssBaseline />
          <Grid2 size={{xs: 0, sm: 6, md: 7}} className={styles.loginBackgroundImage} />
          <Grid2 size={{xs: 12, sm: 6, md: 5}} component={Paper} elevation={6} square>
            <Box className={styles.loginContentBox}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Welcome To
              </Typography>
              <Box component="img" className={styles.loginLogo} alt="ServAll Logo" src={Image} />
              <form noValidate onSubmit={handleSubmit} style={{ width: "80%", rowGap: '0.5rem', display: "flex", flexDirection: "column" }}>
                <TextField
                    color="success"
                    id="userName" label="Email" variant="outlined" fullWidth value={formData.userName}
                    onChange={handleOnChange} aria-label="Username"/>
                <TextField
                    color="success"
                    id="password" label="Password" type={showPassword ? "text" : "password"} variant="outlined"
                    fullWidth value={formData.password} onChange={handleOnChange}
                    slotProps={{
                      input: {
                        endAdornment:
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </InputAdornment>
                        ,
                      },
                    }}
                    aria-label="Password"
                />
                <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-end" } }}>
                  <Button color='success' startIcon={loading && <CircularProgress size={20} color='success' aria-label="grid-loading" />} variant="contained" onClick={handleSubmit} disabled={loading} className={styles.loginButton}>
                    Login
                  </Button>
                </Box>
              </form>
              <Snackbar
                  open={!!formError}
                  autoHideDuration={6000}
                  onClose={handleFormErrorClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <MuiAlert elevation={6} variant="filled" onClose={handleFormErrorClose} severity="error">
                  {formError}
                </MuiAlert>
              </Snackbar>
            </Box>
          </Grid2>
        </Grid2>
        <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      </ThemeProvider>
  );
};

export default Login;
