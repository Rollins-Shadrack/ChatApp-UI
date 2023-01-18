import React,{useEffect, useState} from 'react'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import axios from 'axios'
import './admin.css'
import {useSelector} from 'react-redux'

const Admin = () => {
    const user = useSelector((state)=>state.user)
    const [users,setUsers] = useState([])
    const [posts,setPosts] = useState([])

    const deleteUser = async(id) =>{
        await axios.post(`https://therapychat.herokuapp.com/users/users/${id}`).catch(err => console.log(err));
    }
    const deletePost = async(id) =>{
        await axios.post(`https://therapychat.herokuapp.com/posts/posts/${id}`).catch(err => console.log(err));
    }
    const addAdmin = async(id) =>{
        await axios.post(`https://therapychat.herokuapp.com/users/admin/${id}`).catch(err => console.log(err));
    }
    useEffect(()=>{
        //getting all users
        const getUsers = async() =>{
            const res = await axios.get('https://therapychat.herokuapp.com/users/users').catch(err => console.log(err));
            setUsers(res.data)
        }

        //getting all post
        const getPosts = async() =>{
            const res = await axios.get('https://therapychat.herokuapp.com/posts/posts').catch(err => console.log(err));
            setPosts(res.data)
        }
        getUsers()
        getPosts()
    })
return (
<Container style={{overflowX:"hidden"}}>
{!user && <div className='alert alert-danger'>Please Login</div>}
    {user.isAdmin === 'true' ?
    <Row>
    <Col md={3}>
        <Sidebar type='admin'/>
    </Col>
    <Col md={4}>
    <ListGroup>
        <ListGroup.Item>
            <h3 className="text-center">All Users <span className="badge rounded-pill bg-success">{users.length}</span> </h3>
        </ListGroup.Item>
    </ListGroup>
    <ListGroup className='allUsers'>
        {users.map((user)=>(
            <ListGroup.Item key={user._id} >
                <Row>
                    <Col xs={3}>
                        <img src={`https://therapychat.herokuapp.com/files/${user.picture}`} style={{width:"50px",height:"50px",borderRadius:"50%"}}  alt="" />
                    </Col>
                    <Col xs={5}>
                        <p><b>{user.name}</b></p>
                    </Col>
                    <Col xs={4}>
                    <div style={{display:"block"}}>
                    { user.email !== 'rollo@gmail.com' && <i className="fas fa-trash px-1   text-danger"onClick={()=> deleteUser(user._id)}><span style={{fontSize:"8px",textTransform:"lowercase"}}>delete</span></i>}
                    {user.email !== 'rollo@gmail.com' && <i className={user.isAdmin === 'false' ? "fas  fa-plus-circle   text-success py-2 px-1" :"fas  fa-minus-circle   text-danger py-2 px-1"} onClick={()=> addAdmin(user._id)}><span style={{fontSize:"8px",textTransform:"lowercase"}}>admin</span></i>}
                    </div>
                    </Col>
                </Row>
            </ListGroup.Item>
        ))}
    </ListGroup>
    </Col>
    <Col md={5}>
    <ListGroup>
        <ListGroup.Item>
            <h3 className="text-center">All Posts <span className="badge rounded-pill bg-success">{posts.length}</span> </h3>
        </ListGroup.Item>
    </ListGroup>
        <ListGroup className='allUsers'>
            {posts.map(post =>(
                <ListGroup.Item key={post._id}>
                <Row>
                    <Col xs={3}>
                        <img src={`https://therapychat.herokuapp.com/files/${post.picture}`} style={{width:"90px",height:"60px",borderRadius:"5px"}}  alt="" />
                    </Col>
                    <Col xs={6}>
                        <p>{post.caption}</p>
                        <div style={{display:"flex"}}>
                        <i className="fas fa-heart mx-3">&nbsp;&nbsp;<span style={{fontFamily:"cursive", fontSize:"15px", fontWeight:"60"}}>{post.likes.length}</span></i>
                        <i className="fas fa-comment">&nbsp;&nbsp;<span style={{fontFamily:"cursive", fontSize:"15px", fontWeight:"60"}}>{post.comments.length}</span></i>
                        </div>
                    </Col>
                    <Col xs={3}>
                    <i className="fas fa-trash   text-danger"onClick={()=> deletePost(post._id)}></i>
                    </Col>
                </Row>
                </ListGroup.Item>
            ))}
        </ListGroup>
    </Col>
</Row>:<><div className='alert alert-danger'>You are Not An Admin</div></>}
</Container>
)
}

export default Admin