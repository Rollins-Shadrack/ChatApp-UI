import React, {useContext, useEffect, useState} from 'react'
import {Button,Col,Form, FormGroup, ListGroup, Row} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import { AppContext } from "../context/appContext";
import {Link} from 'react-router-dom'
import { addNotification, resetNotification } from '../features/userSlice';
import './sidebar.css'
import axios from 'axios'

const Sidebar = ({type}) => {
  const user = useSelector((state)=>state.user)
  const [events,setEvents] = useState([])
  const [inputs, setInputs] = useState({
    name:"",
    link:"",
    about:""
})
      //handle inputs
      const handleChange = (e) =>{
        setInputs((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
      }
      const handleEvent = async(e) =>{
        e.preventDefault()
        console.log(inputs)
        await axios.post('https://therapychat.herokuapp.com/posts/event',{
          name:inputs.name,
          link:inputs.link,
          about:inputs.about
        }).then(()=>{
          setInputs('')
        }).catch(err => console.log(err))
      }
 const deleteEvent = async(id) =>{
  await axios.post(`https://therapychat.herokuapp.com/posts/event/${id}`).then(()=>{
    alert("Event deleted,Please reload the page ")
  }).catch(err => console.log(err));
 }
  const dispatch = useDispatch()
  const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);
  const joinRoom = (room,isPublic = true) =>{
    if(!user){
      return alert('Please Login')
    }
    socket.emit('join-room',room, currentRoom)
    setCurrentRoom(room)
    if(isPublic){
      setPrivateMemberMsg(null)
    }
    //dispatch notifications
    dispatch(resetNotification(room))

  }
  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom != room) dispatch(addNotification(room));
});
//order things alPahebetically
const orderIds = (id1, id2) => {
  if (id1 > id2) {
      return id1 + "-" + id2;
  } else {
      return id2 + "-" + id1;
  }
}


  const handlePrivateMemberMsg = (member) =>{
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }
  useEffect(() => {
    if (user) {
        setCurrentRoom("general");
        getRooms();
        socket.emit("join-room", "general");
        socket.emit("new-user");
    }
    const getEvents = async()=>{
      await axios.get('https://therapychat.herokuapp.com/posts/event').then(({data})=>{
        setEvents(data)
      }).catch(err => console.log(err));
    }
    getEvents()
},[]);
  socket.off('new-user').on('new-user',(payload) =>{
    setMembers(payload)
  })
  const getRooms = () => {
    fetch("https://therapychat.herokuapp.com/rooms")
        .then((res) => res.json())
        .then((data) => setRooms(data));
}
  if(!user){
    return <></>
  }
  return (
    <>
    <div className="sidebarBody">
      <h2>Upcoming Events</h2>
      <ListGroup style={{maxHeight:"300px",overflow:"scroll"}}>
        {events.length === 0 && <p className="text-center"> <b><i>No Upcoming Events!!</i></b> </p>}
      {events.map(event=>(
        <ListGroup.Item key={event._id}>
          <div className="d-flex">
            <p className="mx-2">{event.name}</p>
            <p><a href={event.link} target="blank"> Attend</a></p>
          </div>
          <div className="d-flex">
          <p className="mx-2">{event.about}</p>
          {user.isAdmin === 'true' && <i className="fas fa-trash   text-danger"onClick={()=> deleteEvent(event._id)}></i>}
          </div>
        </ListGroup.Item>
      ))}
      </ListGroup>
      { type !== 'posts'  && 
      <>
        <h2>Available Rooms</h2>
      <ListGroup>
              {rooms.map((room, idx) => (
                  <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room == currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                      {room} {currentRoom !== room && <span className="badge rounded-pill bg-info">{user.newMessages[room]}</span>}
                  </ListGroup.Item>
              ))}
          </ListGroup>
      </>}
      {type === 'admin' && <>
      <div className="my-3">
        <h4>Connect With Others</h4>
          <Link to='/chat' style={{textDecoration:"none",color:"black"}} className="">Chat with Others</Link>
        </div>
      </>}
      {type !== 'posts'  ? <>
        <div className="my-3">
        <h4>Share With Others</h4>
          <Link to='/posts' style={{textDecoration:"none",color:"black"}} className="">Share your posts</Link>
        </div>
      </>:<>
        <div className="my-3">
        <h4>Connect With Others</h4>
          <Link to='/chat' style={{textDecoration:"none",color:"black"}} className="">Chat with Others</Link>
        </div>
      </>}
      {user.isAdmin === "true" &&<>
        {type !== 'admin' && <>
        <div className="my-3">
        <h4>Manage Posts </h4>
          <Link to='/admin' style={{textDecoration:"none",color:"black"}} className="">Manage what others Post</Link>
        </div>
        </>}
      </>}
      { user.isAdmin !== 'true' ? <>
        <h2>Members</h2>
      <ListGroup style={{height:"200px",overflow:"scroll"}}>
      {members.map((member)=>(
        <ListGroup.Item key={member._id} style={{cursor:"pointer"}} active={privateMemberMsg?._id == member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}> 
          <Row>
            <Col xs={2} className="member-status">
            <img src={`https://therapychat.herokuapp.com/files/${member.picture}`} className="member-status-img" />
            {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
            </Col>
            <Col xs={8}>
                {member.name}
                {member._id === user?._id && " (You)"}
                {member.status == "offline" && " (Offline)"}
            </Col>
            <Col xs={2}>
              <span className="badge rounded-pill bg-info">{user.newMessages[orderIds(member._id, user._id)]}</span>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
      </ListGroup>
      </>:<>
      <h3 className="text-center">Create an Event</h3>
      <Form onSubmit={handleEvent}>
        <FormGroup className="mb-3">
        <Form.Control type="text" name="name"  placeholder={`Event Name`}   value={inputs.name} onChange={handleChange} required></Form.Control>
        </FormGroup>
        <FormGroup className="mb-3">
        <Form.Control type="text" name="link"  placeholder={`e.g Zoom Link`}   value={inputs.link} onChange={handleChange} required></Form.Control>
        </FormGroup>
        <FormGroup className="mb-3">
        <Form.Control type="text" name="about"  placeholder={`About the Event `}   value={inputs.about} onChange={handleChange} required></Form.Control>
        </FormGroup>
        <Button  variant="primary" type="submit" style={{ width: "100%", backgroundColor: "orange" }} disabled={!user} title={"Click twice for a post"}  >Create <i className="fas fa-paper-plane"></i></Button>
      </Form>
      </>}
    </div>
<div className="smallscreen">
<div class="nav">
<div class="menu">
    <div class="menuitem" id="demo1">
    <a><i className="fas fa-gear text-dark fs-4"></i></a>
    <div class="menu">
      <div class="menuitem" >
      <a>Upcoming Events</a>
      <ListGroup className="menu" style={{height:"300px", overflow:"scroll",overflowX:"hidden"}}>
        {events.map(event=>(
        <ListGroup.Item key={event._id} className="menuitem">
          <div className="d-flex">
            <p className="mx-2">{event.name}</p>
            <p style={{fontSize:"9px"}}><a href={event.link} style={{background:"inherit",border:"none",color:"black"}} target="blank"> Attend</a></p>
          </div>
          <div className="d-flex">
          <p className="mx-2">{event.about}</p>
          {type === 'admin' && <i className="fas fa-trash   text-danger"onClick={()=> deleteEvent(event._id)}></i>}
          </div>
        </ListGroup.Item>
      ))}
      </ListGroup>
      </div>
      {type !== 'posts'  && <div className="menuitem" id="demo4">
        <a> Available Rooms</a>
        <ListGroup className="menu">
        {rooms.map((room,idx) =>(
          <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room == currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }} className="menuitem" >
            {room}{currentRoom !== room && <span className="badge rounded-pill bg-info">{user.newMessages[room]}</span>}
          </ListGroup.Item>
        ))}
      </ListGroup>
      </div>}
      <div className="menuitem" id="demo5">
    <a> Members</a>
    <ListGroup className="menu" style={{height:"300px", overflow:"scroll",overflowX:"hidden"}}>
      {members.map((member)=>(
        <ListGroup.Item key={member._id} style={{cursor:"pointer"}} active={privateMemberMsg?._id == member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}  className="menuitem"> 
          <Row>
            <Col xs={2} className="member-status">
            <img src={`https://therapychat.herokuapp.com/files/${member.picture}`} className="member-status-img" style={{width:"30px",height:"30px"}} />
            {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
            </Col>
            <Col xs={8} className="mx-2 px-2 " style={{fontSize:"10px"}}>
                {member.name}
                {member._id === user?._id && " (You)"}
                {member.status == "offline" && " (Offline)"}
            </Col>
            <Col xs={2}>
              <span className="badge rounded-pill bg-info">{user.newMessages[orderIds(member._id, user._id)]}</span>
            </Col>
          </Row>
        </ListGroup.Item>
      ))}
      </ListGroup>
  </div>
  {type !== 'posts'  ? <>
  <div className="menuitem" id="demo6">
    <a> Share with Others</a>
    <div className="menu">
      <div className="menuitem">
      <Link to='/posts' style={{textDecoration:"none",color:"black"}} className="">Share your posts</Link>
      </div>
    </div>
  </div>
  </>:<>
  <div className="menuitem" id="demo7">
    <a> Connect with friends</a>
    <div className="menu">
      <div className="menuitem">
      <Link to='/chat' style={{textDecoration:"none",color:"black"}} className="">Chat with Others</Link>
      </div>
    </div>
  </div></>}
  {user.isAdmin === "true" && 
  <div className="menuitem" id="demo11">
    <a> Manage Post</a>
    <div className="menu">
      <div className="menuitem">
      <Link to='/admin' style={{textDecoration:"none",color:"black"}} className="">Manage Posts</Link>
      </div>
    </div>
  </div>}
  {user.isAdmin === 'true' && <div className="menuitem" id="demo8">
    <a> Create an Event</a>
    <Form onSubmit={handleEvent} className="menu">
        <FormGroup className="mb-3 menuitem">
        <Form.Control type="text" name="name"  placeholder={`Event Name`}   value={inputs.name} onChange={handleChange}></Form.Control>
        </FormGroup>
        <FormGroup className="mb-3 menuitem">
        <Form.Control type="text" name="link"  placeholder={`e.g Zoom Link`}   value={inputs.link} onChange={handleChange}></Form.Control>
        </FormGroup>
        <FormGroup className="mb-3 menuitem">
        <Form.Control type="text" name="about"  placeholder={`About the Event `}   value={inputs.about} onChange={handleChange}></Form.Control>
        </FormGroup>
        <Button   variant="primary" type="submit" style={{ width: "100%", backgroundColor: "orange" }} className="menuitem" disabled={!user} title={"Click twice for a post"}  >Create <i className="fas fa-paper-plane"></i></Button>
      </Form>
  </div>}
    </div>
    </div>
</div>
</div>
</div>
</>
  )
}

export default Sidebar