import React, { useEffect, useState } from "react";
import "./HomeStyle.css";
import logo from "../../assets/logo.png";
import heart from "../../assets/heart.png";
import cart from "../../assets/cart.png";
import search from "../../assets/search.png";
import gt from "../../assets/gt.png";
import user from "../../assets/user.png";
import axios from "axios";
import learning from "../../assets/learning.png";
import 'atropos/css';
import Atropos from 'atropos/react';
import {useNavigate} from 'react-router';
import $ from 'jquery';
import star from '../../assets/star.png'
import {debounce} from 'lodash'
import play from '../../assets/play.png'
function Home() {
  const [courses, setCourses] = useState(null);
  const [logoutCourses, setLogoutCourses] = useState(null);
  const [activeCat, setActiveCat] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null)
  const UserM = JSON.parse(localStorage.getItem('user'))
  const [searchValue, setSeatchValue] = useState('')
  const [searchCourses, setSearchCourses] = useState([])
  const debouncedSetInputValue = debounce(setSeatchValue, 500);
  const [purchasedCourse, setPurchasedCourse] = useState([])


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
      "App development"
    ],
  ];

  const redirect = (path) => {
    navigate(path);
  }

  useEffect(()=>{
    const fetchCookies = async () => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/getCookies`, {withCredentials: true})
      .then((response) => {
        console.log(response.data.data);
        setTokens(response.data.data)
        TokenValidation(response.data.data)
      })
      .catch((err) => console.log(err))
    }
    fetchCookies()
  }, [])


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

    const fethingCourse = async () => {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses`)
        .then((response) => {setCourses(response.data.data);setLogoutCourses(response.data.data)})
        .catch((error) => console.log(error));
    };
    fethingCourse();

    const fethingPurchasedCourse = async () => {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/courses/PurchasedCourses`, null, {withCredentials:true})
        .then((response) => {setPurchasedCourse(response.data.data.map(it=>it.courseId))})
        .catch((error) => console.log(error));
    };
    fethingPurchasedCourse();
    
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
              // console.log(tokens1);
              // console.log(response.data.data);
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

  console.log(purchasedCourse);

  const enter = (dropdownName) => {
      $(dropdownName).addClass("active");
      $(dropdownName).removeClass("unactive");
  };

  const out = (dropdownName) => {
      $(dropdownName).addClass("unactive");
      $(dropdownName).removeClass("active");
  };

  const searchbarOpen = () => {
    $('.search_dropdown').addClass('active');
    $('.search_dropdown').removeClass('unactive');
  }
  const searchbarClose = () => {
    $('.search_dropdown').removeClass('active');
    $('.search_dropdown').addClass('unactive');
  }
  
  useEffect(()=>{
    if(searchValue === '') {
      searchbarClose()
    }
    
    const searchCourses = async()=> {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${searchValue}/searchCourse`)
      .then(response=>{setSearchCourses(response.data.data);
        console.log("chala hai search coures");
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


  console.log(searchCourses);

  return (
    <div className="HomeContainer">
      {/* nav bar code  */}
      <nav>
        <div onMouseEnter={()=>out(".dropdown")} className="logo">
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
              maxLength={120}
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
            searchCourses?.map( (C, index) => {
              return index <= 9 ? <p key={C?._id} onClick={()=>redirect('/search/'+searchValue)}>{"search->"} {C?.title}</p> : <></>
            })
          }
        </div>

      </nav>

      {/* hero page code  */}
      <div onMouseEnter={()=>{out(".dropdown1"); out(".dropdown2"); out('.dropdown')}} className="hero_container">
        <div className="hero_content">
            <div className="content">
              <h1>Did you forget <br /> something?</h1>
              <p>
                Get what you left in your cart for less during this <br /> limited-time “don’t leave learning behind” sale.
              </p>
              <Atropos shadow={false} rotateXMax={10} rotateYMax={10} className="btn_wrapper">
                <button onClick={(e)=>e.preventDefault()} className="GetStartedBtn">Lets Get Started</button>
              </Atropos>
            </div>
            
            <Atropos shadow={false} className="learning_img">
              <img src={learning} alt="" />
            </Atropos>
        </div>


      </div>


      {/* course puchased course  */}
      {
        loggedIn &&  purchasedCourse.length > 0 &&
        <>
          <div className="course_section">
            <div className="course_headline">
              <p>Purchased Courses</p>
            </div>
            <div className="course_row">
              {
                courses?.map(course => {
                  if(purchasedCourse.includes(course?._id) === true)
                    return <Atropos shadow={false} onClick={()=>window.location.href = '/'+course?._id+'/video'} key={course?._id} className="course_box">
                      <div className="thumbnail">
                        <img src={course?.thumbnail_url} alt="" />
                        <div className="coverPageForPurchasedCourses"><img src={play} alt="" /></div>
                      </div>
                      <div className="course_content">
                        <h1>{course?.title}</h1>
                        <p className="author">{course?.instructor_name}</p>
                        <div className="rating_container" style={{width: 40}}>
                          <p className="rating">{course?.rating.toFixed(1) + " "} </p>
                          <img src={star}/>
                        </div>
                        <p className="price">₹{course?.price} <del>₹{course?.price + course?.discount}</del></p>
                      </div>
                    </Atropos>
                })
              }
            </div>
          </div>

        </>
      }

      {/* course section  */}
      {
        loggedIn &&  
        <>
          <div className="course_section">
            <div className="course_headline">
              <p>Recommended for you</p>
            </div>
            <div className="course_row">
              {
                courses?.map(course => {
                  if(purchasedCourse.includes(course?._id) === false)
                    return <Atropos shadow={false} onClick={()=>window.location.href = '/course/'+course?._id} key={course?._id} className="course_box">
                      <div className="thumbnail">
                        <img src={course?.thumbnail_url} alt="" />
                      </div>
                      <div className="course_content">
                        <h1>{course?.title}</h1>
                        <p className="author">{course?.instructor_name}</p>
                        <div className="rating_container" style={{width: 40}}>
                          <p className="rating">{course?.rating.toFixed(1) + " "} </p>
                          <img src={star}/>
                        </div>
                        <p className="price">₹{course?.price} <del>₹{course?.price + course?.discount}</del></p>
                      </div>
                    </Atropos>
                })
              }
            </div>
          </div>

        </>
      }

      {
        !loggedIn && 
        <div className="course_section">
          <div className="course_headline">
            <p>Courses for you</p>
          </div>
          <div className="course_row">
            {
              logoutCourses?.map(course => {
                return <Atropos shadow={false} onClick={()=>window.location.href = '/course/'+course?._id} key={course?._id} className="course_box">
                  <div className="thumbnail">
                    <img src={course?.thumbnail_url} alt="" />
                  </div>
                  <div className="course_content">
                    <h1>{course?.title}</h1>
                    <p className="author">{course?.instructor_name}</p>
                    <div className="rating_container" style={{width: 40}}>
                      <p className="rating">{course?.rating.toFixed(1) + " "} </p>
                      <img src={star}/>
                    </div>
                    <p className="price">₹{course?.price} <del>₹{course?.price + course?.discount}</del></p>
                  </div>
                </Atropos>
              })
            }
          </div>
        </div>
      }


    </div>
  );
}

export default Home;