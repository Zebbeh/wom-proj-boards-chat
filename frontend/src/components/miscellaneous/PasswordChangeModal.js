import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react"; // Replace with your actual UI library
import axios from "axios";
import { useAppState } from "../../Context/AppProvider";

const PasswordChangeModal = ({ isOpen, onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { user } = useAppState();

  const toast = useToast();

  useEffect(() => {
    console.log("PasswordChangeModal mounted");
    return () => {
      console.log("PasswordChangeModal unmounted");
    };
  }, []);

  const handlePasswordChange = async () => {
    // Perform validation and call the provided onChangePassword function
    if (newPassword !== confirmNewPassword) {
      // Handle password mismatch
      console.error("New passwords do not match");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/user/password",
        {
          currentPassword,
          newPassword,
        },
        config
      );

      toast({
        title: "Password changed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error changing passord",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }

    // Call the parent component's function to handle the password change
    onChangePassword(currentPassword, newPassword);

    // Optionally, you can also clear the form fields and close the modal
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handlePasswordChange}>
            Change Password
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PasswordChangeModal;
