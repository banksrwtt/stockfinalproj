import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Switch, Button, Row, Modal, Tag, Table } from 'antd';
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
    const [macdstate, setmacdstate] = useState(0)
    const [bbandstate, setbbandstate] = useState(0)

    const [isModalVisible, setIsModalVisible] = useState(false);

    // Column data format
    const tabledata = [
        {
            key: '1',
            name: 'MA Length',
            value: [malength],
            status: [malength]
        },
        {
            key: '2',
            name: 'EMA Length',
            value: [emalength],
            status: [emalength]
        },
        {
            key: '3',
            name: 'UO Value',
            value: [uoprice],
            status: [uoprice]
        },
        {
            key: '4',
            name: 'CCI Value',
            value: [cciprice],
            status: [cciprice]
        },
        {
            key: '5',
            name: 'MFI Value',
            value: [mfiprice],
            status: [mfiprice]
        },
        {
            key: '6',
            name: 'RSI Value',
            value: [rsiprice],
            status: [rsiprice]
        },
        {
            key: '7',
            name: 'STO Value',
            value: [stoprice],
            status: [stoprice]
        },
        {
            key: '8',
            name: 'MACD',
            value: [macdstate],
            status: [macdstate]
        },
        {
            key: '9',
            name: 'Bollinger bands',
            value: [bbandstate],
            status: [bbandstate]
        },
    ]

    // Column format
    const tablecolumns = [
        {
            title: 'Notification Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
            render: value => (
                <>
                    {value.map(e => {
                        if (e === macdstate || bbandstate) {
                            return '-'
                        } else {
                            let num = e > 0 ? value : '-';
                            return (num)
                        }
                    })
                    }
                </>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <>
                    {status.map(e => {
                        if (typeof e == 'boolean') {

                            let color = (e) ? 'green' : 'volcano';
                            let active = (e) ? 'Activated' : 'Unactivated';
                            console.log(e)
                            return (
                                <Tag color={color} key={status}>
                                    {active}
                                </Tag>
                            );
                        } else {
                            let color = (e > 0) ? 'green' : 'volcano';
                            let active = (e > 0) ? 'Activated' : 'Unactivated';

                            return (
                                <Tag color={color} key={status}>
                                    {active}
                                </Tag>
                            );
                        }
                    })}
                </>
            ),
        }

    ];

    // Starting page by checking token 
    // If no token, automatically go to login/logout page
    useEffect(() => {
        fetchprofile(window.localStorage.token).then((info) => {
            setstockname(info['stock_noti'])
            setmalength(info['malength'])
            setemalength(info['emalength'])
            setuoprice(info['uoprice'])
            setcciprice(info['cciprice'])
            setmfiprice(info['mfiprice'])
            setrsiprice(info['rsiprice'])
            setstoprice(info['stoprice'])

            setmacdstate(info['macdstate'])
            setbbandstate(info['bbandstate'])
        }).catch((error) => {
            if (error.response) {
                alert('Please login before using this site')
                navigate("/signup")
            }
        });


    }, [])


    // Function for creating a dict data for using in setnoti() function
    function indicatorselect() {
        let dic = {}
        const header_list = [maonChange, emaonChange, uoonChange, ccionChange, mfionChange, rsionChange, stoonChange, macdonChange, bbandOnchange]
        const value_list = [malength, emalength, uoprice, cciprice, mfiprice, rsiprice, stoprice, macdstate, bbandstate]
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
                    alert('Error!! Something went wrong.')
                }
            })
    }

    function clearnoti() {
        axios({
            url: `http://localhost:5000/clearnoti?token=${window.localStorage.token}`,
        })
            .then((response) => {
                alert('Notifiactions cleared')
                window.location.reload()
            })

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

                    <Form.Item
                        label="Stock name"
                        name='stockname'
                        onChange={(e) => { setstockname(e.target.value) }}
                        value={stockname}
                        style={{ width: '400px' }}
                        rules={[
                            {
                                required: true,
                                message: "Please fill a stock name"
                            }
                        ]}
                    >

                        <Input
                            placeholder="Select stockname"
                            onChange={(e) => { setstockname(e.target.value.toUpperCase()) }}

                        />
                    </Form.Item>

                    <Form.Item label="Moving Average (MA)"
                        required tooltip='เลือกความยาวของเส้น MA ที่ต้องการ ระบบจะทำการแจ้งเตือนเมื่อเกิดการตัดกันของราคาและเส้น MA ที่เลือก'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <InputNumber placeholder="Set your MA length" style={{ width: '200px' }}
                            onChange={(e) => { setmalength(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setmaonChange} />
                    </Form.Item>

                    <Form.Item label="Exponential Moving Average (EMA)"
                        required tooltip='เลือกความยาวของ EMA ที่ต้องการ ระบบจะทำการแจ้งเตือนเมื่อเกิดการตัดกันของราคาและเส้น EMA ที่เลือก'>
                        <InputNumber placeholder="Set your EMA length" style={{ width: '200px' }}
                            onChange={(e) => { setemalength(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setemaonChange} />
                    </Form.Item>

                    <Form.Item label="Ultimate Oscillator (UO)"
                        required tooltip='เลือกค่า UO ที่ต้องการ ระบบจะทำการแจ้งเตือนเมื่อ UO ตัดผ่านค่าที่เลือก'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <InputNumber placeholder="Set your UO value" style={{ width: '200px' }}
                            onChange={(e) => { setuoprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setuoonChange} />
                    </Form.Item>

                    <Form.Item label="Commodity Channel Index (CCI)"
                        required tooltip='เลือกค่า CCI ที่ต้องการ ระบบจะทำการแจ้งเตือนเมื่อ CCI ตัดผ่านค่าที่เลือก'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <InputNumber placeholder="Set your CCI value" style={{ width: '200px' }}
                            onChange={(e) => { setcciprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setccionChange} />
                    </Form.Item>

                    <Form.Item label="Money Flow Index (MFI)"
                        required tooltip='เลือกค่า MFI ที่ต้องการ ระบบจะทำการแจ้งเตือนเมื่อ MFI ตัดผ่านค่าที่เลือก'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <InputNumber placeholder="Set your MFI value" style={{ width: '200px' }}
                            onChange={(e) => { setmfiprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setmfionChange} />
                    </Form.Item>

                    <Form.Item label="Relative Strength Index (RSI)"
                        required tooltip='เลือกค่า RSI ที่ต้องการ ระบบจะทำการแจ้งเตือนเมื่อ RSI ตัดผ่านค่าที่เลือก'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <InputNumber placeholder="Set your RSI value" style={{ width: '200px' }}
                            onChange={(e) => { setrsiprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setrsionChange} />
                    </Form.Item>

                    <Form.Item label="Stochastic Oscillator (STO)"
                        required tooltip='เลือกค่า STO ที่ต้องการ ระบบจะทำการแจ้งเตือนเมื่อ STO ตัดผ่านค่าที่เลือก'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <InputNumber placeholder="Set your STO value" style={{ width: '200px' }}
                            onChange={(e) => { setstoprice(e) }} />
                        &nbsp;&nbsp;<Switch onChange={setstoonChange} />
                    </Form.Item>

                    <Form.Item label="Moving Average Convergence Divergence (MACD)"
                        required tooltip='ระบบจะทำการแจ้งเตือนเมื่อเกิดการตัดกันของ MACD และ Signal line'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Switch onChange={(e) => {
                            setmacdonChange(e)
                            setmacdstate(1)
                        }} />
                    </Form.Item>

                    <Form.Item label="Bollinger Bands"
                        required tooltip='ระบบจะทำการแจ้งเตือนเมื่อราคาตัดกันกับขอบบนหรือขอบล่างของ Bollinger Bands'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Switch onChange={(e) => {
                            setbbandonChange(e)
                            setbbandstate(1)
                        }} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={(e) => { setnoti() }}>
                            Submit
                        </Button>
                        &nbsp;&nbsp;&nbsp;
                        <Button type="secondary" onClick={() => { setIsModalVisible(true) }}>
                            See Notifiactions
                        </Button>
                        <Modal
                            title={stockname}
                            visible={isModalVisible}
                            onOk={() => { setIsModalVisible(false); }}
                            onCancel={() => { setIsModalVisible(false); }}
                        >
                            <Table columns={tablecolumns} dataSource={tabledata} bordered />
                            <Button type="primary" onClick={() => { clearnoti() }} >
                                Clear Notification
                            </Button>
                        </Modal>
                    </Form.Item>

                </Form>
            </Row>
        </div>

    )
}

export default Notification;
