import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Grid,
  Typography,
  AppBar,
  Divider,
  Box,
  Toolbar,
  IconButton,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import { styled } from "@mui/system";
import Image from "../assets/ServAll.png"
import SocketService from "../helpers/socket";
import SOUNDFILE from "../assets/notification.wav";
import ChefService from "../services/ChefService";
import { Logout } from "@mui/icons-material";
import LocationService from "../services/LocationService";
import LoginService from "../services/LoginService";
import PlacedOrders from "./PlacedComponent";
import InProgressOrders from "./InProgressComponent";
import CompletedOrders from "./CompletedComponent";

const Container = styled(Box)(() => ({
  // borderRadius: "10px",

  padding: "8px",
  // cursor: "pointer",
  // overflow: "hidden",
  // border: "1px solid #CED4DA",
}));

const RightAlignedBox = styled(Box)({
  marginLeft: "auto",
});
const LeftAlignedBox = styled(Box)({
  marginRight: "auto",
});
const WelcomeMessage = styled(Typography)({
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#ffff",
});

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState([]);
  const [role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isUpdating, setIsUpdating] = useState(false); 

  const navigate = useNavigate();
  const notificationAudio = new Audio(SOUNDFILE);

  const handleLogout = () => {
    localStorage.clear();
    SocketService.disconnect();

    navigate("login");
  };

  useEffect(() => {
    fetchData();
    console.log("REFETCHING DATA");
    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    // console.log("CURRENTORDERCOMINGORNOT");

    // SocketService.on("current_order", async (data) => {
    //   console.log("CURRENTORDER", data);
    //   console.log("CURRENTORDER", data.order_id);
    //   if (data) {
    //     SocketService.emit("get_order_detail", { order_id: data.order_id });
    //   }

    // });
    // SocketService.on("order", async(data) => {
    //   console.log("ORDER UPDATE", data);
    //   if (data) {
    //   notificationAudio.play();
    //   fetchData();
    //   }
    // });
    //   SocketService.on("current_order", (data) => {

    //  console.log("CURRENTORDER",data);
    //     if (data) {
    //       notificationAudio.play();
    //       fetchData();
    //     }
    //   });
    fetchRole();
    fetchLocation();
    fetchData();
  }, []);

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const fetchLocation = async () => {
    let location = LocationService.getLocation();

    setLocation(location);
  };
  const fetchRole = async () => {
    let role = LoginService.getRole();
    console.log("ROLE", role);
    setRole(role);
  };
  let newRole = localStorage.getItem("staff_role_name");
  console.log("ROLECOMINGTODAY",role);
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
        
        // const formattedOrders = response.rows.map((row) => ({
        //   id: row.order_id,
        //   order_date: row.order_date,
        //   table_name: row.Table?.table_name,
        //   location_name: row.Location.name,
        //   order_total: row.order_total,
        //   order_tax: row.order_tax,
        //   order_time: row.order_time,
        //   status: row.PrinterStatus[newRole],
        //   items: row.OrderMenus.map((menu) => ({
        //     name: menu.name,
        //     quantity: menu.quantity,
        //     price: menu.price,
        //     subtotal: menu.subtotal,
        //     options: menu.option_values,
        //     comment: menu.comment,
        //     orderOptions: menu.OrderOptions.map((option) => ({
        //       order_option_id: option.order_option_id,
        //       order_option_name: option.order_option_name,
        //       order_option_price: option.order_option_price,
        //       quantity: option.quantity,
        //       display_type: option.display_type,
        //       order_item_tax: option.order_item_tax,
        //       order_item_tax_percentage: option.order_item_tax_percentage,
        //       menu_option_type: option.menu_option_type,
        //       createdAt: option.createdAt,
        //       updatedAt: option.updatedAt,
        //     })),
        //   })),
        // }));
        console.log(formattedOrders);

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

  const onDragEnd = async (result) => {
    console.log("Drag result:", result);

    if (!result.destination) {
      return;
    }
    setIsUpdating(true); // Start updating
    try {
      await ChefService.updateOrderStatus(
        location,
newRole,
        result.draggableId,
        result.destination.droppableId
      );

      fetchData();
    }catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false); // Stop updating
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

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          
          <LeftAlignedBox>
            <WelcomeMessage variant="h5" color="inherit">
              Welcome: {role}
            </WelcomeMessage>
          </LeftAlignedBox>
          <RightAlignedBox>
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
          </RightAlignedBox>
        </Toolbar>
      </AppBar>
      {isLoading || isUpdating ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "25rem",
          }}
        >
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
        <Container>
          <br></br>

          <DragDropContext onDragEnd={onDragEnd}>
            <Grid
              container
              justifyContent="center"
              spacing={2}
            
            >
              <PlacedOrders
                orders={orders.filter((order) => order.status === "Placed")}
              />
              <InProgressOrders
                orders={orders.filter(
                  (order) => order.status === "In-progress"
                )}
              />
              <CompletedOrders
                orders={orders.filter((order) => order.status === "Completed")}
              />
            </Grid>
          </DragDropContext>
        </Container>
      )}

      <Snackbar
        sx={{ marginTop: "50px" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Set anchorOrigin to top center
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity="success"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
