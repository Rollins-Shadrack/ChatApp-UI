import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Chat from './pages/Chat'
import Posts from './pages/Posts'
import Admin from './pages/Admin'
import { useState } from "react";
import { useSelector } from "react-redux";
import { AppContext, socket } from "./context/appContext";


function App() {
  const user = useSelector((state)=>state.user)
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});
  return (
    <AppContext.Provider value={{ socket, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg, rooms, setRooms, newMessages, setNewMessages }}>
      <BrowserRouter>
        <Navigation/>
        <Routes>
          <Route path='/' element={<Home/>} />
          {!user && (<>
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<SignUp/>} />
          </>)}
          <Route path='/chat' element={<Chat/>} />
          <Route path='/posts' element={<Posts/>} />
          <Route path='/admin' element={<Admin/>} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
