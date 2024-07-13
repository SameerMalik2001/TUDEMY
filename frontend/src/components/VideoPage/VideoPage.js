import React, {useEffect, useState} from 'react'
import './VideoStyle.css'
import logo from "../../assets/logo.png";
import heart from "../../assets/heart.png";
import carts from "../../assets/cart.png";
import search from "../../assets/search.png";
import gt from "../../assets/gt.png";
import user from "../../assets/user.png";
import $ from 'jquery';
import { useNavigate, useParams } from 'react-router-dom';
import {debounce} from 'lodash'
import axios from 'axios';
import rightArrow from '../../assets/rightArrow.png'
import leftArrow from '../../assets/leftArrow.png'
import arrowWhite from '../../assets/arrowWhite.png'
import star from '../../assets/star.png'

const VideoPage = () => {
  const {courseId} = useParams()
  const [activeCat, setActiveCat] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null)
  const [videos, setVideos] = useState([])
  const UserM = JSON.parse(localStorage.getItem('user'))
  const [searchValue, setSeatchValue] = useState('')
  const [searchCourses, setSearchCourses] = useState([])
  const [videoUrl, setVideoUrl] = useState(null)
  const [tabChange, SetTabChange] = useState('Overview')
  const [addReview, setAddReview] = useState(false)
  const [rating, setRating] = useState('0.5')
  const [reviewText, setReviewText] = useState('')
  const [avgRating, setAVGRating] = useState(null)
  const debouncedSetInputValue = debounce(setSeatchValue, 500);
  const [reviews, setReviews] = useState([])
  const [course, setCourse] = useState([])
  const [StudentBuyThisCourseCount, setStudentBuyThisCourseCount] = useState(0)
  const [reviewRatingPercent, setReviewRatingPercent] = useState({"1":0,"2":0, "3":0,"4":0, "5":0, total: 0})
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

  const redirect = (path) => {
    navigate(path);
  }

  const logout = async () => {
    console.log("logout "+ tokens.accessToken);
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/logout`,null,  {
      headers: {
         Authorization: 'Bearer '+ tokens.accessToken 
      },
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


  useEffect(() => {

    if(UserM?._id === undefined) {
      return redirect('/signin')
    }

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

    const fetchVideos = async () => {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/videos/${courseId}`, null, {withCredentials:true})
     .then((response) => {
      console.log(response.data.data);
      const ddddd = transformData(response.data.data)
      setVideoUrl(ddddd[0].lecture[0])
      setVideos(ddddd)
    })
     .catch((err) => console.log(err))
    }
    fetchVideos()

    const fetchCourse = async () => {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${courseId}`, null, {withCredentials:true})
     .then((response) => {
      console.log(response.data.data);
      if(response.data.data?.purchased === false) {
        window.location.href = `/course/${courseId}`
      }
      setCourse(response.data.data)
    })
     .catch((err) => console.log(err))
    }
    fetchCourse()

    const fetchStudentCount = async () => {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/purchases/${courseId}/studentCount`,
        null,
        {
          withCredentials: true,
        }
      )
     .then((response) => {
      console.log(response.data.data);
      setStudentBuyThisCourseCount(response.data.data)
    })
     .catch((err) => console.log(err))
    }
    fetchStudentCount()

  }, []);

  useEffect(()=>{
    const fetchReviews = async () => {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${courseId}/fetchCourses`, null, {withCredentials: true})
     .then((response) => {
      console.log(response.data.data);
      // find the average of star rating
      let a = 0;
      let b = {"1":0,"2":0, "3":0,"4":0, "5":0, total: response.data.data.reviews.length};
      response.data.data.reviews.map((review) => {
        a += review.star;

        // reveiw rating work
        if(review.star === 5) {
          b["5"] += 1;
        } else if(review.star >= 4) {
          b["4"] += 1;
        } else if(review.star >= 3) {
          b["3"] += 1;
        } else if(review.star >= 2) {
          b["2"] += 1;
        } else if(review.star >= 0) {
          b["1"] += 1;
        }
      })
      a = a / (b.total === 0 ? 1 : b.total);
      const getPercent = (num, den) => {
        if(den === 0) return 0
        return (num / den) * 100;
      }
      b["1"] = getPercent(b["1"],b.total)
      b["2"] = getPercent(b["2"],b.total)
      b["3"] = getPercent(b["3"],b.total)
      b["4"] = getPercent(b["4"],b.total)
      b["5"] = getPercent(b["5"],b.total)
      setReviewRatingPercent(b)
      setAVGRating(a)
      setReviews(response.data.data)
      if(response.data.data.yourReview._id !== undefined && response.data.data.yourReview !== null) {
        setRating(response.data.data.yourReview.star)
        setReviewText(response.data.data.yourReview.text)
      }
    })
     .catch((err) => console.log(err))
    }
    fetchReviews()
  }, [addReview])

  const getNoFromPercent = (per, total) => {
    return total * (per/100);
  }

  const getInitialOfUsername = (username) => {
    const listOfUsername = username.split(' ');
    return listOfUsername[0][0].toUpperCase() + listOfUsername[listOfUsername.length - 1][0].toUpperCase()
  }

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
            headers: { Authorization: 'Bearer ' + tokens1?.accessToken }, withCredentials: true })
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

  const rightPanel = () => {
    if($('.rightVideoPart').hasClass('width30')) {
      $('.rightVideoPart').addClass('width0')
      $('.rightVideoPart').removeClass('width30')
      $('.leftVideoPart').addClass('width100')
      $('.leftVideoPart').removeClass('width70')
      $('.leftVideoPart video').removeClass('height500')
      $('.leftVideoPart video').addClass('height550')
      $('.leftVideoPart video').addClass('height550')
      $('.backCourseContent').removeClass('hideCourseContentBox')
      $('.backCourseContent').addClass('showCourseContentBox')
    } else {
      $('.rightVideoPart').addClass('width30')
      $('.rightVideoPart').removeClass('width0')
      $('.leftVideoPart').addClass('width70')
      $('.leftVideoPart').removeClass('width100')
      $('.leftVideoPart video').addClass('height500')
      $('.leftVideoPart video').removeClass('height550')
    }
  }

  const showBox = () => {
    if($('.backCourseContent').hasClass('hideCourseContentBox')) {
      $('.backCourseContent').removeClass('hideCourseContentBox')
      $('.backCourseContent').addClass('showCourseContentBox')
    } else {
      $('.backCourseContent').removeClass('showCourseContentBox')
      $('.backCourseContent').addClass('hideCourseContentBox')
      $('.rightVideoPart').addClass('width30')
      $('.rightVideoPart').removeClass('width0')
      $('.leftVideoPart').addClass('width70')
      $('.leftVideoPart').removeClass('width100')
      $('.leftVideoPart video').addClass('height500')
      $('.leftVideoPart video').removeClass('height550')
    }
  }

  const dropdownToggle = (Ind) => {
    if(!$('.ddd'+Ind).hasClass('displayFlex')) {
      $('.ddd'+Ind).addClass('displayFlex');
      $('.ddd'+Ind).removeClass('displayNone');
      $(`.i123${Ind}`).addClass('addRatatinInArrow')
    } else {
      $('.ddd'+Ind).addClass('displayNone');
      $('.ddd'+Ind).removeClass('displayFlex');
      $(`.i123${Ind}`).removeClass('addRatatinInArrow')
    }
  }

  const timeAgo = (date) => {
    const diff = date*1000;
    console.log(diff); 
    // 16773000
  
    const seconds = Math.floor(diff / 1000); 
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60); 
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    console.log(seconds, minutes, hours, days, weeks, months, years);
  
    if (years > 0) {
      return years === 1 ? "1 year ago" : `${years} years ago`;
    } else if (months > 0) {
      return months === 1 ? "1 month ago" : `${months} months ago`;
    } else if (weeks > 0) {
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    } else if (days > 0) {
      return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
      return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`;
    }
  }

  const addReviewDb = async()=>{
    if(reviewText === '') {
      alert('Please write a review text before submitting')
    } else {
      if(!reviews?.yourReview?.text) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${courseId}/createReview`, 
          {
            text: reviewText,
            star: rating
          }, 
          {
            withCredentials: true
          }
        )
        .then((response) => {
          console.log(response.data.data);
          setReviewText('')
          setAddReview(false)
        })
        .catch((error) => {
          console.log(error);
        })
      } else {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${reviews?.yourReview?._id}/update`, 
          {
            text: reviewText,
            star: rating
          }, 
          {
            withCredentials: true
          }
        )
        .then((response) => {
          console.log(response.data.data);
          setReviewText('')
          setAddReview(false)
        })
        .catch((error) => {
          console.log(error);
        })
      }
    }
  }

  const DeleteReview = async() => {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/${reviews?.yourReview?._id}/delete`, 
          {
            withCredentials: true
          }
        )
        .then((response) => {
          console.log(response.data.data);
          setReviewText('')
          setRating('0.5')
          setAddReview(false)
        })
        .catch((error) => {
          console.log(error);
        })
  }

  const secondToMinutes = (sec) =>{
    const min = Math.floor(sec / 60);
    const sec1 = sec % 60;
    if(sec1 < 10) {
      return `${min}:0${sec1}`
    } else {
      return `${min}:${sec1}`
    }
  }

  console.log(reviewRatingPercent, videoUrl);
  console.log(videos);

  return (
    <div className='cart_container anothername'>
      <nav>
        <div onClick={()=>navigate('/')} onMouseEnter={()=>out(".dropdown")} className="logo">
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
          <img src={carts} alt="logo" />
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

      <div onMouseEnter={()=>{out(".dropdown1"); out(".dropdown2"); out('.dropdown')}} className="videoPageContainer">
        <div className="leftVideoPart width70 ">
          <div onClick={()=>showBox()} className="backCourseContent hideCourseContentBox">
            <img src={leftArrow} alt="" />
          </div>
          {
            videoUrl?.file !== null && 
            <video autoPlay className='height500' src={videoUrl?.file} controls></video>
          } 
          {
            videoUrl?.file === null && 
            <video autoPlay className='height500' src={null} controls></video>
          }
          <div className="videoContentBoxBelowVideo">
            <p className='heading'>Lecture: {videoUrl?.lecture_no} {videoUrl?.lecture_title}</p>
            <div className="videoContentBoxBelowVideoBar">
              <p style={{fontWeight: tabChange === 'Overview' ? 600 : 400}} onClick={()=>SetTabChange('Overview')}>Overview</p>
              <p style={{fontWeight: tabChange === 'Reviews' ? 600 : 400}} onClick={()=>SetTabChange('Reviews')}>Reviews</p>
            </div>
            {
              tabChange === 'Overview' && 
              <div className="overview">
                <div className="byTheNumber">
                  <div className="ByTheNumberContainer">
                    <div className="p1">
                      <p>By the numbers</p>
                    </div>
                    <div className="content1_byTheNumber">
                      <p>Skill Level: {course?.course?.level}</p>
                      <p>Student: {StudentBuyThisCourseCount}</p>
                      <p>Languages: {course?.course?.languages.map(it=>it+" ")}</p>
                    </div>
                    <div className="content2_byTheNumber">
                      <p>Lectures: {course?.course?.no_of_lectures}</p>
                      <p>Videos: {secondToMinutes(course?.course?.total_time)} hrs</p>
                    </div>
                  </div>
                </div>

                <div className="descriptionOverview">
                  <div className="descriptionOverviewContainer">
                    <div className="p1">
                      <p>Description</p>
                    </div>
                    <p className='desc'>{videoUrl?.description}</p>
                  </div>
                </div>

                <div className="descriptionOverview">
                  <div className="descriptionOverviewContainer">
                    <div className="p1">
                      <p>Instructor</p>
                    </div>
                    <p className='desc'>{UserM?.username}</p>
                  </div>
                </div>
              </div>
            }
            {
              tabChange === 'Reviews' && 
              <div className="notes">
                <div className="topRatingContentBox">
                  <div className="topRatingContentBoxHeading">
                    <p>Students Rating</p>
                  </div>

                  <div className="ratingBox">
                    <div className="ratingNumber">
                      <p>{parseFloat(avgRating).toFixed(1)}</p>
                      <img src={star} alt="" />
                      <p>Total Rating</p>
                    </div>
                    <div className="ratingLine">
                      <div className="linesOfRating cc">
                        <div style={{width:getNoFromPercent(reviewRatingPercent["5"], 475), height:10, backgroundColor:'#FFC107'}} className="filler"></div>
                      </div>
                      <div className="linesOfRating">
                        <div style={{width:getNoFromPercent(reviewRatingPercent["4"], 475), height:10, backgroundColor:'#FFC107'}} className="filler"></div>
                      </div>
                      <div className="linesOfRating">
                        <div style={{width:getNoFromPercent(reviewRatingPercent["3"], 475), height:10, backgroundColor:'#FFC107'}} className="filler"></div>
                      </div>
                      <div className="linesOfRating">
                        <div style={{width:getNoFromPercent(reviewRatingPercent["2"], 475), height:10, backgroundColor:'#FFC107'}} className="filler"></div>
                      </div>
                      <div className="linesOfRating">
                        <div style={{width:getNoFromPercent(reviewRatingPercent["1"], 475), height:10, backgroundColor:'#FFC107'}} className="filler"></div>
                      </div>
                    </div>
                    <div className="ratingPercent">
                      <div className="starPercent cc1">
                        <p>5</p>
                        <img src={star} alt="" />
                        <p style={{marginLeft:10}}>{reviewRatingPercent["5"].toFixed(0)}%</p>
                      </div>
                      <div className="starPercent">
                        <p>4</p>
                        <img src={star} alt="" />
                        <p style={{marginLeft:10}}>{reviewRatingPercent["4"].toFixed(0)}%</p>
                      </div>
                      <div className="starPercent">
                        <p>3</p>
                        <img src={star} alt="" />
                        <p style={{marginLeft:10}}>{reviewRatingPercent["3"].toFixed(0)}%</p>
                      </div>
                      <div className="starPercent">
                        <p>2</p>
                        <img src={star} alt="" />
                        <p style={{marginLeft:10}}>{reviewRatingPercent["2"].toFixed(0)}%</p>
                      </div>
                      <div className="starPercent">
                        <p>1</p>
                        <img src={star} alt="" />
                        <p style={{marginLeft:10}}>{reviewRatingPercent["1"].toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="reveiwHeading">
                    <p>Reviews</p>
                    {
                      reviews?.check === false &&
                      <button onClick={()=>setAddReview(true)} className='btnRating'>+ Rating</button>
                    } 
                    {
                      reviews?.check === true &&
                      <button onClick={()=>setAddReview(true)} className='btnRating'>Edit</button>
                    } 
                  </div>

                  <div className="reviewBoxContainer">

                    {
                      reviews?.reviews?.map((R, Index)=>{
                        return <div key={R?._id} className="reviewContainer">
                          <div className="forImage">
                            <div className="circle3">
                              <p>{getInitialOfUsername(R?.user?.username)}</p>
                            </div>
                          </div>
                          <div className="forReviewContent">
                            <p>{R?.user?.username}</p>
                            <p style={{textTransform:'lowercase'}}>{R?.star} <img style={{display:'inline-block', marginRight:20, marginTop:-5}} width={12} src={star} alt="" />{timeAgo(R?.duration)}</p>
                            <p style={{textTransform:'lowercase'}}>{R?.text}</p>
                          </div>
                        </div>
                      })
                    }

                  </div>


                </div>
              </div>
            }

          </div>
        </div>

        <div className="rightVideoPart width30">
          <div className="courseContent">
            <img style={{marginLeft:20}} src={rightArrow} alt='' onClick={()=>rightPanel()} />
            <p>Course Content</p>
          </div>

          <div className="sectionBoxOFVideo">
          {
            videos?.map((Sec, Ind)=>{
              return  <div key={Sec?.section_title} className={`contentOfSectionBoxOfVideo ${Ind}`}>
                        <div onClick={()=>dropdownToggle(Ind)} className={`subContentOfSectionBoxOfVideo`}>
                          <p>Section {Ind+1}: {Sec?.section_title}</p>
                          <img className={`i123${Ind}`} src={arrowWhite} alt="" />
                        </div>

                        {
                          Sec?.lecture.map((Lec, Index)=>{
                            return  <div key={Lec?._id} style={{backgroundColor: Lec?._id === videoUrl?._id ? 'rgb(43, 43, 57)' : 'rgb(100, 100, 120)'}} onClick={()=>setVideoUrl(Lec)} className={`dropdownOfContentOfSectionBoxOfVideo ddd${Ind} displayNone`}>
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

      {
        addReview && 
        <div className="addreview">
          <div className="addReviewBox">
            <h1>Review Rating</h1>
            <select onChange={(e)=>setRating(e.target.value)} name="" id="">
              <option selected={String(rating) === '0.5'} value="0.5">0.5</option>
              <option selected={String(rating) === '1'} value="1">1</option>
              <option selected={String(rating) === '1.5'} value="1.5">1.5</option>
              <option selected={String(rating) === '2'} value="2">2</option>
              <option selected={String(rating) === '2.5'} value="2.5">2.5</option>
              <option selected={String(rating) === '3'} value="3">3</option>
              <option selected={String(rating) === '3.5'} value="3.5">3.5</option>
              <option selected={String(rating) === '4'} value="4">4</option>
              <option selected={String(rating) === '4.5'} value="4.5">4.5</option>
              <option selected={String(rating) === '5'} value="5">5</option>
            </select>
            <textarea defaultValue={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder='Insert your review here' name="" id="" cols="30" rows="10"></textarea>
            <div className="btnsOfReview">
              <p onClick={()=>{setAddReview(false)}}>Cancel</p>
              <p onClick={()=>addReviewDb()}>Save and Exit</p>
              {
                reviews.check === true &&
                <p style={{backgroundColor:'red'}} onClick={()=>DeleteReview()}>Delete</p>
              }
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default VideoPage