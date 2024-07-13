import React, { useEffect, useState } from 'react'
import '../DashboardStyle.css'
import star from '../../../assets/star.png'
import axios from 'axios';
import $ from 'jquery'
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const [createdCourse, setCreatedCourse] = useState()
  const navigate = useNavigate()
  const UserM = JSON.parse(localStorage.getItem('user'))

  useEffect(()=>{
    $('.yourCourseBar p:first-child').addClass('activeYourCourseBar');
    $('.yourCourseBar p:last-child').removeClass('activeYourCourseBar');
  }, [])

  useEffect(() => {
    const fetchingWishlistCourse = async () => {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/wishlists/${UserM?._id}/fetchWishlist`, null, {withCredentials:true})
      .then(response => {console.log(response.data.data);setCreatedCourse(response.data.data)})
      .catch(error => console.log(error))
    }

    if(UserM?._id !== undefined && UserM?._id !== null && UserM?._id !== '')
      fetchingWishlistCourse()


  }, []);

  console.log(createdCourse);

  return (
    <div className='yourCourse_container'>
      <p style={{fontSize:25, marginTop:20}}>Wishlist</p>
      <div className="createdCourse_contaier">
        { 
          createdCourse?.map(C=>{
            return  <div key={C?.course[0]?._id} onClick={()=>window.location.href = '/course/'+C?._id} className="cart_course_box">
                      <div className="cart_course_image">
                        <img src={C?.course[0]?.thumbnail_url} alt="" />
                      </div>
                      <div className="cart_course_content">
                        <h1>{C?.course[0]?.title}</h1>
                        <p className='cart_course_author'>Created by {C?.course[0]?.instructor_name}</p>
                        <div className="rating_container ccr" style={{width: 40}}>
                          <p className="rating">{C?.course[0]?.rating.toFixed(1) + " "} </p>
                          <img src={star} alt="star"/>
                        </div>                
                        <p className='cart_course_price'>₹{C?.course[0]?.price} <del>₹{C?.course[0]?.price + C?.course[0]?.discount}</del></p>
                      </div>
                    </div>
          })
        }
        {
          createdCourse?.length === 0 && <p style={{textAlign:'center', marginTop:10, fontSize:18}}>No Course Added</p>
        }
        
      </div>
    </div>
  )
}


export default Wishlist