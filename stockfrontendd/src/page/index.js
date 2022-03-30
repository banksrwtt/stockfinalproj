import React from 'react';
import { Settable } from "../components/settable"
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment';

function Index() {
  const navigate = useNavigate()

  function checktoken(token, sessionstart) {

    if (token) {
      if (Date() > (moment(sessionstart).add(2, 'hour'))) {
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