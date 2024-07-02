import React, { useState } from 'react'
import '../DashboardStyle.css'
import axios from 'axios'

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmPassword, setConfirmPassword] = useState(null)

  const ChangePassword = async () => {
    if(confirmPassword === newPassword) {
      await axios.put(`http://localhost:5000/api/users/changePassword`, 
      {oldPassword, newPassword},
      {withCredentials: true}
      )
      .then(response =>console.log(response))
      .catch(error => console.log(error))
    }
  }
  return (
    <div className='password_container'>
      <div className="box_password">
        <h1>Change Password</h1>
        <div className="cover">
          <p>Old Password</p>
          <input onChange={(e)=>setOldPassword(e.target.value)} required type="password" />
        </div>
        <div className="cover">
          <p>New Password</p>
          <input onChange={(e)=>setNewPassword(e.target.value)} required type="password" />
        </div>
        <div className="cover">
          <p>confirm Password</p>
          <input onChange={(e)=>setConfirmPassword(e.target.value)} required type="password" />
        </div>
        <p onClick={()=>ChangePassword()} className='changeBtn'>Change</p>
      </div>
    </div>
  )
}

export default ChangePassword