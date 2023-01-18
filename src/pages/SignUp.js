import React, {useState} from 'react'
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import {useSignupUserMutation} from '../services/appApi'
import { Link, useNavigate } from "react-router-dom";
import botImg from "../assets/logo.png";
import axios from 'axios'
import './signup.css'


const SignUp = () => {
    //image upload states
    const [image, setImage] = useState();
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    const [inputContainsFile, setInputContainsFile] = useState(false);
    const [currentlyUploading, setCurrentlyUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [progress, setProgress] = useState(null);
    const [picture, setPicture] = useState('')
    const navigate = useNavigate()

  const [inputs, setInputs] = useState({
    name:"",
    email:"",
    password:""
})
//validate the image
const handleFile = (e) =>{
  const file = e.target.files[0]
    setImage(file)
    setImagePreview(URL.createObjectURL(file));
}

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
      setImage(null);
      setInputContainsFile(false)
      setCurrentlyUploading(false)
    }).catch((err) =>{
      console.log(err)
      setInputContainsFile(false);
      setCurrentlyUploading(false);
    })
    }else{
      alert("Please Upload a profile a profile Photo")
    }
    
}
const name = inputs.name
const email = inputs.email
const password = inputs.password
//submit the form
  const handleSubmit = async(e) =>{
    e.preventDefault()
      uploadImage()
      if(picture !== ''){
        signupUser({name, email, password, picture}).then(({ data }) => {
          if (data) {
              //console.log(picture)
              //console.log(data);
              navigate("/chat");
          }
      })
      }
  }
  return (
      <Container>
          <Row>
              <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                  <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSubmit}>
                      <h1 className="text-center">Create account</h1>
                      <div className="signup-profile-pic__container">
                          <img src={imagePreview || botImg} className="signup-profile-pic" />
                          <label htmlFor="file" className="image-upload-label">
                              <i className="fas fa-plus-circle add-picture-icon"></i>
                          </label>
                          <input type="file" name='file' id='file' hidden onChange={handleFile}  />
                      </div>
                      {error && <p className="alert alert-danger">{error.data}</p>}
                      <Form.Group className="mb-3" controlId="formBasicName">
                          <Form.Label>Name</Form.Label>
                          <Form.Control type="text" name="name" value={inputs.name}  placeholder="Your name" onChange={handleChange} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control type="email" name="email" value={inputs.email}  placeholder="Enter email" onChange={handleChange}  />
                          <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control type="password" name="password" value={inputs.password}  placeholder="Password" onChange={handleChange}  />
                      </Form.Group>
                      <Button variant="primary" type="submit" onClick={handleSubmit}>
                      {isLoading ? "Signing you up..." : "Signup"}
                      </Button>
                      <div className="py-4">
                          <p className="text-center">
                              Already have an account ? <Link to="/login">Login</Link>
                          </p>
                      </div>
                  </Form>
              </Col>
              <Col md={5} className="signup__bg"></Col>
          </Row>
      </Container>
  )
}

export default SignUp