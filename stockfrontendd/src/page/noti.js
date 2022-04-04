import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Switch, Button, Row, Tag, Table } from 'antd';
import { fetchprofile } from '../service/Fetchnotification'
import axios from "axios";

function Noti() {

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


    const datasource = [
        {
            key: '1',
            name: 'MA Length',
            settingvalue: [1],
            status: [1],
            placeholder: "Select stockname"
        },
    ]

    const tablecolumns = [
        {
            title: 'Notification Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: "textarea",
            width: "400",
            dataIndex: 'placeholder',
            render: placeholder => {
                return <Input />
                //<Input placeholder={placeholder}/>
            }
        },
        {
            title: 'Enable',
            dataIndex: 'enable',
            key: 'enable',
            render: enable => {
                return <Switch/>
            }
        },
        {
            title: 'Setting Value',
            dataIndex: 'settingvalue',
            key: 'settingvalue',
            render: settingvalue => (
                <>
                    {settingvalue.map(e => {
                        let num = e > 0 ? settingvalue : '-';
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


    return (
        <div>
            <h1>Notification setting</h1>
            <Row justify="center" style={{ minHeight: '100vh' }}>
                <Form.Item>
                    <Table columns={tablecolumns} dataSource={datasource} bordered />
                </Form.Item>
            </Row>
        </div>
    )
}
export default Noti;