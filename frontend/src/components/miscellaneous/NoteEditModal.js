// NoteEditModal.js
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";

const NoteEditModal = ({
  isOpen,
  onClose,
  note,
  onTitleChange,
  onContentChange,
  onUpdate,
}) => {
  const [editedNoteTitle, setEditedNoteTitle] = useState(note.title);
  const [editedNoteContent, setEditedNoteContent] = useState(note.content);

  const handleTitleChange = (e) => {
    onTitleChange(e.target.value);
  };

  const handleContentChange = (e) => {
    onContentChange(e.target.value);
  };

  const handleUpdate = () => {
    onUpdate(note._id, editedNoteTitle, editedNoteContent);
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              value={editedNoteTitle}
              onChange={handleTitleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={editedNoteContent}
              onChange={handleContentChange}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleUpdate}>
            Update Note
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NoteEditModal;
