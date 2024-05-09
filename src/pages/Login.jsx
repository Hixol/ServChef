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
import { Typography, TextField, Button, Snackbar, CircularProgress,  InputAdornment,IconButton } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from "../assets/ServAll.png";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { RotatingLines } from "react-loader-spinner";

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
  const [showPassword, setShowPassword] = useState(false);

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
      onError: () => handleApiError("Failed to connect to the server."),
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
    sm={6}
    md={7}
    sx={{
      backgroundImage: 'url(https://www.bdtask.com/sp/cloud-kitchen/img/cloud-kitchen-management-system/cloud-kitchen-pos-system.webp)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:"#228B22",
      // backgroundColor: (t) =>
      //   t.palette.mode === 'dark' ? t.palette.grey[50] : t.palette.grey[900],
      backgroundSize: { sm: 'contain', md: 'contain' },
      backgroundPosition: 'center',
    }}
  />
  <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square>
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50%',
      }}
    >
      <Typography component="h1" variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
Welcome To
</Typography>

      <Box
        component="img"
        sx={{
          height: 100,
          width: 200,
          maxHeight: { xs: 333, md: 167 },
          maxWidth: { xs: 350, md: 250 },
          marginBottom: 4,
        }}
        alt="ServAll Logo"
        src={Image}
      />
    
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '80%' }}>
        <TextField
          id="userName"
          label="Email"
          variant="outlined"
          fullWidth
          value={formData.userName}
          onChange={(e) => handleOnChange(e)}
          sx={{ marginBottom: 2 }}
        />
           <TextField
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          value={formData.password}
          onChange={(e) => handleOnChange(e)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: { sm: 'center', md: 'flex-end' },}}>
          {!loading && (
          <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
              padding: "8px 20px",
              fontSize: "16px",
              backgroundColor: "#228B22",
              position: 'relative',
              overflow: 'hidden', 
              marginRight: 1,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", 
              '&:hover': {
                  backgroundColor: "#228B22", 
                  boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)",
              }
          }}
      >
          Login
      </Button>
      
          )}
          {loading && (
               <RotatingLines
               visible={true}
               height="50"
               width="50"
               color="#4fa94d"
               ariaLabel="grid-loading"
               radius="12.5"
               
               wrapperStyle={{}}
               wrapperClass="grid-wrapper"
               />
         
          )}
        </Box>
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
