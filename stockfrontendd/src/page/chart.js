// eslint-disable-next-line
import React from 'react';
//import { DisplayChart } from "../components/DisplayChart"
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import moment from 'moment';


function Chart() {
  const navigate = useNavigate()

  function checktoken(token, sessionstart) {
    if (token) {
      if (sessionstart) {
        if (Date() > (moment(sessionstart).add(2, 'hour'))) {
          window.localStorage.removeItem('token')
          window.localStorage.removeItem('sessionstart')
          alert('Please login before using this site')
          navigate('/signup')
        }
      }
    }
    else {
      alert('Please login before using this site')
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('sessionstart')
      navigate("/signup")
    }

  }

  useEffect(() => {
    checktoken(window.localStorage.token, window.localStorage.sessionstart)
  }, [])

  return (
    <>
      {/*<DisplayChart />*/}

    </>
  );
};

export default Chart;
