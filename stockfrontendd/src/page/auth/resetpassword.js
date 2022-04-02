import { useState } from 'react';
import axios from "axios";
import { Form, Input, Button, Row } from 'antd';
import './login.css';
import 'antd/dist/antd.css';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import React from 'react';

function Resetpassword() {

    const [form] = Form.useForm();
    const navigate = useNavigate()

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [checkpassword, setcheckpassword] = useState("")

    function submitted() {
        if (password === checkpassword) {
            axios({
                method: "POST",
                url: "http://localhost:5000/resetpassword",
                data: {
                    email: email,
                    password: password,
                }
            }).then((response) => {
                form.resetFields();
                alert('Reset Password Success!!')
                navigate("/signup")
            }).catch((error) => {
                // console.log(error.response)
                // console.log(error.response.status)
                // console.log(error.response.headers)
                alert("This email isn't exist. Please recheck your email")

            })
        } else {

            alert("Your password and confirm password aren't same. Please recheck your passwords.")
        }
    }

    return (
        <Row justify="center" style={{ minHeight: '100vh' }}>
            <Form
                form={form}
                name="normal_login"
                className="login-form"
            >
                <h1> Reset Password </h1>
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
                            message: 'Please input your New Password!',
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="New Password"
                    />
                </Form.Item>

                <Form.Item
                    name="checkpassword"
                    onChange={(e) => { setcheckpassword(e.target.value) }}
                    value={checkpassword}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your New Password!',
                        },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="confirmpassword"
                        placeholder="Confirm your New Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={submitted}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>

        </Row>
    );
}

export default Resetpassword