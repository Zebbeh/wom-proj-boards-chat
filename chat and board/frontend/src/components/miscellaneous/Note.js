import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Badge,
  Flex,
  Button,
  Circle,
  position,
  useToast,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import Draggable from "react-draggable";
import axios from "axios";
import { useAppState } from "../../Context/AppProvider";
const Note = ({
  id,
  title,
  content,
  sender,
  createdAt,
  updatedAt,
  onEdit,
  onRemove,
  onDragStop,
  xpos,
  ypos,
  color,
}) => {
  const [selectedColor, setSelectedColor] = useState("yellow");
  const { user } = useAppState();

  const toast = useToast();

  const handleDragStop = (e, data) => {
    const { x, y } = data;
    console.log(x, y);
    onDragStop(id, { x, y });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    console.log(color);
    saveColorToServer(color);
  };

  const saveColorToServer = async (color) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(`/api/note/${id}`, { color }, config);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to save the color to the server",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {}, [position]);
  return (
    <Draggable position={{ x: xpos, y: ypos }} onStop={handleDragStop}>
      <Box
        borderWidth="1px"
        borderRadius="20px"
        p={4}
        width="300px"
        backgroundColor={color}
        boxShadow="md"
        transform={`translate(${xpos}px, ${ypos}px)`}
        _hover={{ transform: "scale(1.02)" }}
      >
        <Flex justify="space-between">
          <Circle
            borderColor="black"
            borderWidth="4px"
            size="30px"
            bg="red.500"
            cursor="pointer"
            onClick={() => handleColorChange("red")}
          />
          <Circle
            borderColor="black"
            borderWidth="4px"
            size="30px"
            bg="green.500"
            cursor="pointer"
            onClick={() => handleColorChange("green")}
          />
          <Circle
            borderColor="black"
            borderWidth="4px"
            size="30px"
            bg="yellow.500"
            cursor="pointer"
            onClick={() => handleColorChange("yellow")}
          />

          <Button
            size="sm"
            colorScheme="red"
            borderColor="black"
            borderWidth="4px"
            onClick={onRemove}
          >
            <CloseIcon />
          </Button>
        </Flex>

        <Text fontWeight="bold" fontSize="2xl" mb={2}>
          {title}
        </Text>
        <Text fontSize="black" color="black.600" mb={4}>
          {content}
        </Text>
        <Text></Text>
        <Flex justify="space-between">
          <Badge colorScheme="teal">{`Created: ${createdAt}`}</Badge>
        </Flex>
        <Badge colorScheme="teal">{`Last updated:  ${updatedAt}`}</Badge>
        <Button mt={1} onClick={onEdit}>
          Edit
        </Button>
      </Box>
    </Draggable>
  );
};

export default Note;
