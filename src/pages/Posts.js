import React from 'react'
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from '../components/Sidebar';
import Post from '../components/Post'
import Profile from '../components/Profile'


const Posts = () => {
  return (
    <Container >
      <Row>
        <Col md={3} >
          <Sidebar type="posts" />
        </Col>
        <Col md={6}>
          <Post/>
        </Col>
        <Col md={3}>
          <Profile />
        </Col>
      </Row>
    </Container>
  )
}

export default Posts