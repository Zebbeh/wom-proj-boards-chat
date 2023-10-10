// SingleBoardPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import Note from "../components/miscellaneous/Note";
import { useHistory } from "react-router-dom";
import { useAppState } from "../Context/AppProvider";
import NoteModal from "../components/miscellaneous/NoteModal";
import UpdateBoardModal from "../components/miscellaneous/UpdateBoardModal";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedBoardCompare;

const SingleBoardPage = () => {
  const [notes, setNotes] = useState([]);
  const [editedNote, setEditedNote] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const history = useHistory();
  const { selectedBoard, setSelectedBoard, user } = useAppState();
  const [editedNoteTitle, setEditedNoteTitle] = useState("");
  const [editedNoteContent, setEditedNoteContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const { fetchAgain, setFetchAgain } = useAppState();
  const [socketConnected, setSocketConnected] = useState(false);

  const openEditModal = (note) => {
    setEditedNote(note);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditedNote(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateNote = async (editedNote) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(editedNote);
      const { data } = await axios.put(
        `/api/note/${editedNote._id}`,
        {
          title: editedNote.title,
          content: editedNote.content,
        },
        config
      );
      console.log("Server response:", data);

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === data._id ? { ...data, position: note.position } : note
        )
      );
      socket.emit("new received", data);
      console.log("Note received event emitted");
      closeEditModal();
      fetchBoardNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  const handleDragStop = async (note, newPosition) => {
    console.log("newposition: ", newPosition);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const updatedPosition = note.position || { x: 0, y: 0 };
      const { data } = await axios.put(
        `/api/note/${note._id}`,
        {
          position: newPosition,
        },
        config
      );

      setNotes((prevNotes) =>
        prevNotes.map((prevNote) =>
          prevNote._id === data._id
            ? { ...prevNote, position: data.position }
            : prevNote
        )
      );

      fetchBoardNotes();

      socket.emit(
        "new note",
        {
          board: {
            _id: selectedBoard._id,
            users: selectedBoard.users,
          },
        },
        data
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const fetchBoardNotes = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/board/${selectedBoard._id}/notes`,
        config
      );

      setNotes(data);
      console.log("Fetched notes: ", data);
      socket.emit("join board", selectedBoard._id);
    } catch (error) {
      console.error("Error fetching board notes:", error);
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("update board", (updateData) => {
      console.log("Received update from server:", updateData);
      fetchBoardNotes(); // Make sure this function fetches the updated notes
    });

    console.log("Selected board:", selectedBoard);
  }, []);

  useEffect(() => {
    fetchBoardNotes();
    selectedBoardCompare = selectedBoard;
  }, [selectedBoard]);

  const openNoteModal = () => {
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
  };

  const createNote = async (noteData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(noteData);
      const { data } = await axios.post(
        "/api/note",
        {
          title: noteData.title,
          content: noteData.content,
          boardId: noteData.boardId,
          position: { x: 0, y: 0 },
          color: "yellow",
        },
        config
      );

      console.log("New note created:", data);

      setNotes((prevNotes) => [...prevNotes, data]);

      socket.emit("note received", data);
      console.log("Note received event emitted");
      closeNoteModal(); // Close the modal after creating the note
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const navigateToMyBoards = () => {
    setSelectedBoard(null);
    history.push("/boards");
  };

  const handleRemoveNote = async (noteId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.delete(`/api/note/${noteId}`, config);

      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error removing note:", error);
    }
  };
  return (
    <Box p={6}>
      {/* Heading section (you can add it later) */}
      <VStack align="stretch" spacing={4}>
        <HStack justifyContent="space-between">
          <Button onClick={navigateToMyBoards}>Back to My Boards</Button>
          <Text fontFamily="Work sans" fontSize="2xl" fontWeight="bold">
            {selectedBoard.boardName.toUpperCase()}
          </Text>
          <Button onClick={openNoteModal}>New note</Button>
          <UpdateBoardModal></UpdateBoardModal>
        </HStack>

        {notes.length > 0 ? (
          notes.map((note) => (
            <Note
              key={note._id}
              id={note._id}
              title={note.title}
              content={note.content}
              createdAt={note.createdAt}
              updatedAt={note.updatedAt}
              color={note.color}
              xpos={note.position ? note.position.x : 0}
              ypos={note.position ? note.position.y : 0}
              onEdit={() => {
                console.log("Editing note:", note);
                openEditModal(note);
              }}
              onRemove={() => handleRemoveNote(note._id)}
              onDragStop={(event, data) => handleDragStop(note, data)}
            />
          ))
        ) : (
          <Text>No notes available for this board.</Text>
        )}
      </VStack>

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={closeNoteModal}
        onCreateNote={createNote}
        boardId={selectedBoard._id}
      />

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Title</Text>
            <Input
              placeholder="New title..."
              value={editedNote?.title}
              onChange={(e) =>
                setEditedNote((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Text>Content</Text>
            <Input
              placeholder="New content..."
              value={editedNote?.content}
              onChange={(e) =>
                setEditedNote((prev) => ({ ...prev, content: e.target.value }))
              }
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateNote(editedNote)}
            >
              Save
            </Button>
            <Button onClick={closeEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SingleBoardPage;
