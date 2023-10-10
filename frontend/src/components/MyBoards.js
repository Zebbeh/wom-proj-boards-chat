// MyBoards.js
import React, { useEffect, useState } from "react";
import { Box, Stack, Text, Button } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import BoardModal from "./miscellaneous/BoardModal";
import { ChatLoading } from "./ChatLoading";
import { useAppState } from "../Context/AppProvider";
import NotesDisplay from "./NotesDisplay";
import NoteModal from "./miscellaneous/NoteModal";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket;

const MyBoards = ({ fetchAgain }) => {
  const { selectedBoard, setSelectedBoard, user, boards, setBoards } =
    useAppState();

  const fetchBoards = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/board", config);
      console.log("Boards data:", data);
      setBoards(data);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [user.token, fetchAgain]);

  return (
    <Box p={3} bg="white" w="100%" borderRadius="lg" borderWidth="1px">
      <Stack overflowY="scroll">
        {boards ? (
          boards.map((board) => (
            <Box
              onClick={() => {
                console.log("Board clicked:", board);
                setSelectedBoard(board);
                socket.emit("join board", selectedBoard._id);
              }}
              cursor="pointer"
              bg={selectedBoard === board ? "#38B2AC" : "#E8E8E8"}
              color={selectedBoard === board ? "white" : "black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={board._id}
            ></Box>
          ))
        ) : (
          <ChatLoading />
        )}
      </Stack>
    </Box>
  );
};

export default MyBoards;
