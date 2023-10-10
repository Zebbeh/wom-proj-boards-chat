import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [selectedBoard, setSelectedBoard] = useState();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [boards, setBoards] = useState([]);
  const [notification, setNotification] = useState([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      history.push("/");
    }
  }, [history]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        selectedBoard,
        setSelectedBoard,
        chats,
        setChats,
        boards,
        setBoards,
        notification,
        setNotification,
        isNoteModalOpen,
        setIsNoteModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  return useContext(AppContext);
};

export default AppProvider;
