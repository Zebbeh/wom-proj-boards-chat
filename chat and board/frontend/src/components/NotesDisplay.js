import React, { useEffect, useCallback } from "react";
import {
  Box,
  Text,
  Card,
  StackDivider,
  Heading,
  Stack,
} from "@chakra-ui/react";
import Draggable from "react-draggable";
import axios from "axios";
import { useAppState } from "../Context/AppProvider";

const NotesDisplay = () => {
  const { user, selectedBoard, setBoards } = useAppState();
  const { notes, setNotes } = useAppState();

  const fetchNotes = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      console.log("Fetching notes for board ID: ", selectedBoard._id);

      const { data } = await axios.get(
        `/api/board/${selectedBoard._id}/notes`,
        config
      );

      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board._id === selectedBoard._id ? { ...board, notes: data } : board
        )
      );
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }, [user.token, selectedBoard._id, setBoards]);

  useEffect(() => {
    console.log("Component re-rendered");
    fetchNotes();
  }, [fetchNotes]);

  return <></>;
};

export default NotesDisplay;
