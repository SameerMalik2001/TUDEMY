import './SingleCourseStyle.css';
import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import heart from "../../assets/heart.png";
import cart from "../../assets/cart.png";
import search from "../../assets/search.png";
import gt from "../../assets/gt.png";
import heartsolid from '../../assets/heartsolid.png';
import user from "../../assets/user.png";
import axios from "axios";
import 'atropos/css';
import Atropos from 'atropos/react';
import {useNavigate} from 'react-router';
import star from '../../assets/star.png'
import $ from 'jquery';
import {useParams} from 'react-router';
import { loadStripe } from "@stripe/stripe-js";
import { debounce } from 'lodash';
import arrow from '../../assets/arrow.png'

const SingleCourse = () => {
  const [courses, setCourses] = useState(null);
  const {courseId} = useParams();
  const UserM  = JSON.parse(localStorage.getItem('user'));
  const [activeCat, setActiveCat] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null)
  const [carted, setCarted] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [searchValue, setSeatchValue] = useState('')
  const [searchCourses, setSearchCourses] = useState([])
  const debouncedSetInputValue = debounce(setSeatchValue, 500);
  const [videoData, setVideoData] = useState([])
  const CatList0 = [
    "Web development",
    "Data science",
    "Mobile development",
    "Programming language",
    "Game development",
    "Database desing and development",
    "Software testing",
    "Software engineering",
    "Software dev tool",
    "NO coding dev",
  ];
  const CatList = [
    [
      "Javascript",
      "ReactJs",
      "AngularJS",
      "NextJS",
      "CSS",
      "HTML",
      "ASP.net core",
      "Node.js",
    ],
    [
      "Machine Learning",
      "Python",
      "Deep Learning",
      "Artificial Intelligence",
      "NLP",
      "LangChain",
      "Data Analysis",
      "R",
    ],
    [
      "Google Flutter",
      "Android Development",
      "IOS",
      "React Native",
      "Dart",
      "Swift",
      "Kotlin",
      "Mobile Development",
      "SwiftUI",
    ],
    [
      "Python",
      "JavaScript",
      "ReactJS",
      "C++",
      "C#",
      "C",
      "GO",
      "Java",
      "Spring Framework",
    ],
    [
      "Unreal Engine",
      "UnityEngine",
      "Game Development Fundamentals",
      "Godot Foundation",
      "C#",
      "C++",
      "3D Game Development",
      "2D Game Development",
      "Unreal Engine Blueprint",
    ],
    [
      "SQLS",
      "SQL Server",
      "MySQL Server",
      "NoSQL Server",
      "DBMS",
      "PostgreSQL",
      "Apache Kafka",
      "MongoDB",
      "Oracle SQL",
      "DB Programming",
    ],
    [
      "Selenium webdriver",
      "Automation testing",
      "Java",
      "Postman",
      "selenium testing framework",
      "API testing",
    ],
    [
      "Data Structures",
      "Algorithms",
      "Coding Interviews",
      "Microservices",
      "Backend development",
      "Python",
    ],
    [
      "Docker",
      "Git",
      "Kubernates",
      "Jira",
      "Prompt Engineering",
      "GitHub",
      "DevOps",
    ],
    [
      "Generative AI",
      "WordPress",
      "Web testing",
      "Web Design",
      "App development",
    ],
  ];


  const transformData = (data1) => {
    const sectionsMap = {};
  
    data1.forEach(item => {
      const { _id, section, video_length, section_title, lecture, lecture_title, description, video_url } = item;
      if (!sectionsMap[section]) {
        sectionsMap[section] = {
          section_no: section,
          section_title: section_title,
          lecture: []
        };
      }
  
      sectionsMap[section].lecture.push({
        lecture_no: lecture,
        lecture_title: lecture_title,
        file: video_url,
        description: description,
        _id,
        video_length
      });
    });

    // Convert sections map to array and sort by section number
    const sectionsArray = Object.values(sectionsMap).sort((a, b) => a.section_no - b.section_no);

    // Sort lectures within each section by lecture number
    sectionsArray.forEach(section => {
      section.lecture.sort((a, b) => a.lecture_no - b.lecture_no);
    });

    return sectionsArray;
  };


  const redirect = (path) => {
    navigate(path);
  }

  useEffect(() => {

    

    const fethingCourse = async () => {
      console.log("fetchingCourse");
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}`, null, {withCredentials: true})
        .then((response) => {setCourses(response.data.data);setPurchased(response.data.data?.purchased)})
        .catch((error) => console.log(error));
    };

    const fethingCourse2 = async () => {
      console.log("fetchingCourse2");
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}/for/LogoutUser`)
        .then((response) => {setCourses(response.data.data);console.log(response.data.data);})
        .catch((error) => console.log(error));
    };

    const fetchingVideos = async()=>{
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${courseId}/logout`)
       .then((response) => {setVideoData(transformData(response.data.data))})
       .catch((error) => console.log(error));
    }

    if(UserM?._id === undefined) {
      fethingCourse2()
    } else {
      fethingCourse2();
    }
    fetchingVideos()

    setTimeout(()=>{
      TokenValidation()
    }, 200)
    
  }, []);


  const TokenValidation = () => {
    if (loggedIn === false) {
      const checkForTokenValidation = async () => {
        await axios
          .get(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/tokenValidation`,
            {
              withCredentials: true
            }
          )
          .then((response) => {
            console.log(response.data.data);
            if (response.data.data !== undefined) setLoggedIn(true);
          })
          .catch((error) => {
            console.log(error);
            setLoggedIn(false);
          });
      };
      checkForTokenValidation();
    }
  };

  const logout = async () => {
    console.log("logout "+ tokens.accessToken);
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`,null,  {

      withCredentials: true
    })
    .then((response) => {
      console.log(response.data.data);
      setLoggedIn(false)
      localStorage.removeItem('user')
      window.location.reload()
    })
    .catch((err) => console.log(err))
  }


  const enter = (dropdownName) => {
      $(dropdownName).addClass("active");
      $(dropdownName).removeClass("unactive");
  };

  const out = (dropdownName) => {
      $(dropdownName).addClass("unactive");
      $(dropdownName).removeClass("active");
  };

  useEffect(()=>{
    const check = async()=>{
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/carts/${UserM?._id}/${courseId}/check`, null, {withCredentials:true})
      .then(response => {console.log(response.data.data); setCarted(response.data.data)})
      .catch(err => console.log(err))
    }
    check()

    const check1 = async()=>{
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/wishlists/${UserM?._id}/${courseId}/check`, null, {withCredentials:true})
      .then(response => {console.log(response.data.data); setWishlisted(response.data.data)})
      .catch(err => console.log(err))
    }
    check1()
  }, [])

    


  const addToCart = async() => {
    if(loggedIn === false) {
      return redirect('/signin')
    }
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/carts/${UserM?._id}/${courseId}/createCart`, null, {withCredentials:true})
    .then(response => {console.log(response); setCarted(true); setWishlisted(false)})
    .catch(err => console.log(err))
  }

  const addToWishlist = async() => {
    if(loggedIn === false) {
      return redirect('/signin')
    }
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/wishlists/${UserM?._id}/${courseId}/createwishlist`, null, {withCredentials:true})
    .then(response => {console.log(response); setWishlisted(true); setCarted(false)})
    .catch(err => console.log(err))
  }

  const deleteToCart = async () => {
    if(loggedIn === false) {
      return redirect('/signin')
    }
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/carts/${UserM?._id}/${courseId}/delete`, {withCredentials:true})
    .then(response => {console.log(response.data.data);setCarted(false)})
    .catch(err => console.log(err))
  }

  const deleteToWishlist = async () => {
    if(loggedIn === false) {
      return redirect('/signin')
    }
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/wishlists/${UserM?._id}/${courseId}/delete`, {withCredentials:true})
    .then(response => {console.log(response.data.data);setWishlisted(false)})
    .catch(err => console.log(err))
  }

  const payment = async()=>{
    if (UserM?._id === undefined || UserM?._id === null || UserM?._id === "") {
      return navigate("/signin");
    }
    if(purchased) {
      return null
    }
    let C = courses?.course
    const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);
    const body = {
      C
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/payments/paymentDone`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
        credentials: 'include'
      },
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  }

  useEffect(()=>{
    if(searchValue === '') {
      searchbarClose()
    }
    
    const searchCourses = async()=> {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${searchValue}/searchCourse`)
      .then(response=>{setSearchCourses(response.data.data);
        if(response.data.data.length > 0) {
          searchbarOpen()
        } else if(response.data.data.length === 0){
          searchbarClose()
        }
      })
      .catch(error=>console.log(error))
    }
    if(searchValue !== '') {
      searchCourses()
    }
  }, [searchValue])

  const searchbarOpen = () => {
    $('.search_dropdown').addClass('active');
    $('.search_dropdown').removeClass('unactive');
  }
  const searchbarClose = () => {
    $('.search_dropdown').removeClass('active');
    $('.search_dropdown').addClass('unactive');
  }

  const openSection = (sec, Ind) => {
    if(!$(`${sec} img`).hasClass('addRatatinInArrow')) {
      $(`${sec} img`).addClass('addRatatinInArrow')
      $('.videosTitle'+Ind).removeClass('hideVideo')
      $('.videosTitle'+Ind).addClass('showVideo')
    } else {
      $(`${sec} img`).removeClass('addRatatinInArrow')
      $('.videosTitle'+Ind).addClass('hideVideo')
      $('.videosTitle'+Ind).removeClass('showVideo')
    }
  }

  

  console.log(courses, purchased, UserM?._id);
  console.log(videoData);


  return (
    <div className="HomeContainer">
      {/* nav bar code  */}
      <nav>
        <div onClick={()=>redirect('/')} onMouseEnter={()=>out(".dropdown")} className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h1 className="category" onMouseOver={()=>enter(".dropdown")}>
          Category
        </h1>
        <div onMouseEnter={()=>{out(".dropdown"); out(".dropdown2")}} className="inputContainer">
          <form onSubmit={(e)=>navigate('/search/'+searchValue)}>
            <input
              type="text"
              name="search"
              placeholder="Search for anything..."
              onChange={(e)=>debouncedSetInputValue(e.target.value)}
            />
          </form>
          <div onMouseEnter={()=>out(".dropdown1")} className="searchBtn">
            <img src={search} alt="" />
          </div>
        </div>

        <div onClick={()=>redirect('/wishlist')} onMouseEnter={()=>{out(".dropdown1");out(".dropdown2")}} className="icon">
          <img src={heart} alt="logo" />
        </div>
        <div onClick={()=>redirect('/cart')} onMouseEnter={()=>{
            console.log("chalna suru");
            out(".dropdown2");
            out(".dropdown1");
            console.log("chalna band");
          }} className="icon">
          <img src={cart} alt="logo" />
        </div>
        {
          loggedIn && 
          <div onMouseOver={()=>enter(".dropdown2")} className="circle">
            <img src={user} alt="" />
          </div>
        }

        {
          !loggedIn && 
          <div onMouseOver={()=>enter(".dropdown1")} className="circle">
            <img src={user} alt="" />
          </div>
        }

        {/* dropdown */}
        <div className="dropdown unactive">
          <div className="part1">
            {CatList0.map((item, index) => {
              return (
                <div key={index} className="Cat_lists">
                  <p onMouseOver={() => setActiveCat(index)}>{item}</p>
                  <img src={gt} alt="" />
                </div>
              );
            })}
          </div>
          <div className="part2">
            <p>Popular Topics</p>
            {CatList[activeCat]?.map((item, index) => {
              return <p onClick={()=>navigate('/search/'+item)} key={index}>{item}</p>;
            })}
          </div>
        </div>

        {/* sign up and login dropdown menu */}
        <div className="dropdown1 unactive">
          <p onClick={()=>redirect('/signup')}>Sign Up</p>
          <p onClick={()=>redirect('/signin')}>Sign In</p>
        </div>

        {/* user Related dropdown  */} 
        <div className="dropdown2 unactive">
          <p onClick={()=>navigate('/dashboard')}>Dashboard</p>
          <p onClick={()=>logout()}>Logout</p>
        </div>

        {/* search dropdown */}
        <div className="search_dropdown unactive">
          {
            searchCourses?.map( C => {
              return <p key={C?._id} onClick={()=>redirect('/search/'+searchValue)}>{"search->"} {C?.title}</p>
            })
          }
        </div>
      </nav>

      <div onMouseEnter={()=>{out(".dropdown1"); out(".dropdown2"); out('.dropdown')}} className="singleCourse_hero_section">
          <div className="singleCourse_content">
            <h1>{courses?.course?.title}</h1>
            <p className='singleCourse_des'>{courses?.course?.about_course}</p>
            <div className="singleCourse_rating_container">
              <p className="singleCourse_rating">Rating : {courses?.course?.rating.toFixed(1) + " "} </p>
              <img height={2} width={15} src={star}/> &nbsp;&nbsp;&nbsp; {courses?.course?.no_of_lectures} Videos
            </div>
            <p className='singleCourse_author'>Created by {courses?.course?.instructor_name}</p>
            <p className='singleCourse_lang'>Languages : {courses?.course?.languages.map(i=>i+" ")}</p>
          </div>

          <div className="singleCourse_banner">
            <div className="singleCourseImage">
              <img src={courses?.course?.thumbnail_url} alt="" />
            </div>
            <p className="singleCourse_price">₹{courses?.course?.price} <del>₹{courses?.course?.price + courses?.course?.discount}</del></p>
            <div className="singleCourse_cartWishlist">
              {
                !carted && !purchased && <button onClick={()=>addToCart()} className='b1'>Add to Cart</button>
              }
              {
                carted && !purchased && <button onClick={()=>deleteToCart()} className='b1'>Already in Cart</button>
              }
              {
                !wishlisted && !purchased &&
                <div onClick={()=>addToWishlist()} className='b2'>
                  <img src={heart} width={25} height={25}/>
                </div>
              }
              {
                wishlisted && !purchased &&
                <div onClick={()=>deleteToWishlist()} className='b2'>
                  <img src={heartsolid} width={25} height={25}/>
                </div>
              }
            </div>
            {
              !purchased && <button onClick={()=>payment()} className='b3'>Buy now</button>
            }
            {
              purchased && <button onClick={()=>window.location.href = `/${courses?.course?._id}/video`} className='b3'>Go to Course</button>
            }

            <div className="course_include">
              <p style={{fontWeight:600}}>This course includes:</p>
              <ul >
              {
                courses?.course?.course_includes.map((item, index) => (
                  <li key={index}>•{" "+item}</li>
                ))
              }
              </ul>
            </div>
          </div>
      </div>

      <div className="requirement_singleCourse">
          <h1># Requirements</h1>
          <ul style={{ listStyleType: 'disc', marginLeft:20}}>
          {
            courses?.course?.requirements.map((item, index)=>{
              return <li key={index}>{item}</li>
            })
          }
          </ul>
      </div>


      <div className="learning_singleCourse">
          <h1># Learning</h1>
          <ul style={{ listStyleType: 'disc', marginLeft:20}}>
          {
            courses?.course?.learning.map((item, index)=>{
              return <li key={index}>{item}</li>
            })
          }
          </ul>
      </div>

      <div className="learning_singleCourse">
          <h1># Audience</h1>
          <ul style={{ listStyleType: 'disc', marginLeft:20}}>
          {
            courses?.course?.courseFor.map((item, index)=>{
              return <li key={index}>{item}</li>
            })
          }
          </ul>
      </div>

      <div className="learning_singleCourse">
          <h1># Description</h1>
          <p style={{marginLeft:200, width: 1200, textAlign:'justify'}}>{courses?.course?.description}</p>
      </div>

      <div className="curriculumb">
        <h1># Curriculum</h1>
        <div className="dropdownContainer">
          {
            videoData?.map((Sec, Ind)=>{
              return <div className={`sectionBox sectionBox${Ind}`}>
                <section onClick={()=>openSection(`.sectionBox${Ind}`, Ind)}>
                  <p>Section {Ind+1}: {Sec?.section_title}</p>
                  <img height={15} width={15} src={arrow} alt="pic" />
                </section>

                {
                  Sec?.lecture.map((Lec, Index)=>{
                    return <div className={`videosTitle videosTitle${Ind} hideVideo`}>
                      <p>Lecture {Index+1}: {Lec?.lecture_title}</p>
                      <p>{Lec?.video_length}</p>
                    </div>
                  })
                }
              </div>
            })
          }
        </div>
      </div>

      
    </div>
  )
}

export default SingleCourse