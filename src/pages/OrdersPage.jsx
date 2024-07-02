import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Typography,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  Accordion,
  AccordionDetails,
  Slide,
  Paper,
} from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import SOUNDFILE from "../assets/notification.wav";
import WAITERSOUNDFILE from "../assets/reception-bell-14620.mp3";
import ChefService from "../services/ChefService";
import { Logout, Notifications, Visibility } from "@mui/icons-material";
import LocationService from "../services/LocationService";
import LoginService from "../services/LoginService";
import AllOrders from "./AllOrders";
import styles from "../css/OrdersPage.module.css"; // Import the CSS module

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState([]);
  const [role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const navigate = useNavigate();
  const notificationAudio = new Audio(SOUNDFILE);
  const waiterAudio = new Audio(WAITERSOUNDFILE);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const newRole = userData ? userData.staff_role_name : null;

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("login");
  };
  // Effect hook for fetching data and notifications with timer 3 secs for data & 5 secs for notifications
  useEffect(() => {
    const fetchDataAndNotifications = async () => {
      await fetchData();
      const fetchDataIntervalId = setInterval(fetchData, 3000);
      await fetchNotifications();
      const fetchNotificationsIntervalId = setInterval(
        fetchNotifications,
        5000
      );
      return () => {
        clearInterval(fetchDataIntervalId);
        clearInterval(fetchNotificationsIntervalId);
      };
    };

    fetchDataAndNotifications();
  }, []);

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
    const oldNotificatonsCount =
      JSON.parse(localStorage.getItem("notificationsCount")) || 0;
    const newNotificationsCount = notifications.countAllNotification;
    if (oldNotificatonsCount !== 0) {
      if (newNotificationsCount > oldNotificatonsCount) {
        waiterAudio.play();
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
      console.log("RESPONSE", response);
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
        const oldOrdersCount =
          JSON.parse(localStorage.getItem("ordersCount")) || 0;
        const newOrdersCount = response.count;
        if (oldOrdersCount !== 0) {
          if (newOrdersCount > oldOrdersCount) {
            handleSnackbarOpen("New order received!");
            notificationAudio.play();
            localStorage.setItem("ordersCount", JSON.stringify(newOrdersCount));
          }
        } else {
          localStorage.setItem("ordersCount", JSON.stringify(newOrdersCount));
        }
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle bell icon click for opening/closing notifications accordion
  const handleBellClick = () => {
    setAccordionOpen(!accordionOpen);
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

  // JSX rendering using css modules
  return (
    <>
      <AppBar position="sticky">
        <Toolbar className={styles.toolbar}>
          <Box className={styles.leftAlignedBox}>
            <Typography
              variant="h5"
              color="inherit"
              className={styles.welcomeMessage}
            >
              Welcome: {role}
            </Typography>
          </Box>
          <Box className={styles.rightAlignedBox}>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="bell"
              onClick={handleBellClick}
              style={{ position: "relative", marginRight: "10px" }}
            >
              {notificationData?.countNotification > 0 && (
                <sup className={styles.notificationCount}>
                  {notificationData?.countNotification}
                </sup>
              )}
              <Notifications />
            </IconButton>

            <IconButton
              edge="end"
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
            >
              <Logout />
              <Typography variant="h5" color="inherit">
                Logout
              </Typography>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Accordion
        expanded={accordionOpen}
        style={{
          position: "fixed",
          top: "80px",
          right: "20px",
          maxHeight: "500px",
          overflowY: "auto",
          zIndex: "1000",
          backgroundColor: "#fff",
          display: accordionOpen ? "block" : "none",
        }}
      >
        <AccordionDetails style={{ display: "flex", flexDirection: "column" }}>
          <Typography>
            {notificationData?.notificationList?.map((notification) => (
              <Paper
                key={notification.not_id}
                elevation={3}
                className={styles.notificationPaper}
              >
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: "bold", marginBottom: "5px" }}
                    title={notification.title}
                  >
                    {notification.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    style={{ marginBottom: "5px" }}
                    title={notification.message}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ marginBottom: "5px", color: "#666" }}
                  >
                    {new Date(notification.not_timer).toLocaleString()}
                  </Typography>
                  {notification.table_name && (
                    <Typography variant="body2" style={{ color: "#444" }}>
                      {notification.table_name}
                    </Typography>
                  )}
                </div>
                <IconButton
                  color="primary"
                  onClick={() =>
                    handleNotificationStatusUpdate(notification.not_id)
                  }
                >
                  <Visibility />
                </IconButton>
              </Paper>
            ))}
          </Typography>
        </AccordionDetails>
      </Accordion>

      {isLoading || isUpdating ? (
        <div className={styles.loaderContainer}>
          <RotatingLines
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass="grid-wrapper"
          />
        </div>
      ) : (
        <Box className={styles.container}>
          <br></br>

          {/* Drag and drop context for orders */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid container justifyContent="center" spacing={2}>
              {/* Component for displaying orders */}
              <AllOrders title="Placed" orders={orders} droppableId="placed" />
              <AllOrders
                title="In Progress"
                orders={orders}
                droppableId="In-Progress"
              />
              <AllOrders
                title="Completed"
                orders={orders}
                droppableId="completed"
                Í
              />
            </Grid>
          </DragDropContext>
        </Box>
      )}

      {/* Snackbar for displaying success messages */}
      <Snackbar
        className={styles.snackbar}
        open={snackbarOpen}
        autoHideDuration={4000}
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
