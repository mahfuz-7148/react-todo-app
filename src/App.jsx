import React from 'react'
import {Header} from './components/header.jsx';
import {HeroSection} from './components/heroSection.jsx';
import {Footer} from './components/footer.jsx';
import {TaskBoard} from './components/taskBoard.jsx';

export const App = () => {
  return (
    <>
      <div className='bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'>
        <Header/>
        <HeroSection/>
        <TaskBoard/>
      </div>

      <Footer/>
    </>
  )
}
