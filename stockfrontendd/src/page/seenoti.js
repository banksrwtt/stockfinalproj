import React from "react";
import { useState, useEffect } from 'react';
import { Form, Tag, Table, Row, Button } from "antd";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { fetchprofile } from "../service/Fetchnotification";

function Seenoti() {
    const navigate = useNavigate()
    const [stockname, setstockname] = useState('')
    const [malength, setmalength] = useState(0)
    const [emalength, setemalength] = useState(0)
    const [uoprice, setuoprice] = useState(0)
    const [cciprice, setcciprice] = useState(0)
    const [mfiprice, setmfiprice] = useState(0)
    const [rsiprice, setrsiprice] = useState(0)
    const [stoprice, setstoprice] = useState(0)
    const [macdstate, setmacdstate] = useState(0)
    const [bbandstate, setbbandstate] = useState(0)

    // Starting page by checking token, collecting notification 
    // setting data from database, and then show them in the table 
    // with a status tag
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
                navigate("/")
            }
        })
    }, [])

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
                        let num = e > 0 ? value : '-';
                        return (num)
                    })
                    }
                </>
            )
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <>
                    {status.map(e => {
                        let color = e > 0 ? 'green' : 'volcano';
                        let active = e > 0 ? 'Activated' : 'Unactivated';
                        return (
                            <Tag color={color} key={status}>
                                {active}
                            </Tag>
                        );
                    })}
                </>
            ),

        }
    ];

    // function use to delete and revoke all the notification
    // data in both database and frontend
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
            <h1>Notification list ({stockname})</h1>
            <Row justify="center" style={{ minHeight: '100vh' }}>
                <Form.Item>
                    <Table columns={tablecolumns} dataSource={tabledata} bordered />
                    <Button type="primary" onClick={() => { clearnoti() }} >
                        Clear Notification
                    </Button>
                </Form.Item>
            </Row>
        </div>
    )



}
export default Seenoti;

