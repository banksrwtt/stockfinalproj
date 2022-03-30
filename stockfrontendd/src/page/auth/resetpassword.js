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