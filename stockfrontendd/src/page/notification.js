import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Switch, Button, Row } from 'antd';
import { fetchprofile } from '../service/Fetchnotification'
import axios from "axios";


function Notification() {
    const navigate = useNavigate()
    const [stockname, setstockname] = useState('')

    // Use a input number as indentity of extistence
    const [maonChange, setmaonChange] = useState(false)
    const [emaonChange, setemaonChange] = useState(false)
    const [uoonChange, setuoonChange] = useState(false)
    const [ccionChange, setccionChange] = useState(false)
    const [mfionChange, setmfionChange] = useState(false)
    const [rsionChange, setrsionChange] = useState(false)
    const [stoonChange, setstoonChange] = useState(false)

    // Have no input number (length or value) 
    // Use true/false as an indentity instad
    const [macdonChange, setmacdonChange] = useState(false)
    const [bbandOnchange, setbbandonChange] = useState(false)

    const [malength, setmalength] = useState(0)
    const [emalength, setemalength] = useState(0)
    const [uoprice, setuoprice] = useState(0)
    const [cciprice, setcciprice] = useState(0)
    const [mfiprice, setmfiprice] = useState(0)
    const [rsiprice, setrsiprice] = useState(0)
    const [stoprice, setstoprice] = useState(0)

    // Starting page by checking token 
    // If no token, automatically go to login/logout page
    useEffect(() => {
        fetchprofile(window.localStorage.token).then((info) => {

        }).catch((error) => {
            if (error.response) {
                alert('Please login before using this site')
                navigate("/signup")
            }
        })
    }, [])


    // Function for creating a dict data for using in setnoti() function
    function indicatorselect() {
        let dic = {}
        const header_list = [maonChange, emaonChange, uoonChange, ccionChange, mfionChange, rsionChange, stoonChange, macdonChange, bbandOnchange]
        const value_list = [malength, emalength, uoprice, cciprice, mfiprice, rsiprice, stoprice, macdonChange, bbandOnchange]
        const str_list = ['malength', 'emalength', 'uoprice', 'cciprice', 'mfiprice', 'rsiprice', 'stoprice', 'macdstate', "bbandstate"]


        dic['stockname'] = stockname
        header_list.forEach(function (item, index) {
            if (item === true) {
                dic[str_list[index]] = value_list[index]
            }
        });
        console.log(dic)
        return dic
    }

    // Set notification by using data from indicatorselect() alert when sucess or error
    function setnoti() {
        axios({
            method: "POST",
            url: `http://localhost:5000/notisetting?token=${window.localStorage.token}`,
            data: indicatorselect()
        })
            .then((response) => {
                alert('Notifications have been set up')
                //console.log(response)
            }).catch((error) => {
                if (error.response) {
                    alert('Error!! There is something wrong.')
                }
            }
            )
    }


    return (
        <div>
            <h1>Notification Setting</h1>

            <Row justify="center" style={{ minHeight: '100vh' }}>

                <Form
                //labelCol={{ span: 7 }}
                //wrapperCol={{ span: 10 }}
                //layout="horizontal"
                >

                    <Form.Item label="Stock name" style={{ width: '400px' }}>
                        <Input
                            placeholder="Select stockname"
                            onChange={(e) => { setstockname(e.target.value.toUpperCase()) }}
                        />
                    </Form.Item>

                    <Form.Item label="Moving Average (MA)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเกิดการตัดกันของ ราคา เเละเส้น Moving Average'>
                        <InputNumber placeholder="Set your MA length" style={{ width: '200px' }}
                            onChange={(e) => { setmalength(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setmaonChange} />
                    </Form.Item>

                    <Form.Item label="Exponential Moving Average (EMA)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเกิดการตัดกันของ ราคาเเละเส้น Exponential Moving Average'>
                        <InputNumber placeholder="Set your EMA length" style={{ width: '200px' }}
                            onChange={(e) => { setemalength(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setemaonChange} />
                    </Form.Item>

                    <Form.Item label="Ultimate Oscillator (UO)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเส้นโมเมนตัมของ UO ถึงจุดที่ผู้ใช้กำหนด'>
                        <InputNumber placeholder="Set your UO value" style={{ width: '200px' }}
                            onChange={(e) => { setuoprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setuoonChange} />
                    </Form.Item>

                    <Form.Item label="Commodity Channel Index (CCI)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเส้นโมเมนตัมของ CCI ถึงจุดที่ผู้ใช้กำหนด'>
                        <InputNumber placeholder="Set your CCI value" style={{ width: '200px' }}
                            onChange={(e) => { setcciprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setccionChange} />
                    </Form.Item>

                    <Form.Item label="Money Flow Index (MFI)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเส้นโมเมนตัมของ MFI ถึงจุดที่ผู้ใช้กำหนด'>
                        <InputNumber placeholder="Set your MFI value" style={{ width: '200px' }}
                            onChange={(e) => { setmfiprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setmfionChange} />
                    </Form.Item>

                    <Form.Item label="Relative Strength Index (RSI)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเส้นโมเมนตัมของ RSI ถึงจุดที่ผู้ใช้กำหนด'>
                        <InputNumber placeholder="Set your RSI value" style={{ width: '200px' }}
                            onChange={(e) => { setrsiprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setrsionChange} />
                    </Form.Item>

                    <Form.Item label="Stochastic Oscillator (STO)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเส้นโมเมนตัมของ STO ถึงจุดที่ผู้ใช้กำหนด'>
                        <InputNumber placeholder="Set your STO value" style={{ width: '200px' }}
                            onChange={(e) => { setstoprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setstoonChange} />
                    </Form.Item>

                    <Form.Item label="Moving Average Convergence Divergence (MACD)"
                        required tooltip='ทำการแจ้งเตือนเมื่อเส้น MACD และ Signal line ตัดกัน'>
                        <Switch onChange={setmacdonChange} />
                    </Form.Item>

                    <Form.Item label="Bollinger Bands"
                        required tooltip='ทำการแจ้งเตือนเมื่อราคาหุ้นตัดกับเส้น Upper Bollinger band หรือตัดเส้น Lower Bollinger band'>
                        <Switch onChange={setbbandonChange} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={(e) => { setnoti() }}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Row>
        </div>

    )
}

export default Notification;
