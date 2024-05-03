import  { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import { Card, Grid, Typography, AppBar,Divider,Box,Toolbar,IconButton } from "@mui/material";
import { styled } from "@mui/system";
import SocketService from "../helpers/socket"
import SOUNDFILE from "../assets/sound.mp3"

import ChefService from "../services/ChefService";
import { Logout } from "@mui/icons-material";



  const WelcomeText = styled(Typography)(({ theme }) => ({
    fontSize: "30px",
    color: "tomato",
    fontWeight: "bold",
    marginTop: theme.spacing(2),
  }));
  
  
  const Container = styled(Box)(() => ({
    borderRadius: "10px",
 
    cursor: "pointer",
    overflow: "hidden",
    border: "1px solid #CED4DA"
  }));
  
  const RightAlignedBox = styled(Box)({
    marginLeft: "auto",
  });
  
  
 
  




const DessertManagerDashboard = () => {

  const [orders, setOrders] = useState([]);
  const [location, setLocation] = useState(8);

  const navigate = useNavigate();
  

  const handleLogout = () => {
    localStorage.clear();
    // SocketService.disconnect()

    navigate("/login");
  };

  function notificationSound(){
    console.log("HELLO SOUND");
   
  const notificationAudio = new Audio(SOUNDFILE).play();
  console.log("NOTIFICATION",notificationAudio);
    
  }


  useEffect(() => {
    
    notificationSound()
    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);
  

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
       <AppBar position="static">
        <Toolbar>
          <RightAlignedBox>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
              sx={{ fontSize: 52 }} // Increase the size of the icon
            >
              <Logout />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Logout
            </Typography>
          </RightAlignedBox>
        </Toolbar>
      </AppBar>
    <Container >
              
        <WelcomeText variant="h4">Welcome </WelcomeText>
      <Typography
        variant="h1"
        align="center"
        style={{ fontWeight: "bold" }}
        className="text-center"
      >
        <span className="text-primary">Serv</span>
        <span style={{ fontSize: "32px" }} className="text-warning ">
          Chef
        </span>
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container justifyContent="center" spacing={2} className="mt-2">
          {/* Placed Column */}
          <Droppable droppableId="placed">
            {(provided,snapshot) => (
                 console.log("HELLO SOUND"),
              <Grid item sm={4} md={3}>
                <Card >
                  <Typography
                    variant="h4"
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
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card >
                                <div >
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {order?.table_name}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                   
                                    {order.order_time}
                                  </Typography>
                                </div>
                                <Divider />
                                {order.items.map((item, index) => (
                                        <div key={index}>
                                          <div className="justify-content-between d-flex">
                                            <h6 style={{ fontWeight: "bold" }}>
                                              {item.name}
                                            </h6>
                                            <h6 style={{ fontWeight: "bold" }}>
                                              x{item.quantity}
                                            </h6>
                                          </div>
                                          <div
                                            style={{
                                              marginTop: "10px",
                                            }}
                                          >
                                            {item.orderOptions.map(
                                              (option, optIndex) => (
                                                <h6
                                                  key={optIndex}
                                                  style={{
                                                    margin: "0",

                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  <div className="justify-content-between d-flex">
                                                    <h6
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {option.order_option_name}
                                                    </h6>
                                                    x{option.quantity}
                                                  </div>
                                                </h6>
                                              )
                                            )}
                                          </div>

                                          {index < order.items.length - 1 && (
                                            <hr />
                                          )}
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
            {(provided,snapshot) => (
                 console.log("Provided:", provided),
                 console.log("Snapshot:", snapshot),
              <Grid item sm={4} md={3}>
                <Card >
                  <Typography
                    variant="h4"
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
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card >
                                <div >
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {order?.table_name}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                   
                                  {order.items.map((item, index) => (
                                        <div key={index}>
                                          <div className="justify-content-between d-flex">
                                            <h6 style={{ fontWeight: "bold" }}>
                                              {item.name}
                                            </h6>
                                            <h6 style={{ fontWeight: "bold" }}>
                                              x{item.quantity}
                                            </h6>
                                          </div>
                                          <div
                                            style={{
                                              marginTop: "10px",
                                            }}
                                          >
                                            {item.orderOptions.map(
                                              (option, optIndex) => (
                                                <h6
                                                  key={optIndex}
                                                  style={{
                                                    margin: "0",

                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  <div className="justify-content-between d-flex">
                                                    <h6
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {option.order_option_name}
                                                    </h6>
                                                    x{option.quantity}
                                                  </div>
                                                </h6>
                                              )
                                            )}
                                          </div>

                                          {index < order.items.length - 1 && (
                                            <hr />
                                          )}
                                        </div>
                                      ))}
                                  </Typography>
                                </div>
                                <Divider />
                                {/* Render items */}
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
            {(provided,snapshot) => (
                 console.log("Provided:", provided),
                 console.log("Snapshot:", snapshot),
              <Grid item sm={4} md={3}>
                <Card >
                  <Typography
                    variant="h4"
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
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Grid >
                                <div >
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {order?.table_name}
                                  </Typography>
                                  <Typography variant="subtitle2">
                                   
                                    {order.order_time}
                                  </Typography>
                                </div>
                                <Divider />
                                {order.items.map((item, index) => (
                                        <div key={index}>
                                          <div className="justify-content-between d-flex">
                                            <h6 style={{ fontWeight: "bold" }}>
                                              {item.name}
                                            </h6>
                                            <h6 style={{ fontWeight: "bold" }}>
                                              x{item.quantity}
                                            </h6>
                                          </div>
                                          <div
                                            style={{
                                              marginTop: "10px",
                                            }}
                                          >
                                            {item.orderOptions.map(
                                              (option, optIndex) => (
                                                <h6
                                                  key={optIndex}
                                                  style={{
                                                    margin: "0",

                                                    fontWeight: "bold",
                                                  }}
                                                >
                                                  <div className="justify-content-between d-flex">
                                                    <h6
                                                      style={{
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      {option.order_option_name}
                                                    </h6>
                                                    x{option.quantity}
                                                  </div>
                                                </h6>
                                              )
                                            )}
                                          </div>

                                          {index < order.items.length - 1 && (
                                            <hr />
                                          )}
                                        </div>
                                      ))}
                              </Grid>
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

export default DessertManagerDashboard;

// import { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import ChefService from "../services/ChefService";
// import { Card, Col, Row } from "reactstrap";


// const DessertManagerDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [location, setLocation] = useState(8);
 

//   useEffect(() => {
//     fetchData();
//     const intervalId = setInterval(fetchData, 10000);

//     return () => clearInterval(intervalId);
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await ChefService.getAllPrinter();
//       if (response.rows.length > 0) {
//         const formattedOrders = response.rows.map((row) => ({
//           id: row.order_id,
//           order_date: row.order_date,
//           table_name: row.Table?.table_name,
//           location_name: row.Location.name,
//           order_total: row.order_total,
//           order_tax: row.order_tax,
//           order_time: row.order_time,
//           status: row.order_status,
//           items: row.OrderMenus.map((menu) => ({
//             name: menu.name,
//             quantity: menu.quantity,
//             price: menu.price,
//             subtotal: menu.subtotal,
//             options: menu.option_values,
//             comment: menu.comment,
//             orderOptions: menu.OrderOptions.map((option) => ({
//               order_option_id: option.order_option_id,
//               order_option_name: option.order_option_name,
//               order_option_price: option.order_option_price,
//               quantity: option.quantity,
//               display_type: option.display_type,
//               order_item_tax: option.order_item_tax,
//               order_item_tax_percentage: option.order_item_tax_percentage,
//               menu_option_type: option.menu_option_type,
//               createdAt: option.createdAt,
//               updatedAt: option.updatedAt,
//             })),
//           })),
//         }));
//         setOrders(formattedOrders);
//         // notificationAudio.play();
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const onDragEnd = async (result) => {
//     console.log("Drag result:", result);
//     // Dropped outside the droppable area
//     if (!result.destination) {
//       return;
//     }

//     // Update the status of the order in the database
//     try {
//       await ChefService.updateOrderStatus(
//         location,

//         result.draggableId,
//         result.destination.droppableId
//       );
//       fetchData();
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }

//     // Update the state to reflect the changes
//     setOrders((prevOrders) => {
//       const updatedOrders = [...prevOrders];
//       const index = updatedOrders.findIndex(
//         (order) => order.id === result.destination.droppableId
//       );
//       updatedOrders[index] = result.destination.droppableId;
//       return updatedOrders;
//     });
//   };

//   return (
//     <div className="container-fluid">
//       <h1 style={{ fontWeight: "bold" }} className="text-center ">
//         <span className="text-primary">Serv</span>
//         <span style={{ fontSize: "32px" }} className="text-warning ">
//           Chef
//         </span>
//       </h1>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div className="row justify-content-center  mt-2">
//           {/* Placed Column */}
//           <Droppable droppableId="placed">
//             {(provided) => (
//               <Col sm="4" md="3">
//                 <Card className="column">
//                   <h4
//                     className="text-center"
//                     style={{
//                       borderRadius: "10px 10px 0 0",
//                       padding: "10px",
//                       margin: "0",
//                       backgroundColor: "#FFD700",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Placed
//                   </h4>
//                   <div
//                     className="orders-container  mt-2"
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                   >
//                     {orders
//                       .filter((order) => order.status === "Placed")
//                       .map((order, index) => (
//                         <Draggable
//                           key={order.id.toString()}
//                           draggableId={order.id.toString()}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                             >
//                               <Card
//                                 className="order-card"
//                                 style={{
//                                   borderRadius: "10px",
//                                   marginBottom: "30px",
//                                   cursor: "pointer",
//                                   overflow: "hidden",
//                                   border: "1px solid #CED4DA",
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     padding: "30px",
//                                     backgroundColor: "#FFD700",
//                                     borderRadius: "10px 10px 0 0",
//                                   }}
//                                 >
//                                   <h5
//                                     style={{
//                                       margin: "0",
//                                       fontWeight: "bold",

//                                       textTransform: "capitalize",
//                                     }}
//                                   >
//                                     {order?.table_name}
//                                   </h5>
//                                   <h6
//                                     style={{
//                                       fontWeight: "bold",
//                                       marginTop: "10px",
//                                     }}
//                                   >
                                    
//                                     {order.order_time}
//                                   </h6>

//                                   {/* <p
//                           style={{
//                             margin: "10px 0",
//                             fontSize: "14px",
//                             textAlign: "center",
//                           }}
//                         >
//                           Order #{order.id}
//                         </p> */}
//                                 </div>
//                                 <div
//                                   style={{
//                                     padding: "10px",
//                                     backgroundColor: "#F8F9FA",
//                                   }}
//                                 >
//                                   <Row>
//                                     <Col>
//                                       {/* <p
//                               style={{
//                                 margin: "0",
//                                 fontSize: "14px",
//                                 fontWeight: "bold",
//                               }}
//                             >
//                               Items:
//                             </p> */}
//                                       {order.items.map((item, index) => (
//                                         <div key={index}>
//                                           <div className="justify-content-between d-flex">
//                                             <h6 style={{ fontWeight: "bold" }}>
//                                               {item.name}
//                                             </h6>
//                                             <h6 style={{ fontWeight: "bold" }}>
//                                               x{item.quantity}
//                                             </h6>
//                                           </div>
//                                           <div
//                                             style={{
//                                               marginTop: "10px",
//                                             }}
//                                           >
//                                             {item.orderOptions.map(
//                                               (option, optIndex) => (
//                                                 <h6
//                                                   key={optIndex}
//                                                   style={{
//                                                     margin: "0",

//                                                     fontWeight: "bold",
//                                                   }}
//                                                 >
//                                                   <div className="justify-content-between d-flex">
//                                                     <h6
//                                                       style={{
//                                                         fontWeight: "bold",
//                                                       }}
//                                                     >
//                                                       {option.order_option_name}
//                                                     </h6>
//                                                     x{option.quantity}
//                                                     {/* - Price:{" "}
//                                       {option.order_option_price} */}
//                                                   </div>
//                                                 </h6>
//                                               )
//                                             )}
//                                           </div>

//                                           {index < order.items.length - 1 && (
//                                             <hr />
//                                           )}
//                                         </div>
//                                       ))}
//                                     </Col>
//                                   </Row>
//                                   <hr />
//                                   {/* <div
//                           style={{
//                             padding: "30px",
//                             borderRadius: "10px 10px 0 0",
//                           }}
//                         >
//                           <Row style={{ justifyContent: "space-between" }}>
//                             <Col
//                               style={{ display: "flex", alignItems: "center" }}
//                             >
//                               <Table size={16} style={{ marginRight: "5px" }} />
//                               <p style={{ margin: "0" }}>
//                                 Total: ${order.order_total.toFixed(2)}
//                               </p>
//                             </Col>
//                             <Col
//                               style={{ display: "flex", alignItems: "center" }}
//                             >
//                               <Clock size={16} style={{ marginRight: "5px" }} />
//                               <p style={{ margin: "0" }}>
//                                 Time: {order.order_time}
//                               </p>
//                             </Col>
//                           </Row>
//                         </div> */}
//                                 </div>
//                               </Card>
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                     {provided.placeholder}
//                   </div>
//                 </Card>
//               </Col>
//             )}
//           </Droppable>

//           {/* In Progress Column */}
//           <Droppable droppableId="In-progress">
//             {(provided) => (
//               <Col sm="4" md="3">
//                 <Card className="column">
//                   <h4
//                     className="text-center bg-success"
//                     style={{
//                       borderRadius: "10px 10px 0 0",
//                       padding: "10px",
//                       margin: "0",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     In Progress
//                   </h4>
//                   <div
//                     className="orders-container  mt-1"
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                   >
//                     {orders
//                       .filter((order) => order.status === "In-progress")
//                       .map((order, index) => (
//                         <Draggable
//                           key={order.id.toString()}
//                           draggableId={order.id.toString()}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                             >
//                               <Card
//                                 className="order-card"
//                                 style={{
//                                   borderRadius: "10px",
//                                   marginBottom: "30px",
//                                   cursor: "pointer",
//                                   overflow: "hidden",
//                                   border: "1px solid #CED4DA",
//                                 }}
//                               >
//                                 <div
//                                   className="bg-success"
//                                   style={{
//                                     padding: "30px",
//                                     backgroundColor: "#FFD700",
//                                     borderRadius: "10px 10px 0 0",
//                                   }}
//                                 >
//                                   <h5
//                                     style={{
//                                       margin: "0",
//                                       fontWeight: "bold",

//                                       textTransform: "capitalize",
//                                     }}
//                                   >
//                                     {order?.table_name}
//                                   </h5>
//                                   <h6
//                                     style={{
//                                       fontWeight: "bold",
//                                       marginTop: "10px",
//                                     }}
//                                   >
                                   
//                                     {order.order_time}
//                                   </h6>
//                                 </div>
//                                 <div
//                                   style={{
//                                     padding: "10px",
//                                     backgroundColor: "#F8F9FA",
//                                   }}
//                                 >
//                                   <Row>
//                                     <Col>
//                                       {order.items.map((item, index) => (
//                                         <div key={index}>
//                                           <div className="justify-content-between d-flex">
//                                             <h6 style={{ fontWeight: "bold" }}>
//                                               {item.name}
//                                             </h6>
//                                             <h6 style={{ fontWeight: "bold" }}>
//                                               x{item.quantity}
//                                             </h6>
//                                           </div>
//                                           <div
//                                             style={{
//                                               marginTop: "10px",
//                                             }}
//                                           >
//                                             {item.orderOptions.map(
//                                               (option, optIndex) => (
//                                                 <h6
//                                                   key={optIndex}
//                                                   style={{
//                                                     margin: "0",

//                                                     fontWeight: "bold",
//                                                   }}
//                                                 >
//                                                   <div className="justify-content-between d-flex">
//                                                     <h6
//                                                       style={{
//                                                         fontWeight: "bold",
//                                                       }}
//                                                     >
//                                                       {option.order_option_name}
//                                                     </h6>
//                                                     x{option.quantity}
//                                                   </div>
//                                                 </h6>
//                                               )
//                                             )}
//                                           </div>

//                                           {index < order.items.length - 1 && (
//                                             <hr />
//                                           )}
//                                         </div>
//                                       ))}
//                                     </Col>
//                                   </Row>
//                                   <hr />
//                                 </div>
//                               </Card>
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                     {provided.placeholder}
//                   </div>
//                 </Card>
//               </Col>
//             )}
//           </Droppable>

//           {/* Done Column */}
//           <Droppable droppableId="Completed">
//             {(provided) => (
//               <Col sm="4" md="3">
//                 <Card className="column">
//                   <h4
//                     className="text-center bg-secondary"
//                     style={{
//                       borderRadius: "10px 10px 0 0",
//                       padding: "10px",
//                       margin: "0",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Done
//                   </h4>
//                   <div
//                     className="orders-container  mt-1"
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                   >
//                     {orders
//                       .filter((order) => order.status === "Completed")
//                       .map((order, index) => (
//                         <Draggable
//                           key={order.id.toString()}
//                           draggableId={order.id.toString()}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                             >
//                               <Card
//                                 className="order-card"
//                                 style={{
//                                   borderRadius: "10px",
//                                   marginBottom: "30px",
//                                   cursor: "pointer",
//                                   overflow: "hidden",
//                                   border: "1px solid #CED4DA",
//                                 }}
//                               >
//                                 <div
//                                   className="bg-secondary"
//                                   style={{
//                                     padding: "30px",
//                                     backgroundColor: "#FFD700",
//                                     borderRadius: "10px 10px 0 0",
//                                   }}
//                                 >
//                                   <h5
//                                     style={{
//                                       margin: "0",
//                                       fontWeight: "bold",

//                                       textTransform: "capitalize",
//                                     }}
//                                   >
//                                     {order?.table_name}
//                                   </h5>
//                                   <h6
//                                     style={{
//                                       margin: "0",
//                                       fontWeight: "bold",
//                                       marginTop: "10px",
//                                     }}
//                                   >
                                   
//                                     {order.order_time}
//                                   </h6>
//                                 </div>
//                                 <div
//                                   style={{
//                                     padding: "10px",
//                                     backgroundColor: "#F8F9FA",
//                                   }}
//                                 >
//                                   <Row>
//                                     <Col>
//                                       {order.items.map((item, index) => (
//                                         <div key={index}>
//                                           <div className="justify-content-between d-flex">
//                                             <h6 style={{ fontWeight: "bold" }}>
//                                               {item.name}
//                                             </h6>
//                                             <h6 style={{ fontWeight: "bold" }}>
//                                               x{item.quantity}
//                                             </h6>
//                                           </div>
//                                           <div
//                                             style={{
//                                               marginTop: "10px",
//                                             }}
//                                           >
//                                             {item.orderOptions.map(
//                                               (option, optIndex) => (
//                                                 <h6
//                                                   key={optIndex}
//                                                   style={{
//                                                     margin: "0",

//                                                     fontWeight: "bold",
//                                                   }}
//                                                 >
//                                                   <div className="justify-content-between d-flex">
//                                                     <h6
//                                                       style={{
//                                                         fontWeight: "bold",
//                                                       }}
//                                                     >
//                                                       {option.order_option_name}
//                                                     </h6>
//                                                     x{option.quantity}
//                                                   </div>
//                                                 </h6>
//                                               )
//                                             )}
//                                           </div>

//                                           {index < order.items.length - 1 && (
//                                             <hr />
//                                           )}
//                                         </div>
//                                       ))}
//                                     </Col>
//                                   </Row>
//                                   <hr />
//                                 </div>
//                               </Card>
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                     {provided.placeholder}
//                   </div>
//                 </Card>
//               </Col>
//             )}
//           </Droppable>
//         </div>
//       </DragDropContext>
//     </div>
//   );
// };

// export default DessertManagerDashboard;
