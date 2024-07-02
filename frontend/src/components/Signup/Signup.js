import React, { useState } from 'react';
import './SignupStyle.css';
import { useNavigate } from "react-router";
import Atropos from "atropos/react";
import axios from 'axios';
import 'atropos/css';



const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const redirect = (path) => {
    navigate(path);
  };

  const changeData = (e, num) => {
    if(num === 0) {
      setUsername(e.target.value)
    } else if(num === 1) {
      setEmail(e.target.value)
    } else {
      setPassword(e.target.value)
    }
  }

  const submit = (e) => {
    e.preventDefault();
    const createUser = async()=>{
      await axios.post(`http://localhost:5000/api/users/register`, {
        username: username,
        email: email,
        password:password
      })
      .then(response=>{
        redirect('/signin')
      })
      .catch(error=>{
        console.log(error);
      })
    }
    createUser()
  }
  
  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={(e)=>submit(e)} className="signup-form">
          <div className="form-group">
            <label htmlFor="username">Full Name:</label>
            <input required={true} type="text" id="username" name="username" onChange={(e)=>changeData(e, 0)}/>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input required={true} type="email" id="email" name="email" onChange={(e)=>changeData(e, 1)}/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input required={true} type="password" id="password" name="password" onChange={(e)=>changeData(e, 2)}/>
          </div>
          <Atropos shadow={false} rotateXMax={10} rotateYMax={10} className="btn">
            <button type="submit">Sign Up</button>
          </Atropos>
          <p>Already have an account? <span onClick={()=>redirect('/signin')}>Sign In</span></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
