import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'antd/dist/antd.css';
import './login.css';
import { Form, Input, Button, Row } from 'antd';
import { UserOutlined, LockOutlined, ApiOutlined } from '@ant-design/icons';


function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate()

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const [checkpassword, setcheckpassword] = useState("")
  const [linetoken, setlinetoken] = useState('')

  // When submitted pushed, check if password and confirm password
  // is same. Then, post it to backend to check user existense
  // if success, alert and navigate to login page
  // if error, error response in console and alert. However, 
  // input field are still remain 
  function submitted() {
    if (password === checkpassword) {
      //console.log(email)
      axios({
        method: "POST",
        url: "http://localhost:5000/register",
        data: {
          email: email,
          password: password,
          linetoken: linetoken
        }
      }).then((response) => {
        form.resetFields();
        alert('Sign up Success!!')
        navigate("/signup")

      }).catch((error) => {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        alert('This email already existed. Please try another email')
      })
    } else {
      alert('Your password is incorrect')
    }
  }

  return (
    <Row justify="center" style={{ minHeight: '100vh' }}>

      <Form
        form={form}
        name="normal_login"
        className="login-form"
      >
        <h1> Register </h1>
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
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="checkpassword"
          onChange={(e) => { setcheckpassword(e.target.value) }}
          value={checkpassword}
          rules={[
            {
              required: true,
              message: 'Please confirm your Password!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="confirmpassword"
            placeholder="Confirm your Password"
          />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, message: 'Line token is required' }]}
          style={{ width: '400px' }}
        >
          <Input
            prefix={<ApiOutlined className="site-form-item-icon" />}
            placeholder="Please fill your Line Token"
            onChange={(e) => { setlinetoken(e.target.value) }} />
          <a href="https://www.smith.in.th/%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87-line-notify-%E0%B8%AA%E0%B8%B3%E0%B8%AB%E0%B8%A3%E0%B8%B1%E0%B8%9A-post-%E0%B8%A5%E0%B8%87%E0%B8%81%E0%B8%A5%E0%B8%B8%E0%B9%88%E0%B8%A1/">
            How to find your line notify token?
          </a>
          &ensp;
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" onClick={submitted}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Row>
  );
};


export default Register;