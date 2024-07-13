import React, {useEffect, useState} from 'react'
import '../DashboardStyle.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
function CreateCourseTab(props) {
  const navigate = useNavigate()
  const [courseDraft, setCourseDraft] = useState(null)
  const UserM = JSON.parse(localStorage.getItem('user'))


  useEffect(() => {
    const fetchAllDrafts = async ()=>{
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/coursedrafts/fetchAllDrafts`, null, {withCredentials: true })
      .then((response) => {
        console.log(response.data.data);
        setCourseDraft(response.data.data)
      })
      .catch((error) => {
        console.log(error);
      })
    }
    fetchAllDrafts()
  }, []);

  console.log(courseDraft);


  return (
    <div id='createCourseBoxUserDashboard'>
      {
        courseDraft &&
        courseDraft.map((course) => {
          return (
            <div id="createCourseBoxUserDashboardBox">
              <h1>{course.title}</h1>
              <p
                onClick={() => navigate("/"+course?._id+'/createcourse')}
                id="createCourseBoxUserDashboardChangeBtn"
              >
                resume
              </p>
            </div>
          );
        })
      }
      <div id="createCourseBoxUserDashboardBox">
        <h1>Create Course</h1>
        <p
          onClick={() => {
            if(UserM?.about === '') {
              props.changeTab(4)
              alert('Please fill your Professional info first')
              return
            }
            navigate('/createcourse')
          }}
          id="createCourseBoxUserDashboardChangeBtn"
        >
          Create
        </p>
      </div>
      
    </div>
  )
}

export default CreateCourseTab