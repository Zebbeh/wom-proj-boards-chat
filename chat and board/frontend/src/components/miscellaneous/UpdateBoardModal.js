import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { useAppState } from "../../Context/AppProvider";
import axios from "axios";

const UpdateBoardModal = ({ fetchAgain, setFetchAgain, fetchNotes }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [boardName, setBoardName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { selectedBoard, setSelectedBoard, user } = useAppState();
  // FIX ERROR NOT DEFINED
  const handleRemove = async (user1) => {
    if (selectedBoard.boardAdmin._id !== user._id && user._id !== user.id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/board/boardremove`,
        {
          boardId: selectedBoard._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user.id ? setSelectedBoard() : setSelectedBoard(data);
      fetchNotes();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error occured!",
        status: "error",
        description: error.data.message, // FIX ERROR.RESP NOT DEFINED
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  // ADD ROUTE FOR RENAMING BOARD
  const handleRename = async () => {
    if (!boardName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/board/rename",
        {
          boardId: selectedBoard._id,
          boardName: boardName,
        },
        config
      );
      setSelectedBoard(data);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }

    setBoardName("");
  };

  // Working
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoading(false);
  };

  // Working
  const handleAddUser = async (user1) => {
    if (selectedBoard.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedBoard.boardAdmin._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/board/boardadd",
        {
          boardId: selectedBoard._id,
          userId: user1._id,
        },
        config
      );

      setSelectedBoard(data);
      //setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
            {selectedBoard.boardName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedBoard.users.map((u) => (
                <UserBadgeItem key={user._id} user={u} handleFunction={() => handleRemove(u)} />
              ))}
            </Box>
            <FormControl display="flex">
              <Input placeholder="Chat name" mb={3} value={boardName} onChange={(e) => setBoardName(e.target.value)} />
              <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input placeholder="Add user to group" mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            {loading ? <Spinner size="lg" /> : searchResult?.map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />)}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateBoardModal;
