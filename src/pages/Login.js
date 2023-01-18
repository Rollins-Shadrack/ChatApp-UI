import React, {useState, useContext} from 'react'
import { Col, Container, Form, Row, Button , Spinner} from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import './login.css'

const Login = () => {
    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    const navigate = useNavigate();
    const { socket } = useContext(AppContext);
    const [inputs, setInputs] = useState({
        email:"",
        password:""
    })
      //handle inputs
const handleChange = (e) =>{
    setInputs((prev)=>({
        ...prev,
        [e.target.name]: e.target.value
    }))
}
const handleSubmit = (e) =>{
    e.preventDefault()
    const email = inputs.email
    const password = inputs.password
    loginUser({ email, password }).then(({ data }) => {
        if (data) {
            // socket work
            socket.emit("new-user");
            // navigate to the chat
            navigate("/chat");
        }
    });
}
return (
    <Container>
    <Row>
        <Col md={5} className="login__bg g-3"></Col>
        <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column g-4">
            <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                {error && <p className="alert alert-danger">{error.data}</p>}
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" value={inputs.email}  placeholder="Enter email" onChange={handleChange}  />
                    <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={inputs.password}  placeholder="Password" onChange={handleChange}  />
                </Form.Group>
                <Button variant="primary" type="submit"> 
                {isLoading ? <Spinner animation="grow" /> : "Login"}
                </Button>
                <div className="py-4">
                    <p className="text-center">
                        Don't have an account ? <Link to="/signup">Signup</Link>
                    </p>
                </div>
            </Form>
        </Col>
    </Row>
</Container>
  )
}

export default Login