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

} from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import { styled } from "@mui/system";
import SocketService from "../helpers/socket";
import SOUNDFILE from "../assets/notification.wav";
import ChefService from "../services/ChefService";
import { Logout } from "@mui/icons-material";
import LocationService from "../services/LocationService";
import LoginService from "../services/LoginService";

const Container = styled(Box)(() => ({
  borderRadius: "10px",

  cursor: "pointer",
  overflow: "hidden",
  border: "1px solid #CED4DA",
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

  const fetchLocation = async () => {
    let location = LocationService.getLocation();

    setLocation(location);
  };
  const fetchRole = async () => {
    let role = LoginService.getRole();
    console.log("ROLE", role);
    setRole(role);
  };
  const fetchData = async () => {
    try {
      const response = await ChefService.getAllPrinter();
    
      if (response.rows.length > 0) {
        const formattedOrders = response.rows.map((row) => ({
          id: row.order_id,
          order_date: row.order_date,
          table_name: row.Table?.table_name,
          location_name: row.Location.name,
          order_total: row.order_total,
          order_tax: row.order_tax,
          order_time: row.order_time,
          status: row.order_status,
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
        if(oldOrdersCount !== 0 ){
          if (newOrdersCount > oldOrdersCount) {
            notificationAudio.play();
            localStorage.setItem("ordersCount", JSON.stringify(newOrdersCount));
          }
        }else{
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

    // Update the status of the order in the database
    try {
      await ChefService.updateOrderStatus(
        location,

        result.draggableId,
        result.destination.droppableId
      );
      
      fetchData();
    } catch (error) {
      console.error("Error updating order status:", error);
    }

    // Update the state to reflect the changes
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
      {isLoading ? ( 
        <div style={{ display: "flex", justifyContent: "center", marginTop: "25rem" }}>
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
          <Grid container justifyContent="center" spacing={2} className="mt-2">
            <Droppable droppableId="placed">
              {(provided) => (
                <Grid item sm={4} md={3} style={{ padding: "8px" }}>
                  <Card style={{ padding: "12px", borderRadius: "10px" }}>
                    <Typography
                      sx={{
                        bgcolor: "#FFD701",
                        fontWeight: "bold",
                        padding: "12px 0",
                      }}
                      variant="h5"
                      align="center"
                    >
                      Placed
                    </Typography>
                    <div
                     style={{ height: "200vh" }} 
                      className="orders-container mt-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {orders
                        .filter((order) => order.status === "Placed")
                        .map((order, index) => (
                          <Draggable
                            key={order.id.toString()}
                            draggableId={order.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  variant="outlined"
                                  style={{
                                
                                    boxShadow: snapshot.isDragging
                                      ? "0px 4px 20px rgba(0, 0, 0, 0.2)"
                                      : "none",
                                    backgroundColor: snapshot.isDragging
                                      ? "#f4ffc1"
                                      : "inherit",
                                    marginBottom: "12px",
                                    marginTop: "12px",
                                    border: "1px solid black",
                                    borderRadius: "8px",
                                    padding: "5px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      background: "#FFD701",
                                      borderRadius: "8px",
                                      marginBottom: "12px",
                                      padding: "12px",
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {order?.table_name}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                      {order.order_time}
                                    </Typography>
                                  </Box>
                               
                                  {order.items.map((item, index) => (
                                    <>
                                    <div
                                      key={index}
                                      style={{
                                        padding: "12px 0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <Typography
                                          variant="subtitle1"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          {item.name}
                                        </Typography>
                                      </div>
                                      <div>
                                        <Typography
                                          variant="subtitle1"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          x{item.quantity}
                                        </Typography>




                                        
                                      </div>
                                      
                                    </div>
                                    <Divider />
                                    {item?.orderOptions.map((item, index2) => (
    <div
        key={index2}
        style={{
            
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}
    >
        <div>
            <Typography
                variant="subtitle1"
           
            >
                {item.order_option_name}
            </Typography>
        </div>
        <div>
            <Typography
                variant="subtitle1"
                style={{ fontWeight: "bold" }}
            >
                x{item.quantity}
            </Typography>
        </div>
    </div>
))}
                                    </>
                                  ))}
                                  
                                  
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </Card>
                </Grid>
              )}
            </Droppable>

            <Droppable droppableId="In-progress">
              {(provided) => (
                <Grid item sm={4} md={3} style={{ padding: "8px" }}>
                  <Card style={{ padding: "12px", borderRadius: "10px" }}>
                    <Typography
                      sx={{
                        bgcolor: "#28C76F",
                        fontWeight: "bold",
                        padding: "12px 0",
                      }}
                      variant="h5"
                      align="center"
                    >
                      In Progress
                    </Typography>
                    <div
                      style={{ height: "200vh" }} 
                      className="orders-container mt-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {orders
                        .filter((order) => order.status === "In-progress")
                        .map((order, index) => (
                          <Draggable
                            key={order.id.toString()}
                            draggableId={order.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  variant="outlined"
                                  style={{
                                    boxShadow: snapshot.isDragging
                                      ? "0px 4px 20px rgba(0, 0, 0, 0.2)"
                                      : "none",
                                    backgroundColor: snapshot.isDragging
                                      ? "#d4ffc4"
                                      : "inherit",
                                    marginBottom: "12px",
                                    marginTop: "12px",
                                    border: "1px solid black",
                                    borderRadius: "8px",
                                    padding: "5px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      background: "#28C76F",
                                      borderRadius: "8px",
                                      marginBottom: "12px",
                                      padding: "12px",
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {order?.table_name}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                      {order.order_time}
                                    </Typography>
                                  </Box>
                                  
                              
                                    {order.items.map((item, index) => (
                                    <>
                                    <div
                                      key={index}
                                      style={{
                                        padding: "12px 0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <Typography
                                          variant="subtitle1"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          {item.name}
                                        </Typography>
                                      </div>
                                      <div>
                                        <Typography
                                          variant="subtitle1"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          x{item.quantity}
                                        </Typography>




                                        
                                      </div>
                                      
                                    </div>
                                    <Divider />
                                    {item?.orderOptions.map((item, index) => (
    <div
        key={index}
        style={{
            
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}
    >
        <div>
            <Typography
                variant="subtitle1"
           
            >
                {item.order_option_name}
            </Typography>
        </div>
        <div>
            <Typography
                variant="subtitle1"
                style={{ fontWeight: "bold" }}
            >
                x{item.quantity}
            </Typography>
        </div>
    </div>
))}
                                    </>
                                  ))}
                                  
                                  
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </Card>
                </Grid>
              )}
            </Droppable>
            <Droppable droppableId="Completed">
              {(provided) => (
                <Grid item sm={4} md={3} style={{ padding: "8px" }}>
                  <Card style={{ padding: "12px", borderRadius: "10px" }}>
                    <Typography
                      sx={{
                        bgcolor: "#B8C2CC",
                        fontWeight: "bold",
                        padding: "12px 0",
                      }}
                      variant="h5"
                      align="center"
                    >
                      Completed
                    </Typography>
                    <div
                      style={{ height: "200vh" }} 
                      className="orders-container mt-2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {orders
                        .filter((order) => order.status === "Completed")
                        .map((order, index) => (
                          <Draggable
                            key={order.id.toString()}
                            draggableId={order.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card
                                  variant="outlined"
                                  style={{
                                    boxShadow: snapshot.isDragging
                                      ? "0px 4px 20px rgba(0, 0, 0, 0.2)"
                                      : "none",
                                    backgroundColor: snapshot.isDragging
                                      ? "#efefef"
                                      : "inherit",
                                    marginBottom: "12px",
                                    marginTop: "12px",
                                    border: "1px solid black",
                                    borderRadius: "8px",
                                    padding: "5px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      background: "#B8C2CC",
                                      borderRadius: "8px",
                                      marginBottom: "12px",
                                      padding: "12px",
                                    }}
                                  >
                                    <Typography
                                      variant="h6"
                                      style={{ fontWeight: "bold" }}
                                    >
                                      {order?.table_name}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                      {order.order_time}
                                    </Typography>
                                  </Box>
                                  <Divider />
                                  {order.items.map((item, index) => (
                                    <>
                                    <div
                                      key={index}
                                      style={{
                                        padding: "12px 0",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <div>
                                        <Typography
                                          variant="subtitle1"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          {item.name}
                                        </Typography>
                                      </div>
                                      <div>
                                        <Typography
                                          variant="subtitle1"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          x{item.quantity}
                                        </Typography>




                                        
                                      </div>
                                      
                                    </div>
                                    <Divider />
                                    {item?.orderOptions.map((item, index) => (
    <div
        key={index}
        style={{
            
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}
    >
        <div>
            <Typography
                variant="subtitle1"
           
            >
                {item.order_option_name}
            </Typography>
        </div>
        <div>
            <Typography
                variant="subtitle1"
                style={{ fontWeight: "bold" }}
            >
                x{item.quantity}
            </Typography>
        </div>
    </div>
))}
                                    </>
                                  ))}
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </Card>
                </Grid>
              )}
            </Droppable>
          </Grid>
        </DragDropContext>
      </Container>
      )}
    </>
  );
};

export default Profile;
