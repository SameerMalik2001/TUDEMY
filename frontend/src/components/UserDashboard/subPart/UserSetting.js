import React, { useEffect, useState } from 'react'
import '../DashboardStyle.css'
import axios from 'axios'

function UserSetting() {
  const UserM = JSON.parse(localStorage.getItem('user'))
  const [username, setUsername] = useState(UserM?.username)
  const [usernameChanged, setUsernameChanged] = useState(false)
  const [email, setEmail] = useState(UserM?.email)
  const [emailChanged, setEmailChanged] = useState(false)
  const [tokens, setTokens] = useState()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {

    setTimeout(()=>{
      if(!tokens) {
        const fetchCookies = async () => {
          await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/getCookies`, {withCredentials: true})
          .then((response) => {
            setTokens(response.data.data)
            TokenValidation(response.data.data)
          })
          .catch((err) => console.log(err))
        }
        fetchCookies()
      }
    }, 200)
    
  }, []);


  const TokenValidation = (tokens1) => {
    console.log(tokens1);
    if(loggedIn === false) {
      if(tokens1?.accessToken === undefined || tokens1?.accessToken === null || tokens1?.accessToken === "") {
        setLoggedIn(false)
        console.log("chala false ho gaya", tokens1?.accessToken);
      } 
      else {
        const checkForTokenValidation = async () => {
          await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/tokenValidation`, {
             withCredentials: true })
            .then((response) => {
              console.log(tokens1);
              console.log(response.data.data);
              if(response.data.data !== undefined)
              setLoggedIn(true)
            })
            .catch((error) => {
              console.log(error);
              setLoggedIn(false)
            })
          }
          checkForTokenValidation()
        }
      }
  }

  const saveChange = async() => {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/users/updateAccountDetails`, {username, email},
      {withCredentials:true}
    ).then((response) => {
      console.log(response);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      setEmailChanged(false)
      setUsernameChanged(false)
    })
    .catch(error => console.log(error));
  }

  return (
    <div className='user_container'>
      <div className="user_content">
        <div className="usernameBox">
          <p>Username</p>
          <input onChange={(e)=>{setUsername(e.target.value);setUsernameChanged(true)}} type="text" defaultValue={UserM?.username}/>
          {
            usernameChanged && <p onClick={()=>saveChange()}>Save Change</p>
          }
        </div>
        <div className="emailBox">
          <p>Email</p>
          <input onChange={(e)=>{setEmail(e.target.value);setEmailChanged(true)}} type="email" defaultValue={UserM?.email}/>
          {
            emailChanged && <p onClick={()=>saveChange()}>Save Change</p>
          }
        </div>
      </div>
    </div>
  )
}

export default UserSetting