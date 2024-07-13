import React, { useEffect, useState } from 'react';
import './StartCourseStyle.css';
import { useNavigate, useParams } from "react-router";
import axios from 'axios'



const StartCourse = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(null)

  
  const savenext = async()=>{
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/coursedrafts/updateTextData/`, {courseDraftId:null, title}, {withCredentials:true})
    .then(response=>navigate(`/${response?.data?.data?._id}/createCourse`))
    .catch(err=>console.log(err))
  }
  
  return (
    <div className='startcourse_container'>
      <div className="titleBOx">
        <h6><strong>Title</strong></h6>
        <input onChange={e=>setTitle(e.target.value)} maxLength={60} placeholder="max 60 character" type="text" />
        <p onClick={()=>savenext()}>Save & Next</p>
      </div>
    </div>
  );
};

export default StartCourse;
