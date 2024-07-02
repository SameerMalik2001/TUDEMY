import React, { useState } from "react";
import "../DashboardStyle.css";
import axios from "axios";

function DeleteAccount() {
  const [password, setPassword] = useState(null);

  const checkPassword = async () => {
    await axios.post(`http://localhost:5000/api/users/checkPassword`,
        { password },
        { withCredentials: true }
      )
      .then(async (response) => {
        if (response.data.data === true) {
          await axios.post(`http://localhost:5000/api/users/deleteAccount`,
              null,
              { withCredentials: true }
            )
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="password_container">
      <div className="box_password">
        <h1>Delete Account</h1>
        <div className="cover">
          <p>Enter Password</p>
          <input
            onPaste={(e) => e.preventDefault()}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
          />
        </div>
        <p
          onClick={() => checkPassword()}
          style={{ backgroundColor: "red", color: "white" }}
          className="changeBtn"
        >
          Delete Account
        </p>
      </div>
    </div>
  );
}

export default DeleteAccount;
