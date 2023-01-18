import React,{ useState}  from 'react'
import {Modal,Button, Form,Row, Col, ListGroup} from 'react-bootstrap'
import {useSelector} from 'react-redux'
import axios from 'axios'
import Poster from './Poster'


const CommentSection = ({ postId, comments }) => {
    const user = useSelector((state)=>state.user)
    const [smShow, setSmShow] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true)
    const [inputs, setInputs] = useState({
        comment:""
    })

    //handle inputs
    const handleChange = (e) =>{
    setInputs((prev)=>({
        ...prev,
        [e.target.name]: e.target.value
    }))
    }

    //handling submit
    const handleSubmit = async(e) =>{
        e.preventDefault()
        await axios.put(`https://therapychat.herokuapp.com/posts/comments/${postId}`,{
            comment:inputs.comment,
            commentedBy:user._id
        }).then(()=>{
            setInputs('')
        }).catch(err => console.log(err))
    }
    return (
        <>
    <i className="fas fa-comment mx-2 px-3 " onClick={() => setSmShow(true)}>&nbsp;&nbsp;<span style={{fontFamily:"cursive", fontSize:"15px", fontWeight:"60"}}>{comments.length}</span></i>
    <Modal
    size="sm"
    show={smShow}
    onHide={() => setSmShow(false)}
    aria-labelledby="example-modal-sizes-title-sm"
    >
    <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">
        <div className="row">
        <div style={{display:"flex"}} className="col-md-6 m-auto">
        <img src={`https://therapychat.herokuapp.com/files/${user?.picture}`} className="img-fluid my-3" alt="" style={{width:"50px" ,height:"50px", borderRadius:"50%"}} />
        <p className='mx-2 mt-4'><i>{user.name}</i></p>
        </div>
        </div>
        </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Row>
    <ListGroup style={{maxHeight:"200px", overflow:"scroll"}}>
    {comments.map(comment=>(
    <>
        <ListGroup.Item key={comment._id}>
            <Poster poster={comment.postedBy} type="comment"/>
            <p className="mt-2" style={{fontFamily:"cursive"}}>{comment.text}</p>
        </ListGroup.Item>
    </>
    ))}
    </ListGroup>
        </Row>
        <Form onSubmit={handleSubmit}>
<Row>
    <Col xs={9}>
        <Form.Group>
        <Form.Control type="text" name="comment"  placeholder={`${user.name}, Give your Comment`}  disabled={!user} value={inputs.comment} onChange={handleChange}></Form.Control>
        </Form.Group>
    </Col>
    <Col xs={3}>
    <Button variant="warning" type="submit"><b><i>Send</i></b>  <i className="fas fa-paper-plane" /></Button>
    </Col>
</Row>
</Form>
    </Modal.Body>
    </Modal>
        </>
    )
}

export default CommentSection
