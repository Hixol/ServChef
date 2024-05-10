import PropTypes from "prop-types";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Grid, Card, Typography, Box, Divider } from "@mui/material";
// import EventIcon from '@mui/icons-material/Event'; // Importing EventIcon
// import AccessTimeIcon from '@mui/icons-material/AccessTime';


const PlacedOrders = ({ orders }) => {
  console.log("ORDERS",orders);
  return (
    <Droppable droppableId="placed">
      {(provided) => (
        <Grid item sm={4} md={3} style={{ padding: "8px" }}>
          <Card style={{ padding: "10px", borderRadius: "10px", border: "1px solid black" }}>
            <Box style={{ backgroundColor: "#FFD701", borderRadius: "10px 10px 0 0" }}>
              <Typography variant="h6" align="center" style={{color: "black", padding: "3px 0" }}>
                Placed
              </Typography>
            </Box>
            <div
              className="orders-container"
              style={{ minHeight: "100px", maxHeight: "100vh", overflowY: "auto" }} // Added minHeight and maxHeight
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {orders.map((order, index) => (
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
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                                           <div>
  <Typography variant="h6" style={{ fontSize: "medium" }}>
    {order?.table_name}
  </Typography>
</div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            {/* <div style={{ display: "flex", alignItems: "center" }}>
                              <EventIcon fontSize="small" style={{ marginRight: "4px" }} /> 
                              <Typography variant="subtitle2">{order.order_date}</Typography>
                            </div> */}
                            <div style={{ display: "flex", alignItems: "center" }}>
                              {/* <AccessTimeIcon fontSize="small" style={{ marginRight: "4px" }} /> */}
                              <Typography variant="subtitle2">{order.order_time}</Typography>
                            </div>
                          </div>
                        </Box>
                        {/* <Box
                          sx={{
                            display: "flex",
                            marginBottom: "12px",
                            justifyContent: "space-between"
                          }}
                        >
                          <Box
                            sx={{
                              background: "black",
                              borderRadius: "8px",
                              padding: "12px",
                              color: "white",
                              marginRight: "6px",
                              flex: "1"
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              style={{ fontWeight: "bold" }}
                            >
                              Items
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              background: "black",
                              padding: "5px",
                              color: 'white',
                              textAlign: "center",
                              flex: "0 0 auto",
                              width: "40px"
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              style={{ fontWeight: "bold" }}
                            >
                              Qty
                            </Typography>
                          </Box>
                        </Box> */}
                        {order.items.map((item, index) => (
                          <>
                            <div
                              key={index}
                              style={{
                              padding:"5px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <Typography
                                  variant="subtitle2"
                                //   style={{ fontWeight: "bold" }}
                                >
                                  {item.name}
                                </Typography>
                              </div>
                              <div>
                                <Typography
                                  variant="subtitle2"
                                //   style={{ fontWeight: "bold" }}
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
                                  <Typography variant="subtitle2">
                                    {item.order_option_name}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography
                                    variant="subtitle2"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    x{item.quantity}
                                  </Typography>
                                </div>
                              </div>
                            ))}
                             <Divider />
                             <div style={{ textAlign: "center" }}>
  <Typography variant="subtitle2" style={{ fontWeight: "bold" }}>
    {item?.comment}
  </Typography>
</div>

                             
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
  );
};

PlacedOrders.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default PlacedOrders;
