import React from 'react'
import { Card, Container } from 'react-bootstrap'
import {useSelector} from 'react-redux'
import './profile.css'

const Profile = () => {
  const user = useSelector((state)=>state.user)
  return (
    <Card  className='my-5 profileCard'>
      <div className="text-center mt-2">
        <img src={`https://therapychat.herokuapp.com/files/${user.picture}`}style={{width:"120px", height:"120px", borderRadius:"50%"}} alt="" />
      </div>
      <Container>
      <div>
        <p><b>Name</b>: <i>{user.name}</i></p>
        <p><b>Email</b>: <i>{user.email}</i></p>
      </div>
      </Container>
    </Card>
  )
}

export default Profile