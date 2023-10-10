import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import BoardPage from "./Pages/BoardPage";
import AppProvider from "./Context/AppProvider";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Route path="/" component={Homepage} exact />
        <Route path="/chats" component={Chatpage} exact />
        <Route path="/boards" component={BoardPage} />
      </AppProvider>
    </div>
  );
}

export default App;
