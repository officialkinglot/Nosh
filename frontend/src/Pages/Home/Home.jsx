// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import './Home.css'
import Header from '../../Components/Header/Header'
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import AppDownload from '../../Components/AppDownload/Appdownload'
import Hall from '../Hall/Hall'

const Home = () => {
    const [category, setCategory] = useState("All");

  return (
    <div className=''>
      <Header/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <AppDownload/>
      <Hall/>
    </div>
  )
}

export default Home
