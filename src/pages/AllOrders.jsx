import { useMemo } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Card, Typography, Box, Divider, Grid } from "@mui/material";
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
        <Grid item sm={4} md={3} className={`${styles.gridStyle}`}>
          <Card className={`${styles.ordersColumn} `}>
            <Box className={`${styles.ordersHeader} ${getStatusColor(title)}`}>
              <Typography className={`${styles.titleTypography}`} variant="h6">
                {title}
              </Typography>
            </Box>
            <div
              className={styles.ordersContainer}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {filteredOrders.map((order, index) => (
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
                        className={`${styles.orderCard} ${
                          snapshot.isDragging ? styles.orderCardDragging : ""
                        }`}
                      >
                        <Box
                          className={`${styles.orderDetails} ${getStatusColor(
                            title
                          )}`}
                        >
                          <Typography>{order?.table_name}</Typography>

                          <div className={`${styles.timeContainer}`}>
                            <div className={`${styles.time}`}>
                              <Typography variant="subtitle2">
                                {order.order_time}
                              </Typography>
                            </div>
                          </div>
                        </Box>

                        {order.items.map((item, index) => (
                          <>
                            <div
                              key={index}
                              className={`${styles.orderItemsContainer}`}
                            >
                              <div>
                                <Typography variant="subtitle2">
                                  {item.name}
                                </Typography>
                              </div>
                              <div>
                                <Typography variant="subtitle2">
                                  x{item.quantity}
                                </Typography>
                              </div>
                            </div>
                            <Divider />
                            {item?.orderOptions.map((item, index2) => (
                              <div
                                key={index2}
                                className={`${styles.orderOptionsContainer}`}
                              >
                                <div>
                                  <Typography variant="subtitle2">
                                    {item.order_option_name}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="subtitle2">
                                    x{item.quantity}
                                  </Typography>
                                </div>
                              </div>
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
            </div>
          </Card>
        </Grid>
      )}
    </Droppable>
  );
};
export default AllOrders;
