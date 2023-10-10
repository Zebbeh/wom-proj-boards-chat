// NoteModal.js
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";

const NoteModal = ({ isOpen, onClose, onCreateNote, boardId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreateNote = () => {
    if (title.trim() === "" || content.trim() === "") {
      return;
    }

    onCreateNote({
      title,
      content,
      boardId: boardId,
    });

    // Close the modal and reset input values
    onClose();
    setTitle("");
    setContent("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a New Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Title"
            mb={4}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleCreateNote}>
            Create Note
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NoteModal;
