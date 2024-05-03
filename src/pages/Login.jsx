// import { useState, useLayoutEffect } from "react";
// import { useNavigate } from "react-router";
// import handleApiCall from "../services/HandleAPiCall";
// import { Typography, TextField, Button } from "@mui/material"; // Import Material-UI components
// // import Avatar from '@mui/material/Avatar';
// import CssBaseline from '@mui/material/CssBaseline';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// // import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { RotatingTriangles } from "react-loader-spinner";
// import Image from "../assets/ServAll.png"
// import Image2 from "../assets/1-28.png"


// const Login = () => {
//   const [formData, setFormData] = useState({
//     userName: "",
//     password: "",
//     tab_device_token: "123", 
//     is_tab_login: true, 
//   });
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleOnChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };
  
  

//   const handleSubmit = () => {
//     setLoading(true);
//     handleApiCall({
//       data: formData,
//       cb: (data, status) => {
//         if (status === 200) {
//           console.log("DATA COMING", data);
//           localStorage.setItem("token", data.token);
//           localStorage.setItem("role", JSON.stringify(data.role));
//           localStorage.setItem("assignedLocations", JSON.stringify(data.assignedLocations));
//           localStorage.setItem("layout_setting", JSON.stringify(data.layout_setting));
//           localStorage.setItem("staff_role_name", data.staff_role_name);
//           localStorage.setItem("location", data.layout_setting.loc_id);
       
//           window.location.href = "/";
//         }
//       },
//       setLoading,
//     });
//   };

//   useLayoutEffect(() => {
//     const loggedToken = localStorage.getItem("token") || null;
//     if (loggedToken) {
//       navigate("/");
//     }
//   }, []);

//   if (loading) {
//     <> <RotatingTriangles
//     visible={true}
//     height="80"
//     width="80"
//     color="#4fa94d"
//     ariaLabel="rotating-triangles-loading"
//     wrapperStyle={{}}
//     wrapperClass=""
//     /></>
   
    

   
    
//   }
//   const defaultTheme = createTheme();

//   return (
//     <ThemeProvider theme={defaultTheme}>
//       <Grid container component="main" sx={{ height: '100vh' }}>
//         <CssBaseline />
//         <Grid
//           item
//           xs={false}
//           sm={4}
//           md={7}
//           sx={{
//             backgroundImage: 'url(https://servall.be/wp-content/uploads/2023/11/1-28.png)',
//             backgroundRepeat: 'no-repeat',
//             backgroundColor: (t) =>
//               t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
//             backgroundSize: 'contain',
//             backgroundPosition: 'center',
//           }}
//         />
//         <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
//           <Box
//             sx={{
//               my: 8,
//               mx: 4,
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//             }}
//           >
          
//             <Box
//   component="img"
//   sx={{
//     height: 100,
//     width: 200,
//     maxHeight: { xs: 233, md: 167 },
//     maxWidth: { xs: 350, md: 250 },
//   }}
//   alt="The house from the offer."
//   src={Image}
// />
//             <Typography component="h1" variant="h5">
//               Sign in
//             </Typography>
//             <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
//               <TextField
//                 id="userName"
//                 label="Email"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.userName}
//                 onChange={(e) => handleOnChange(e)}
//                 style={{ marginBottom: "20px" }}
//               />
//               <TextField
//                 id="password"
//                 label="Password"
//                 type="password"
//                 variant="outlined"
//                 fullWidth
//                 value={formData.password}
//                 onChange={(e) => handleOnChange(e)}
//                 style={{ marginBottom: "20px" }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSubmit}
//                 style={{ padding: "8px 20px", fontSize: "16px" }}
//               >
//                 Login
//               </Button>
//             </Box>
//           </Box>
//         </Grid>
//       </Grid>
//     </ThemeProvider>
//   );
// };

// export default Login;
import { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router";
import handleApiCall from "../services/HandleAPiCall";
import { Typography, TextField, Button, Snackbar, CircularProgress } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from "../assets/ServAll.png";

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
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleApiError = (errorMessage) => {
    setError(errorMessage);
    setOpenSnackbar(true);
    setLoading(false);
  };

  const handleSubmit = () => {
    setLoading(true);
    handleApiCall({
      data: formData,
      cb: (data, status) => {
        if (status === 200) {
          console.log("DATA COMING", data);
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", JSON.stringify(data.role));
          localStorage.setItem("assignedLocations", JSON.stringify(data.assignedLocations));
          localStorage.setItem("layout_setting", JSON.stringify(data.layout_setting));
          localStorage.setItem("staff_role_name", data.staff_role_name);
          localStorage.setItem("location", data.layout_setting.loc_id);
          window.location.href = "/";
        } else {
          handleApiError("Login failed. Please check your credentials.");
        }
      },
      setLoading,
      onError: (error) => handleApiError("Failed to connect to the server."),
    });
  };

  useLayoutEffect(() => {
    const loggedToken = localStorage.getItem("token") || null;
    if (loggedToken) {
      navigate("/");
    }
  }, []);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://servall.be/wp-content/uploads/2023/11/1-28.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              sx={{
                height: 100,
                width: 200,
                maxHeight: { xs: 233, md: 167 },
                maxWidth: { xs: 350, md: 250 },
              }}
              alt="The house from the offer."
              src={Image}
            />
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                id="userName"
                label="Email"
                variant="outlined"
                fullWidth
                value={formData.userName}
                onChange={(e) => handleOnChange(e)}
                style={{ marginBottom: "20px" }}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={(e) => handleOnChange(e)}
                style={{ marginBottom: "20px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ padding: "8px 20px", fontSize: "16px", position: 'relative' }}
                disabled={loading}
              >
                {loading && <CircularProgress size={24} style={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }} />}
                {!loading && 'Login'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="error">
          {error}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Login;
