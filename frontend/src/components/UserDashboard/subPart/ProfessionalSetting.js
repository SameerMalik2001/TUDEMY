import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfessionalSetting() {
  const [profession, setProfession] = useState('')
  const [about, setAbout] = useState('')
  const navigate = useNavigate()
  const UserM = JSON.parse(localStorage.getItem('user'))

  useEffect(()=>{
    if(UserM?._id === undefined || UserM?._id === null || UserM?._id === '') {
      navigate('/signup')
    }
    else {
      setProfession(UserM.profession)
      setAbout(UserM.about)
    }
  }, [])

  const handleSubmit = async () => {
    console.log(profession, about)
    if(profession.length > 0 && about.length > 0) {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/updateProfessionalInfo`, {profession, about}, {withCredentials:true})
      .then(response=>{console.log(response);localStorage.setItem('user',JSON.stringify(response.data.data))})
      .catch(err => {console.log(err)})
    }
  }

  return (
    <div className='password_container'>
      <div className="box_password">
        <h1>Profession Info</h1>
        <div className="cover">
          <p>Your Profession</p>
          <input defaultValue={profession} onChange={(e)=>setProfession(e.target.value)} style={{fontSize:20}} required type="text" />
        </div>
        <div className="cover">
          <p>About Yourself</p>
          <textarea defaultValue={about} onChange={(e)=>setAbout(e.target.value)} className='taps' required type="password" />
        </div>
        <p onClick={()=>handleSubmit()} className='changeBtn'>Save</p>
      </div>
    </div>
  )
}

export default ProfessionalSetting