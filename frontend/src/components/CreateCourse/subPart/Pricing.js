import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Pricing =(props)=> {
  const [courseData, setCourseData] = useState(props.courseData)
  const [price, setPrice] = useState(courseData.price)
  const [currency, setCurrency] = useState('INR')
  const [discount, setDiscount] = useState()

  const save = async() => {
    if(price !== undefined || price !== null || 
      discount !== undefined || discount !== null ||
      currency !== undefined || currency !== null || currency !== ''
    ) {
      props.setRadio1(3)
      props.updateCourse({price, discount})
    }
  }

  useEffect(()=>{
    props.unsetRadio1(3)
  }, [price, currency, discount])

  useEffect(()=>{
    if(price !== undefined && price !== null && price >= 0 &&
    currency !== undefined && currency !== null && currency !== ''
    ) {
      props.setRadio1(3)
    }
  }, [])

  
  return (
    <div className="pricing_container">
      <div className="Intend_heading">
        <h1>Pricing</h1>
      </div>

      <p className='pp'>
        <strong>Set a price for your course</strong>
      </p>
      <p className='pp'>
        Please select the currency and the price tier for your course. If you’d like to offer your course for free,<br /> it must have a total video length of less than 2 hours. Also, courses with practice tests can not be free.
      </p>

      <div className="currencyPriceBox">
        <div className="subCurrencyPriceBox">
          <div className="currencyBox">
            <p>Currency</p>
            <select onChange={(e)=>setCurrency(e.target.value)}>
              <option selected value="INR">INR - Indian Rupees</option>
            </select>
          </div>
          <div className="priceBox">
            <p>Price</p>
            <select onChange={(e)=>setPrice(e.target.value)}>
              <option selected={price === 0} value="0">Free</option>
              <option selected={price === 199} value="199">₹199 {currency}</option>
              <option selected={price === 399} value="399">₹399 {currency}</option>
              <option selected={price === 699} value="699">₹699 {currency}</option>
              <option selected={price === 999} value="999">₹999 {currency}</option>
              <option selected={price === 1299} value="1299">₹1299 {currency}</option>
              <option selected={price === 1599} value="1599">₹1599 {currency}</option>
              <option selected={price === 1799} value="1799">₹1799 {currency}</option>
              <option selected={price === 1999} value="1999">₹1999 {currency}</option>
            </select>
          </div>
        </div>

        <div onClick={()=>save()} className="saveBtn">
          <input defaultValue={courseData?.discount} onChange={(e)=>setDiscount(e.target.value)} type="number" required max={100} min={0} placeholder='Discount in %' />
          <p>Save</p>
        </div>
      </div>


    </div>
  );
}

export default Pricing