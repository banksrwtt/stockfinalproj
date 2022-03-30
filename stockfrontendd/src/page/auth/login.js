import { useState } from 'react';
import axios from "axios";
import { Form, Input, Button, Row } from 'antd';
import './login.css';
import 'antd/dist/antd.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import React from 'react';


function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  

  // If token exist, delete token, alert and navigate to homepage
  // Error while there is no token in window.localstorage
  function logout() {
    if (window.localStorage.token) {
      localStorage.removeItem("token");
      alert('Logged out!!')
      console.log('Logged out!!')
      form.resetFields();
      navigate("/signup")
    } else {
      alert('You are not logged in!!')
      form.resetFields();
    }
  }

  // Post an email and a password to backend and then database
  // Then clear field and navigate to homepage
  // If there is an error just alert and input field still exist
  function logMeIn() {
    axios({
      method: "POST",
      url: "http://localhost:5000/login",
      data: {
        email: email,
        password: password
      }
    })
      .then((response) => {
        window.localStorage.setItem('token', response.data.token)
        window.localStorage.setItem('sessionstart', Date())
        console.log('Logged in!!')
        alert('Logged in!!')
        form.resetFields();
        navigate("/")
      }).catch((error) => {
        if (error.response) {
          alert('Log in Failed. Please check your email or password.')
        }
      })
  }



  return (
    <Row justify="center" style={{ minHeight: '100vh' }}>

      <Form
        form={form}
        name="normal_login"
        className="login-form"
      >
        <h1> Log in/out </h1>
        <br></br>
        <Form.Item
          name="email"
          onChange={(e) => { setemail(e.target.value) }}
          value={email}
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          onChange={(e) => { setpassword(e.target.value) }}
          value={password}
          rules={[
            {
              required: true,
              message: 'Please input your Password!'
            }
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder='Password'
          />
        </Form.Item>
        New Here?&ensp;
        <a href="/register">Create new account</a>
        <br></br>
        Forget your password?&ensp;
        <a href='/resetpassword'>Reset your password</a>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" onClick={logMeIn}>
            Log in
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" onClick={logout}>
            Log out
          </Button>
        </Form.Item>

      </Form>
    </Row >
  );
}

export default Login;