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

  
  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Payment Fail <br /> <span onClick={()=>redirect('/dashboard')} style={{color: 'blue', cursor:'pointer'}}>Go DashBoard</span></h2>
      </div>
    </div>
  );
};

export default Success;
