import React from 'react';
import { Settable } from "../components/settable"
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Index() {
  const navigate = useNavigate()

  function checktoken(token) {
    if (token) {}
    else {
      alert('Please login before using this site')
      navigate("/signup")
    }

  }

  useEffect(() => {
    checktoken(window.localStorage.token)
  }, [])

  return (
    <>
    <Settable />
    
    
    </>
    );
};
  
export default Index;