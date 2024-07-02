import React, { useEffect, useState } from 'react'
import '../DashboardStyle.css'
import star from '../../../assets/star.png'
import axios from 'axios';
import $ from 'jquery'
import { useNavigate } from 'react-router-dom';

function YourCourse() {
  const [createdCourse, setCreatedCourse] = useState()
  const [purchasedCourses, setPurchasedCourses] = useState()
  const [activeTab, setActiveTab] = useState(0)
  const navigate = useNavigate()
  const UserM = JSON.parse(localStorage.getItem('user'))

  useEffect(()=>{
    $('.yourCourseBar p:first-child').addClass('activeYourCourseBar');
    $('.yourCourseBar p:last-child').removeClass('activeYourCourseBar');
  }, [])

  useEffect(() => {
    const fetchingCreatedCourse = async () => {
      await axios.put(`http://localhost:5000/api/courses/fetchUserOwnCourse`, null, {withCredentials:true})
      .then(response => setCreatedCourse(response.data.data))
      .catch(error => console.log(error))
    }
    const fetchingPurchasedCourse = async () => {
      await axios.put(`http://localhost:5000/api/courses/PurchasedCourses`, null, {withCredentials:true})
      .then(response => setPurchasedCourses(response.data.data))
      .catch(error => console.log(error))
    }
    if(activeTab === 0) {
      fetchingCreatedCourse()
    } else if(activeTab === 1) {
      fetchingPurchasedCourse()
    }

  }, [activeTab]);

  console.log(createdCourse, purchasedCourses);

  return (
    <div className='yourCourse_container'>
      <div className="yourCourseBar">
        <p onClick={()=>{
          setActiveTab(0);
          $('.yourCourseBar p:first-child').addClass('activeYourCourseBar');
          $('.yourCourseBar p:last-child').removeClass('activeYourCourseBar'); }}>
            Created Courses
        </p>
        <div className="line"></div>
        <p onClick={()=>{
          setActiveTab(1);
          $('.yourCourseBar p:first-child').removeClass('activeYourCourseBar');
          $('.yourCourseBar p:last-child').addClass('activeYourCourseBar'); }}>
            Purchased Courses
        </p>
      </div>

      <div className="createdCourse_contaier">
        { activeTab === 0 &&
          createdCourse?.map(C=>{
            return  <div key={C?._id} onClick={()=>window.location.href = '/course/'+C?._id} className="cart_course_box">
                      <div className="cart_course_image">
                        <img src={C?.thumbnail_url} alt="" />
                      </div>
                      <div className="cart_course_content">
                        <h1>{C?.title}</h1>
                        <p className='cart_course_author'>Created by {C?.instructor_name}</p>
                        <div className="rating_container ccr" style={{width: 40 }}>
                          <p className="rating">{C?.rating.toFixed(1) + " "} </p>
                          <img src={star} alt="star"/>
                        </div>            
                        <p className='cart_course_price'>₹{C?.price} <del>₹{C?.price+ C?.discount}</del></p>
                      </div>
                    </div>
          })
        }
        {
          activeTab === 0 && createdCourse?.length === 0 && <p className="no_course_found">No course found</p>
        }
        { activeTab === 1 &&
          purchasedCourses?.map(C=>{
            return  <div key={C?.Course[0]?._id} onClick={()=>window.location.href = '/course/'+C?.Course[0]?._id}  className="cart_course_box">
                      <div className="cart_course_image">
                        <img src={C?.Course[0]?.thumbnail_url} alt="" />
                      </div>
                      <div className="cart_course_content">
                        <h1>{C?.Course[0]?.title}</h1>
                        <p className='cart_course_author'>Created by {C?.Course[0]?.instructor_name}</p>
                        <div className="rating_container ccr" style={{width: 40 }}>
                          <p className="rating">{C?.Course[0]?.rating.toFixed(1) + " "} </p>
                          <img src={star} alt="star"/>
                        </div>                
                        <p className='cart_course_price'>₹{C?.Course[0]?.price} <del>₹{C?.Course[0]?.price + C?.Course[0]?.discount}</del></p>
                      </div>
                    </div>
          })
        }
        {
          activeTab === 1 && purchasedCourses?.length === 0 && <p className="no_course_found">No course found</p>
        }
      </div>
    </div>
  )
}

export default YourCourse