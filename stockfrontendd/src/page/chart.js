// eslint-disable-next-line
import React from 'react';
//import { DisplayChart } from "../components/DisplayChart"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function Chart() {
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
      {/*<DisplayChart />*/}

    </>
  );
};

export default Chart;
