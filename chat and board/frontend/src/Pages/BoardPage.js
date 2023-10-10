// BoardPage.js
import React, { useContext, useEffect } from "react";
import { useAppState } from "../Context/AppProvider";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Box, Button, Collapse, Stack, Text } from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import NoteModal from "../components/miscellaneous/NoteModal";
import BoardModal from "../components/miscellaneous/BoardModal";
import { ChatLoading } from "../components/ChatLoading";
import NotesDisplay from "../components/NotesDisplay";
import SingleBoardPage from "./SingleBoardPage";

const BoardPage = () => {
  const { selectedBoard, setSelectedBoard, user, boards, setBoards } =
    useAppState();
  const history = useHistory();

  const fetchBoards = async () => {
    try {
      if (!user || !user.token) {
        console.error("user or token is undefined");
        return;
      }
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

  const closeNewBoardModal = () => {};

  useEffect(() => {
    // Fetch boards when the component mounts
    if (user && user.token) {
      fetchBoards();
    }
  }, [user]); // Only run the effect when the user changes

  const handleBoardClick = (board) => {
    setSelectedBoard(board);
    history.push(`/boards/${board._id}`);
  };

  const clearSelectedBoard = () => {
    setSelectedBoard(null);
    history.push("/boards");
  };

  return (
    <Box
      className="board-page"
      p={3}
      bg="white"
      w="100%"
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* Conditionally render SingleBoardPage if a board is selected */}
      {selectedBoard ? (
        <SingleBoardPage />
      ) : (
        <>
          {/* My Boards section */}
          <Collapse in={!selectedBoard}>
            <Box
              pb={3}
              px={3}
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
              display="flex"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              My Boards
              <BoardModal onClose={closeNewBoardModal}>
                <Button
                  display="flex"
                  fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                  rightIcon={<AddIcon />}
                >
                  New Board
                </Button>
              </BoardModal>
            </Box>

            <Stack overflowY="scroll">
              {boards ? (
                boards.map((board) => (
                  <Box
                    onClick={() => handleBoardClick(board)}
                    cursor="pointer"
                    bg={selectedBoard === board ? "#38B2AC" : "#E8E8E8"}
                    color={selectedBoard === board ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={board._id}
                  >
                    <Text>{board.boardName}</Text>
                  </Box>
                ))
              ) : (
                <ChatLoading />
              )}
            </Stack>
          </Collapse>
        </>
      )}
    </Box>
  );
};

export default BoardPage;
