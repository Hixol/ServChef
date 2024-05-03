

import  { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { Card, Grid, Typography, AppBar,Divider,Box,Toolbar,IconButton } from "@mui/material";
import { styled } from "@mui/system";
import SocketService from "../helpers/socket"
import SOUNDFILE from "../assets/sound.mp3"
import ChefService from "../services/ChefService";
import { Logout } from "@mui/icons-material";
import LocationService from "../services/LocationService";




  
  
  const Container = styled(Box)(() => ({
    borderRadius: "10px",
 
    cursor: "pointer",
    overflow: "hidden",
    border: "1px solid #CED4DA"
  }));
  
  const RightAlignedBox = styled(Box)({
    marginLeft: "auto",
  });
  
  
 
  




const Profile = () => {

  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState([]);

  const navigate = useNavigate();
  const notificationAudio = new Audio(SOUNDFILE);

  const handleLogout = () => {
    localStorage.clear();
    SocketService.disconnect()

    navigate("login");
  };



  useEffect(() => {
    console.log("CURRENTORDERCOMINGORNOT");

    SocketService.on("current_order", (data) => {
    
   console.log("CURRENTORDER",data);
      if (data) {
        notificationAudio.play();
        fetchData();
      }
    });

    fetchLocation()
    fetchData();

  }, []);
  
const fetchLocation = async() => {
  let location = LocationService.getLocation();
    
  setLocation(location)
}

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
     
        setOrders(formattedOrders);
   
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onDragEnd = async (result) => {
    console.log("Drag result:", result);
  
   
    // Dropped outside the droppable area
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
    <Container >
              <br></br>
   
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container justifyContent="center" spacing={2} className="mt-2">
      
          <Droppable droppableId="placed">
  {(provided) => (
  <Grid item sm={4} md={3} style={{ padding: '8px' }}>
  <Card style={{ padding: '12px', borderRadius: '10px',}}> 
    <Typography
      sx={{ bgcolor: '#FFD701',fontWeight:"bold", padding: '12px 0' }}
      variant="h5"
      align="center"
    >
      Placed
    </Typography>
    <div
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
            {(provided,snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                
              >
              <Card 
              
              variant="outlined" style={{ 
                boxShadow: snapshot.isDragging ? '0px 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
                backgroundColor: snapshot.isDragging ? '#f4ffc1' : 'inherit',
                marginBottom: '12px', marginTop: "12px", border: '1px solid black', borderRadius: '8px', padding:"5px"}}>
  <Box sx={{ background: "#FFD701", borderRadius: '8px', marginBottom: '12px', padding: '12px' }}> 
    <Typography variant="h6" style={{ fontWeight: "bold", }}> 
      {order?.table_name}
    </Typography>
    <Typography variant="subtitle2" > 
      {order.order_time}
    </Typography>
  </Box>
  <Divider />
  {order.items.map((item, index) => (
    <div key={index} style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          {item.name}
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          x{item.quantity}
        </Typography>
      </div>
    </div>
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
  <Grid item sm={4} md={3} style={{ padding: '8px' }}>
  <Card style={{ padding: '12px', borderRadius: '10px',}}> 
    <Typography
      sx={{ bgcolor: '#28C76F',fontWeight:"bold", padding: '12px 0' }}
      variant="h5"
      align="center"
    >
      In Progress
    </Typography>
    <div
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
            {(provided,snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                  <Card variant="outlined" style={{ 
                         boxShadow: snapshot.isDragging ? '0px 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
                         backgroundColor: snapshot.isDragging ? '#d4ffc4' : 'inherit',
                    marginBottom: '12px', marginTop: "12px", border: '1px solid black', borderRadius: '8px', padding:"5px"}}>
  <Box sx={{ background: "#28C76F", borderRadius: '8px', marginBottom: '12px', padding: '12px' }}> 
    <Typography variant="h6" style={{ fontWeight: "bold", }}> 
      {order?.table_name}
    </Typography>
    <Typography variant="subtitle2" > 
      {order.order_time}
    </Typography>
  </Box>
  <Divider />
  {order.items.map((item, index) => (
    <div key={index} style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          {item.name}
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          x{item.quantity}
        </Typography>
      </div>
    </div>
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
  <Grid item sm={4} md={3} style={{ padding: '8px' }}>
  <Card style={{ padding: '12px', borderRadius: '10px',}}> 
    <Typography
      sx={{ bgcolor: '#B8C2CC',fontWeight:"bold",  padding: '12px 0' }}
      variant="h5"
      align="center"
    >
      Completed
    </Typography>
    <div
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
            {(provided,snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                      <Card variant="outlined" style={{ 
                             boxShadow: snapshot.isDragging ? '0px 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
                             backgroundColor: snapshot.isDragging ? '#efefef' : 'inherit',
                        marginBottom: '12px', marginTop: "12px", border: '1px solid black', borderRadius: '8px', padding:"5px"}}>
  <Box sx={{ background: "#B8C2CC", borderRadius: '8px', marginBottom: '12px', padding: '12px' }}> 
    <Typography variant="h6" style={{ fontWeight: "bold", }}> 
      {order?.table_name}
    </Typography>
    <Typography variant="subtitle2" > 
      {order.order_time}
    </Typography>
  </Box>
  <Divider />
  {order.items.map((item, index) => (
    <div key={index} style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          {item.name}
        </Typography>
      </div>
      <div>
        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
          x{item.quantity}
        </Typography>
      </div>
    </div>
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
    </>
  );
};

export default Profile;

