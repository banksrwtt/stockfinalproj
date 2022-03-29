import React from 'react';
import { Table } from 'antd';
import { useState, useEffect } from "react";
import { fetchsetgraph } from '../service/Fetchsetdata';
import { Settab } from './settab';

const columns = [
    {
        title: '',
        dataIndex: 'setname',
        key: 'setname'
    },
    {
        title: 'Recent Price',
        dataIndex: 'recent',
        key: 'recent',
        sorter: {
            compare: (a, b) => a.recent - b.recent,
        },
    },
    {
        title: 'Change',
        dataIndex: 'change',
        key: 'change',
        sorter: {
            compare: (a, b) => a.change - b.change,
        },
    },
    {
        title: '%Change',
        dataIndex: 'percentchange',
        key: 'percentchange',
        sorter: {
            compare: (a, b) => a.percentchange - b.percentchange,
        },
    },
    {
        title: 'High',
        dataIndex: 'high',
        key: 'high',
        sorter: {
            compare: (a, b) => a.high - b.high,
        },
    },
    {
        title: 'Low',
        dataIndex: 'low',
        key: 'low',
        sorter: {
            compare: (a, b) => a.low - b.low,
        },
    },
    {
        title: "Volume ('000)",
        dataIndex: 'volume',
        key: 'volume',
        sorter: {
            compare: (a, b) => a.volume - b.volume,
        },
    },
    {
        title: 'Value (Million. THB)',
        dataIndex: 'value',
        key: 'value',
        sorter: {
            compare: (a, b) => a.value - b.value,
        },
    },
];

export const Settable = () => {
    const [data, setdata] = useState([])
    
    useEffect(() => {
        fetchsetgraph(window.localStorage.token).then((info) => {
            setdata(info)
        })
    }, [])

    return (
        <div>
            <br></br>
            <h4>SET Market Overview</h4>
            <br></br>
            <Table columns={columns} dataSource={data} size='middle' />
            <Settab />
        </div>
    )
}
