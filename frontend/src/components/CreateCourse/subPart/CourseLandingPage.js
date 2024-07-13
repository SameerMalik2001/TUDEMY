import React, { useEffect, useState } from 'react';
import $ from 'jquery'
import axios from 'axios';
import { debounce } from 'lodash';

const CourseLandingPage =(props)=> {
  const courseData = props.courseData
  const [textArea, setTextArea] = useState('')
  const [title, setTitle] = useState('')
  const [aboutCourse, setAboutCourse] = useState('')
  const [category, setCategory] = useState('null')
  const [subCategory, setSubCategory] = useState('null')
  const [certificate, setCertificate] = useState(true)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailURL, setThumbnailURL] = useState('')
  const debounceTitle = debounce(setTitle, 100)
  const debounceAboutCourse = debounce(setAboutCourse, 100)
  const debounceDescription = debounce(setTextArea, 100)

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

  function calcHeight(value) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    let newHeight = 20 + numberOfLineBreaks * 25+ 25;
    return newHeight;
  }

  useEffect(()=>{
    let textarea = document.querySelector(".resize-ta");
    textarea.addEventListener("keyup", () => {
    textarea.style.height = calcHeight(textarea.value) + "px";
    console.log(courseData)})

    if(title.length === 0) {
      setTitle(courseData?.title)
    }

    if(aboutCourse.length === 0) {
      setAboutCourse(courseData?.about_course)
    }

    if(textArea.length === 0) {
      setTextArea(courseData?.description)
    }

    if(category === 'null') {
      setCategory(courseData?.category[0])
      setSubCategory(courseData?.category[1])
    }

    setCertificate(courseData?.certificate)
    if(courseData?.thumbnail_url.length > 0) {
      setThumbnail('something')
    }
    setThumbnailURL(courseData?.thumbnail_url)
    
  }, [])

  useEffect(() => {
    if(title.length > 0 && category !== "null" && subCategory !== "null") {
      props.setRadio1(2)
      props.updateCourse({title, certificate, category: [category, subCategory], description: textArea, about_course:aboutCourse})
      const setThumbnailsInDb = async() => {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/coursedrafts/uploadThumbnailImage`, 
        {courseDraftId: props.di, thumbnail_image_url: thumbnail, thumbnailURL}, 
        {
          headers: {
            'Content-Type':'multipart/form-data',
          },
          withCredentials: true
        })
        .then(response => {console.log(response);setThumbnailURL(response.data.data.thumbnail_url);})
        .catch(err => console.log(err))
      }
      setThumbnailsInDb()
    } else {
      props.unsetRadio1(2)
    }
    
  }, [title, aboutCourse, category, subCategory, textArea, certificate, thumbnail]);


  const addPhoto = (e) => {
    setThumbnail(e.target.files[0]);
  }

  // console.log(title, aboutCourse, category, subCategory, textArea, certificate);
  console.log(thumbnail, thumbnailURL);

  return (
    <div className='CourseLandingPage_container'>
      <p className='CLP_heading'>Course Landing Page</p>

      <p className='pp'>
        Your course landing page is crucial to your success on Udemy. If it’s done right, it can also help you gain visibility in search<br /> engines  like Google. As you complete this section, think about creating a compelling Course Landing Page that demonstrates<br /> why  someone would want to enroll in your course.
      </p>

      <div className="courseInputBox">
        <p className="courseTitle">Course Title</p>
        <input defaultValue={title} onChange={e=>debounceTitle(e.target.value)} type="text" name="" id="" maxLength={60} placeholder='Title should be less than 60 characters...'/>
        <p className='warnP'>Your title should be a mix of attention-grabbing, informative, and optimized for search</p>
      </div>

      <div className="courseInputBox">
        <p className="courseTitle">About Course</p>
        <input defaultValue={aboutCourse} onChange={e=>debounceAboutCourse(e.target.value)} type="text" name="" id="" maxLength={120} placeholder='About Course should be less than 120 characters...'/>
        <p className='warnP'>Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you've covered during your course.</p>
      </div>

      <div className="courseInputBox">
        <p className="courseTitle">Course description</p>
        <textarea defaultValue={textArea} onChange={(e)=>debounceDescription(e.target.value)} className='resize-ta'  type="text" rows={1} placeholder='Insert Your Course description'/>
        <p className='warnP'>Description should have minimum 200 words.</p>
      </div>

      <p style={{marginLeft:50}} className='courseTitle'>Basic Info</p>

      <div className="basic_info">

        <select onChange={(e)=>setCategory(prev => {setSubCategory('null');return e.target.value;})} className='selectCat'>
          <option selected={category === 'null'} value="null">--Select Category--</option>
          {
            CatList0?.map((item, index)=>{
              return <option selected={category === item} key={index} value={item}>{item}</option>
            })
          }
        </select>

        {
          category !== 'null' && category !== undefined &&
          <select onChange={e=>setSubCategory(e.target.value)} className='selectCat'>
            <option selected={subCategory === 'null'} value="null">--Select SubCategory--</option>
            {
              category !== undefined && CatList[CatList0.indexOf(category)]?.map((item, index)=>{
                return <option selected={subCategory === item} key={index} value={item}>{item}</option>
              })
            }
          </select>
        }
      </div>
      
      <div className="certificateBox">
          <h1><strong>Will you provide the Certificate ?</strong></h1>
          <div className="Radiobox">
            <input checked={certificate === true} onChange={()=>setCertificate(true)} type="radio" name="certificate" id="" />
            <p>Yes</p>
          </div>
          <div className="Radiobox">
            <input checked={certificate === false} onChange={()=>setCertificate(false)} type="radio" name="certificate" id="" />
            <p>No</p>
          </div>
      </div>

      <div className="thumbnailBox">
        <h1><strong>Upload the thumbnail that user see on Course.</strong></h1>
        <div className="uploadBox">
          <input defaultValue={thumbnail} onChange={(e)=>addPhoto(e)} type="file" name="" id="fileTag" />
          <p onClick={()=>{$('#fileTag').trigger("click")}}>Upload</p>
        </div>
        {
          String(thumbnailURL) !== '' && thumbnail !== null && <p><strong>uploaded</strong><a href={String(thumbnailURL)} target='_blank' style={{color:'blue'}}>{" "}See Image</a> <span onClick={()=>{setThumbnail(null);setThumbnailURL('')}} style={{color:'red', marginLeft: 10, cursor:'pointer'}}>Delete</span></p>
        }
        {
          thumbnail && thumbnailURL === '' && <p><strong>File name:</strong>{thumbnail.name} is uploading... <span onClick={()=>{setThumbnail(null);setThumbnailURL('')}} style={{color:'red', marginLeft: 10, cursor:'pointer'}}>Delete</span></p>
        }
        {
          String(thumbnailURL)?.length === 0 && thumbnail === null && <p>NO file selected</p>
        }
      </div>

    </div>
  )
}

export default CourseLandingPage