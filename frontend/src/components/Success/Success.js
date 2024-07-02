import React, { useEffect, useState } from 'react';
import './SuccessStyle.css';
import { useNavigate, useParams } from "react-router";
import axios from 'axios';



const Success = () => {
  const navigate = useNavigate();
  const UserM = JSON.parse(localStorage.getItem('user'));
  const {courseId} = useParams()
  
  const redirect = (path) => {
    navigate(path);
  };

  useEffect(()=>{
    const createPurchase = async ()=>{
      await axios.post(`http://localhost:5000/api/purchases/${courseId}/createPurchase`, null, {withCredentials:true
      })
      .then(response => console.log(response))
      .catch(err => console.log(err))
    }
    if(UserM !== null && UserM !== undefined && UserM !== '') {
      createPurchase()
    }
  }, [])
  
  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Payment Successful <br /> <span onClick={()=>redirect('/dashboard')} style={{color: 'blue', cursor:'pointer'}}>Go DashBoard</span></h2>
      </div>
    </div>
  );
};

export default Success;
