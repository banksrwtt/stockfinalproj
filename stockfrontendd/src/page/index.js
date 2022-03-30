import React from 'react';
import { Settable } from "../components/settable"
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Index() {
  const navigate = useNavigate()

  function checktoken(token, sessionstart) {

    if (token) {
      if (Date() > (sessionstart + (2*60*60*1000))) {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('sessionstart')
        alert('Please login before using this site')
        navigate('/signup')
      }
    }
    else {
      alert('Please login before using this site')
      navigate("/signup")
    }

  }

  useEffect(() => {
    checktoken(window.localStorage.token, window.localStorage.sessionstart)

  }, [])

  return (
    <>
      
        <Settable />

    </>
  );
};

export default Index;