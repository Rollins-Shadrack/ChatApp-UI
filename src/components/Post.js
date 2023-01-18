import React,{useState, useEffect} from 'react'
import { Form, Row, Col, Button, Card, Container } from 'react-bootstrap'
import {useSelector} from 'react-redux'
import axios from 'axios'
import './post.css'
import Poster from './Poster'
import CommentSection from './CommentSection'


const Post = () => {
  const user = useSelector((state)=>state.user)
  const [image, setImage] = useState()
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [currentlyUploading, setCurrentlyUploading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [picture, setPicture] = useState('')
  const [posts,setPosts] = useState([])
  const [post, setPost] = useState()
  const [inputs, setInputs] = useState({
    caption:"",
    anonymous:"false"
})

    //for file
    const handleImages = (e) => {
      const file = e.target.files[0]
    setImage(file)
    };

      //handle inputs
    const handleChange = (e) =>{
      setInputs((prev)=>({
          ...prev,
          [e.target.name]: e.target.value
      }))
    }
    //uploadImage
const uploadImage = () =>{
  if(image){
    const fd = new FormData();
  fd.append('image',image,image.name)
  console.log(fd)
  axios.post(`https://therapychat.herokuapp.com/files/profile_picture`,fd,{
    onUploadProgress: (progressEvent) => {
      setProgress((progressEvent.loaded / progressEvent.total) * 100);
    },
  }).then(({data}) =>{
    setPicture(data)
    setImage('');
    setInputContainsFile(false)
    setCurrentlyUploading(false)
  }).catch((err) =>{
    console.log(err)
    setInputContainsFile(false);
    setCurrentlyUploading(false);
  })
  }
  
}

    const handleSubmit = async(e) =>{
      e.preventDefault()
      console.log(inputs)
      uploadImage()
      if(picture !== ''){
        await axios.post('https://therapychat.herokuapp.com/posts/posts',{
        caption:inputs.caption,
        picture:picture,
        poster:user._id,
        anonymous: inputs.anonymous
      }).then(()=>{
        setInputs('')
      }).catch(err => console.log(err))
      }
    }
    const handleLike = async(postId) =>{
      await axios.post(`https://therapychat.herokuapp.com/posts/like/${postId}/${user._id}`).catch(err => console.log(err))
      }
useEffect(()=>{
  const getPost = async()=>{
    const res =  await axios.get('https://therapychat.herokuapp.com/posts/posts').catch(err => console.log(err));
    setPosts(res.data)
  } 
  getPost()
})
  return (
    <div className="postBody">
      <Form className="my-3 postBody" onSubmit={handleSubmit}>
        <Row className="text-center mb-3">
          <Col xs={9}>
            <Form.Group>
            <Form.Control type="text" name="caption"  placeholder={`What's on your mind ${user.name}`}  disabled={!user} value={inputs.caption} onChange={handleChange}></Form.Control>
            </Form.Group>
          </Col>
          <Col xs={3}>
          <Button  variant="primary" type="submit" style={{ width: "100%", backgroundColor: "orange" }} disabled={!user} title={"Click twice for a post"}  ><i className="fas fa-paper-plane"></i></Button>
          </Col>
        </Row>
        <Row className='text-center'>
          <Col xs={6}>
            <label htmlFor="file" className="custom-file-upload"><i className="fas fa-image"></i></label>
            <input type="file" name="file" id="file" onChange={handleImages}/>
          </Col>
          <Col xs={6}>
            <label htmlFor="anonymous" title="post as anonymous" className="mx-2">anonymous</label> 
            <input type="checkbox" value={'true'} name="anonymous" id='anonymous' title="post as anonymous" onChange={handleChange} />
          </Col>
        </Row>
      </Form>
      
      {posts.map(post=>(
        <Card key={post._id} className="mb-3">
          <Container  className="my-3">
            <Poster poster={post.poster} isAnonymous={post.anonymous}/>
          </Container>
          <div style={{borderBottom:"1px solid black",borderTop:"3px solid black"}}>
          <div className="text-center">
          <img src={`https://therapychat.herokuapp.com/files/${post?.picture}`} className="img-fluid my-3" alt="" style={{width:"520px" ,height:"300px", borderRadius:"10px"}} />
          </div>
          <div className="px-2">
            <p style={{fontFamily:"cursive"}}>{post.caption}</p>
            {/* <LikeSection postId={post._id} likes={post.likes}/> */}
            <i  className="fas fa-heart px-2 text-dark" onClick={()=>handleLike(post._id)}  >&nbsp;&nbsp;<span style={{fontFamily:"cursive", fontSize:"15px", fontWeight:"60"}}>{post.likes.length}</span></i>
            <CommentSection postId={post._id} comments={post.comments}/>
            <i className="fas fa-share   "></i>
          </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default Post