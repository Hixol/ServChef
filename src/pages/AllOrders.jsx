import {useEffect, useMemo, useRef, useState} from "react";
import {Card, Typography, Box, Divider, Grid2, Stack} from "@mui/material";
import styles from "../css/AllOrders.module.css";
import ChefService from "../services/ChefService";
import LocationService from "../services/LocationService";
import {useAuthContext} from "../context/authContext"; // Impoting CSS module

// Component for displaying all orders based on status

const AllOrders = ({ orders, setOrders, setIsUpdating, fetchData, newRole}) => {
  const { placedOrders, inProgressOrders, completedOrders } = useMemo(() => {
    const placedOrders = [];
    const inProgressOrders = [];
    const completedOrders = [];

    console.log("newROle", newRole);

    orders.forEach((order) => {
      switch (order.status) {
        case "Placed":
          placedOrders.push(order);
          break;
        case "In-progress":
          inProgressOrders.push(order);
          break;
        case "Completed":
          completedOrders.push(order);
          break;
        default:
          break;
      }
    });

    return { placedOrders, inProgressOrders, completedOrders };
  }, [orders]);

  const [lists, setLists] = useState({placedOrders, inProgressOrders, completedOrders});
  const [draggedItem, setDraggedItem] = useState(null);
  const [sourceList, setSourceList] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [targetList, setTargetList] = useState('');
  const itemRefs = useRef({});
  const [startTouchPosition, setStartTouchPosition] = useState({ x: 0, y: 0 });

  console.log("newROle", newRole, orders);

  useEffect(() => {
    setLists({placedOrders, inProgressOrders, completedOrders})
  }, [orders]);

  const handleDragStart = (item, listName) => {
    setDraggedItem(item);
    setSourceList(listName);
    setIsDragging(true);
  };

  const handleDrop = async (listName) => {
    if (!draggedItem) return;

    const newLists = {...lists};

    // Only move the item if it's dropped into a different list
    if (sourceList !== listName) {
      // Remove item from the source list
      newLists[sourceList] = newLists[sourceList].filter(i => i.id !== draggedItem.id);
      // Add the item to the target list
      newLists[listName].push(draggedItem);

      setLists(newLists);

      // setIsUpdating(true);
      try {
        let locationData = await LocationService.getLocation();
        await ChefService.updateOrderStatus(
            locationData,
            newRole,
            draggedItem.id,
            listName === "placedOrders" ? "Placed" : listName === "inProgressOrders" ? "In-progress" : "Completed"
        );

        // await fetchData();
      } catch (error) {
        console.error("Error updating order status:", error);
      } finally {
        // setIsUpdating(false);
      }

      // setOrders((prevOrders) => {
      //   const updatedOrders = [...prevOrders];
      //   const index = updatedOrders.findIndex(
      //       (order) => order.id === draggedItem.id
      //   );
      //   updatedOrders[index] = listName === "placedOrders" ? "Placed" : listName === "inProgressOrders" ? "In-progress" : "Completed";
      //   return updatedOrders;
      // });
    }

    // Reset all states after the drop
    setDraggedItem(null);
    setSourceList('');
    setIsDragging(false);
    setStartTouchPosition({x: 0, y: 0});
  };

  const handleTouchStart = (item, listName, e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const itemElement = itemRefs.current[item.id];

    if (itemElement) {
      const rect = itemElement.getBoundingClientRect();
      // Capture the initial touch position and element's position
      setStartTouchPosition({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }

    handleDragStart(item, listName);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !draggedItem) return;

    e.preventDefault(); // Prevent default touch behavior
    const touch = e.touches[0];
    const draggedElement = itemRefs.current[draggedItem.id];

    if (draggedElement) {
      // Move the dragged element based on the difference between initial touch and current touch
      draggedElement.style.position = 'absolute';
      draggedElement.style.left = `${touch.clientX - startTouchPosition.x}px`;
      draggedElement.style.top = `${touch.clientY - startTouchPosition.y}px`;

      // Check which list the item is currently over
      const listsArray = Object.keys(lists);
      listsArray.forEach(list => {
        const listElement = document.getElementById(list);
        const rect = listElement.getBoundingClientRect();

        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {
          setTargetList(list);
        }
      });
    }
  };

  const handleTouchEnd = () => {
    if (targetList) {
      handleDrop(targetList);
    }
    const draggedElement = itemRefs.current[draggedItem?.id];
    if (draggedElement) {
      draggedElement.style.position = 'static';
    }
    setTargetList(''); // Reset the target list
  };

  const getStatusColor = (title) => {
    //Used Switch Case to Handle The Colors Based on Title
    switch (title) {
      case "placedOrders":
        return styles.placed;
      case "inProgressOrders":
        return styles.inProgress;
      case "completedOrders":
        return styles.completed;
      default:
        return styles.inProgress;
    }
  };

  useEffect(() => {
    const handleTouchMoveEvent = (e) => {
      if (isDragging) {
        handleTouchMove(e);
      }
    };

    window.addEventListener('touchmove', handleTouchMoveEvent, { passive: false });

    return () => {
      window.removeEventListener('touchmove', handleTouchMoveEvent);
    };
  }, [isDragging]);

  // Rendering JSX using CSS modules for styling previously inline styling was being used
  return (
      <Grid2 container justifyContent="center" spacing={{xs: 1, lg: 2}} sx={{padding: '1rem', height: '100%', width: '100%', flexGrow: 1}}>
        {Object.entries(lists).map(([listName, items]) => (
            <Grid2
                className={`${styles.ordersColumn} `}
                size={{xs: 12, sm: 4, md: 3}}
                key={listName}
                id={listName}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(listName)}
                onTouchEnd={handleTouchEnd}
            >
              <Box className={`${styles.ordersHeader} ${getStatusColor(listName)}`}>
                <Typography className={`${styles.titleTypography}`} variant="h6">
                  {listName === "placedOrders" ? "Placed" : listName === "inProgressOrders" ? "In-Progress" : "Completed"}
                </Typography>
              </Box>
              <Stack sx={{padding: '0.5rem'}} >
                {items.map((order) => (
                    <Card
                        className={`${styles.orderCard}`}
                        key={order.id}
                        draggable
                        onDragStart={() => handleDragStart(order, listName)}
                        onDragEnd={() => {
                          setDraggedItem(null);
                          setStartTouchPosition({ x: 0, y: 0 });
                        }}
                        onTouchStart={(e) => handleTouchStart(order, listName, e)}
                        onTouchMove={handleTouchMove}
                        ref={el => itemRefs.current[order.id] = el}
                    >
                      <Box className={`${styles.orderDetails} ${getStatusColor(listName)}`}>
                        {/* <Typography>{order?.table_name}</Typography> */}
                        <Typography fontWeight={600} sx={{textTransform: 'capitalize'}}>
                          {order?.table_name
                              ? order.table_name
                              : order?.order_type
                                  ? order.order_type
                                  : null}
                        </Typography>

                        <Stack sx={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                          <Typography variant='h6' sx={{fontSize: '0.8rem'}}>{order.order_date}</Typography>
                          <Typography variant="subtitle2" sx={{fontSize: '0.75rem'}}>
                            {order.order_time}
                          </Typography>
                        </Stack>
                      </Box>

                      {order.items.map((item, index) => (
                          <>
                            <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between', padding: '0.25rem'}} key={index}>
                              <Typography variant="subtitle2" fontWeight={600}>{item.name}</Typography>
                              {((newRole === 'kitchen_manager' && item.menu_type === 'kitchen') || (newRole === 'bar_manager' && item.menu_type === 'bar') || (newRole === 'dessert_manager' && item.menu_type === 'dessert')) && <Typography variant="subtitle2" fontWeight={600}>x{item.quantity}</Typography>}
                            </Stack>
                            <Divider />
                            {item?.orderOptions.map((item, index2) => (
                                <Stack direction='row' sx={{alignItems: 'center', justifyContent: 'space-between',   padding: '0.0625rem 0.5rem'}} key={index2}>
                                  <Typography variant="subtitle2" sx={{fontSize: '0.75rem'}}>
                                    {item.itemNumber} {item.order_option_name}
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
                ))}
              </Stack>
            </Grid2>
        ))}
      </Grid2>
  );
};
export default AllOrders;
