import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography, AppBar, Toolbar, IconButton, Snackbar, Alert, Slide,
  Tooltip, Badge, Button, Stack, CircularProgress, Menu, MenuItem,
} from "@mui/material";
import SOUNDFILE from "../assets/order_placement_tune.wav";
import WAITERSOUNDFILE from "../assets/reception-bell-14620.mp3";
import ChefService from "../services/ChefService";
import { Logout, Notifications, Visibility } from "@mui/icons-material";
import LocationService from "../services/LocationService";
import LoginService from "../services/LoginService";
import AllOrders from "./AllOrders";
import styles from "../css/OrdersPage.module.css";
import {green, orange} from "@mui/material/colors";
import {useAuthContext} from "../context/authContext.jsx";
import {useSocketContext} from "../socket/socketContext.jsx";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState([]);
  const [role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {user, setUser} = useAuthContext();
  const {socket} = useSocketContext();

  const notificationAudio = new Audio(SOUNDFILE);
  const waiterAudio = new Audio(WAITERSOUNDFILE);

  const navigate = useNavigate();
  const newRole = user ? user.staff_role_name : null;

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("login");
  };
  // Effect hook for fetching data and notifications with timer 3 secs for data & 5 secs for notifications
  useEffect(() => {
    const fetchDataAndNotifications = async () => {
      await fetchData();
      await fetchNotifications();
    };

    if (socket) {
      socket.on("current_order", () => {
        console.log("Here1");
        fetchDataAndNotifications();
      })

      socket.on("Call_Waiter", () => {
        fetchNotifications();
      })

      socket.on("refresh_orders", () => {
        fetchDataAndNotifications();
      })
    }

    fetchDataAndNotifications();
  }, [socket]);

  // Effect hook for fetching role, location, notifications, and data
  useEffect(() => {
    fetchRole();
    fetchLocation();
    fetchNotifications();
    fetchData();
  }, [location]);

  // Function to handle opening snackbar with a message
  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Function to fetch location data
  const fetchLocation = async () => {
    let locationData = await LocationService.getLocation();
    setLocation(locationData);
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    let locationData = await LocationService.getLocation();
    let notifications = await LocationService.getAllNotificationForWeb(
        locationData
    );
    setNotificationData(notifications);

    // Logic for handling new notifications
    const oldNotificatonsCount = JSON.parse(localStorage.getItem("notificationsCount")) || 0;
    const newNotificationsCount = notifications.countAllNotification;
    if (oldNotificatonsCount !== 0) {
      if (newNotificationsCount > oldNotificatonsCount) {
        waiterAudio.play().catch((error) => {
          console.error("Error playing waiter audio:", error);
        });
        const latestNotification = notifications.notificationList[0];

        if (latestNotification.not_type === "Call_Waiter") {
          handleSnackbarOpen(
              `${latestNotification.message} on ${latestNotification.table_name}`
          );
        } else {
          handleSnackbarOpen(`${latestNotification.message}`);
        }

        localStorage.setItem(
            "notificationsCount",
            JSON.stringify(newNotificationsCount)
        );
      }
    } else {
      localStorage.setItem(
          "notificationsCount",
          JSON.stringify(newNotificationsCount)
      );
    }
  };
  // Function to fetch user role
  const fetchRole = async () => {
    let role = LoginService.getRole();
    setRole(role);
  };

  // Function to fetch orders data
  const fetchData = async () => {
    try {
      const response = await ChefService.getAllPrinter();
      if (response.rows.length > 0) {

        const formattedOrders = response.rows.map((row) => ({

          id: row.order_id,
          order_date: row.order_date,
          table_name: row.Table ? row.Table.table_name : null,
          location_name: row.Location ? row.Location.name : null,
          order_total: row.order_total,
          order_tax: row.order_tax,
          order_type:row.order_type,
          order_time: row.order_time,
          status: row.PrinterStatus ? row.PrinterStatus[newRole] : null,
          items: row.OrderMenus.map((menu) => ({
            name: menu.name,
            quantity: menu.quantity,
            price: menu.price,
            subtotal: menu.subtotal,
            options: menu.option_values,
            comment: menu.comment,
            orderOptions: menu.OrderOptions.map((option) => ({
              order_option_id: option.order_option_id,
              order_option_name: option.order_option_name,
              order_option_price: option.order_option_price,
              quantity: option.quantity,
              display_type: option.display_type,
              order_item_tax: option.order_item_tax,
              order_item_tax_percentage: option.order_item_tax_percentage,
              menu_option_type: option.menu_option_type,
              createdAt: option.createdAt,
              updatedAt: option.updatedAt,
            })),
          })),
        }));
        const oldOrdersCount = JSON.parse(localStorage.getItem("ordersCount")) || 0;
        const newOrdersCount = response.count;
        console.log(newOrdersCount, oldOrdersCount);
        if (oldOrdersCount !== 0) {
          if (newOrdersCount > oldOrdersCount) {
            console.log(newOrdersCount, oldOrdersCount, "here2");
            handleSnackbarOpen("New order received!");
            notificationAudio.play().catch((error) => {
              console.error("Error playing notification sound:", error);
            });
            localStorage.setItem("ordersCount", JSON.stringify(newOrdersCount));
          }
        }
        localStorage.setItem("ordersCount", JSON.stringify(newOrdersCount));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle drag and drop end event
  const onDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    setIsUpdating(true);
    try {
      await ChefService.updateOrderStatus(
          location,
          newRole,
          result.draggableId,
          result.destination.droppableId
      );

      await fetchData();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }

    setOrders((prevOrders) => {
      const updatedOrders = [...prevOrders];
      const index = updatedOrders.findIndex(
          (order) => order.id === result.destination.droppableId
      );
      updatedOrders[index] = result.destination.droppableId;
      return updatedOrders;
    });
  };

  // Function to handle notification status update
  const handleNotificationStatusUpdate = async (notification_id) => {
    try {
      await LocationService.updateNavBarNotificationStatus(
          location,
          notification_id
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };


  return (
      <>
        <AppBar position="sticky">
          <Toolbar sx={{backgroundColor: green[800], justifyContent: 'space-between'}}>
            <Typography variant="h5" sx={{fontSize: {xs: '1rem', md: '1.2rem'}, fontWeight: '800', color: 'white'}}>
              Welcome: {role}
            </Typography>
            <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'center', columnGap: {xs: '0.25rem', sm: '1rem'}}}>
              <Tooltip title="Notifications">
                <IconButton size='small' color="inherit" aria-label="bell" onClick={handleClick}>
                  <Badge badgeContent={notificationData?.countNotification} color='primary' sx={{'& .MuiBadge-colorPrimary': {backgroundColor: orange[300], color: 'white'}}}>
                    <Notifications sx={{color: 'white'}}/>
                  </Badge>
                </IconButton>
              </Tooltip>

              <Button
                  startIcon={<Logout />} variant="contained"
                  sx={{backgroundColor: 'transparent', '&:hover': {backgroundColor: 'transparent', boxShadow: 'none'}, color: 'white', boxShadow: 'none'}}
                  aria-label="logout" onClick={handleLogout}>
                <Typography variant="h6" color="inherit" sx={{textTransform: 'capitalize', fontSize: '1rem'}}>Logout</Typography>
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose} style={{maxHeight: "500px"}}>
          {notificationData?.notificationList?.map((notification, nIndex) => (
              <MenuItem key={notification.not_id} sx={{width: '400px', borderTop: '1px solid #b7b7b7', padding: '1rem', borderBottom: (nIndex === notificationData?.notificationList?.length - 1 ? '1px solid #b7b7b7' : 'none')}}>
                <Stack style={{ flexGrow: 1, marginRight: "10px" }}>
                  <Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "5px" }} title={notification.title}>
                    {notification.title}
                  </Typography>

                  <Typography variant="body1" style={{ marginBottom: "5px" }} title={notification.message}>
                    {notification.message}
                  </Typography>

                  <Typography variant="body2" style={{ marginBottom: "5px", color: "#666" }}>
                    {new Date(notification.not_timer).toLocaleString()}
                  </Typography>
                  {notification.table_name && (
                      <Typography variant="body2" style={{ color: "#444", textTransform: 'capitalize' }}>
                        {notification.table_name}
                      </Typography>
                  )}
                </Stack>
                <IconButton color="success" onClick={() => handleNotificationStatusUpdate(notification.not_id)}>
                  <Visibility />
                </IconButton>
              </MenuItem>
          ))}
        </Menu>

        <Stack sx={{alignItems: 'center', justifyContent: 'center', minHeight: '100vh', maxWidth: ('calc(100vw - 0.75rem)'), width: '100vw'}}>
          {isLoading || isUpdating ? (
              <CircularProgress
                  size={50}
                  color="success"
                  aria-label="grid-loading"
              />
          ) : (
              <>
                <AllOrders orders={orders} setOrders={setOrders} setIsUpdating={setIsUpdating} fetchData={fetchData} newRole={newRole} location={location}/>
              </>
          )}
        </Stack>

        {/* Snackbar for displaying success messages */}
        <Snackbar
            className={styles.snackbar}
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={Slide}
            TransitionProps={{
              direction: "left",
            }}
        >
          <Alert
              elevation={6}
              variant="filled"
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              className={styles.alert}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </>
  );
};

export default OrdersPage;
