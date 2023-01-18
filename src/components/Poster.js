import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { Col, Row } from 'react-bootstrap'

const Poster = ({poster, type, isAnonymous}) => {
    const [posterDetails, setPosterDetails] = useState([])
    useEffect(()=>{
        const getPoster = async() =>{
        const res = await axios.get(`https://therapychat.herokuapp.com/posts/poster/${poster}`).catch(err => console.log(err));
        setPosterDetails(res.data)
        }
        getPoster()
    })
    //console.log(posterDetails)
  return (
    <div>
        {isAnonymous !== 'true' ? <Row>
            <Col xs={9}>
                <img src={`https://therapychat.herokuapp.com/files/${posterDetails?.picture}`} style={{height:"40px", width:"40px",borderRadius:"50%"}} alt="" />
                <b><i>{posterDetails?.name}</i></b>
            </Col>
            <Col xs={3}>
            {type !== 'comment' ? <i className="fas fa-ellipsis  "></i> : <></>}
            </Col>
        </Row>:<p>Anonymous</p>}
    </div>
  )
}

export default Poster