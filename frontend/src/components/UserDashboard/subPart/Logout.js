import React from 'react'
import '../DashboardStyle.css'
import axios from 'axios'


function Logout(props) {

  const logout = async () => {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`,null,  {
      withCredentials: true
    })
    .then((response) => {
      console.log(response.data.data);
      localStorage.removeItem('user')
      props.myFn(false)
      window.location.href = "/"
    })
    .catch((err) => console.log(err))
  }

  return (
    <div className="password_container">
      <div className="box_password">
        <h1>Logout Account</h1>
        <p
          onClick={() => logout()}
          style={{ backgroundColor: "red", color: "white" }}
          className="changeBtn"
        >
          Logout
        </p>
      </div>
    </div>
  )
}

export default Logout