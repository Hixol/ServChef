import { useMemo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import {Card, Typography, Box, Divider, Grid2, Stack} from "@mui/material";
import styles from "../css/AllOrders.module.css"; // Impoting CSS module

// Component for displaying all orders based on status

const AllOrders = ({ title, orders, droppableId }) => {
// Function to determine status color based on title

  const getStatusColor = (title) => {
    //Used Switch Case to Handle The Colors Based on Title
    switch (title) {
      case "Placed":
        return styles.placed;
      case "In Progress":
        return styles.inProgress;
      case "Completed":
        return styles.completed;
      default:
        return styles.inProgress;
    }
  };
  // Memoize the filteredOrders variable
  //Used Switch Case to Handle The orders Based on Order Status Previously three different components were made
  //each having its own filter which was overhead so implemented this solution
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      switch (title) {
        case "Placed":
          return order.status === "Placed";
        case "In Progress":
          return order.status === "In-progress";
        case "Completed":
          return order.status === "Completed";
        default:
          return true;
      }
    });
  }, [title, orders]);

  // Rendering JSX using CSS modules for styling previously inline styling was being used
  return (
      <Droppable droppableId={droppableId}>
        {(provided) => (
            <Grid2 size={{xs: 12, sm: 4, md: 3}}>
              <Card className={`${styles.ordersColumn} `}>
                <Box className={`${styles.ordersHeader} ${getStatusColor(title)}`}>
                  <Typography className={`${styles.titleTypography}`} variant="h6">
                    {title}
                  </Typography>
                </Box>
                <Stack sx={{padding: '0.5rem', overflowY: 'auto', flexGrow: 1, maxHeight: 'calc(100vh - 156px)', height: '100%'}} ref={provided.innerRef}{...provided.droppableProps}>
                  {filteredOrders.map((order, index) => (
                      <Draggable
                          key={index}
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
                                  className={`${styles.orderCard} ${
                                      snapshot.isDragging ? styles.orderCardDragging : ""
                                  }`}
                              >
                                <Box className={`${styles.orderDetails} ${getStatusColor(title)}`}>
                                  {/* <Typography>{order?.table_name}</Typography> */}
                                  <Typography fontWeight={600} sx={{textTransform: 'capitalize'}}>
                                    {order?.table_name
                                        ? order.table_name
                                        : order?.order_type
                                            ? order.order_type
                                            : null}
                                  </Typography>

                                  <Typography variant="subtitle2">
                                    {order.order_time}
                                  </Typography>
                                </Box>

                                {order.items.map((item, index) => (
                                    <>
                                      <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem'}} key={index}>
                                        <Typography variant="subtitle2" fontWeight={600}>{item.name}</Typography>
                                        <Typography variant="subtitle2" fontWeight={600}>x{item.quantity}</Typography>
                                      </Stack>
                                      <Divider />
                                      {item?.orderOptions.map((item, index2) => (
                                          <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between',   padding: '0.0625rem 0.5rem'}} key={index2}>
                                              <Typography variant="subtitle2" sx={{fontSize: '0.75rem'}}>
                                                {item.order_option_name}
                                              </Typography>
                                              <Typography variant="subtitle2" sx={{fontSize: '0.75rem'}}>
                                                x{item.quantity}
                                              </Typography>
                                          </Stack>
                                      ))}
                                      <Divider />
                                      <div className={`${styles.commentContainer}`}>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{ fontWeight: "bold" }}
                                        >
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
                </Stack>
              </Card>
            </Grid2>
        )}
      </Droppable>
  );
};
export default AllOrders;
