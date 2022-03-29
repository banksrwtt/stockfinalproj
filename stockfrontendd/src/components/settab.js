import React from 'react';
import { Table } from 'antd';
import { Tabs } from 'antd';
import { useState, useEffect } from "react";
import { fetchset100graph } from '../service/Fetchset100';
import { fetchset50graph } from '../service/Fetchset50';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: {
            compare: (a, b) => a.name - b.name,
        },
    },
    {
        title: 'Open',
        dataIndex: 'open',
        key: 'open',
        sorter: {
            compare: (a, b) => a.open - b.open,
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
        title: 'Recent',
        dataIndex: 'close',
        key: 'close',
        sorter: {
            compare: (a, b) => a.close - b.close,
        },
    },
    {
        title: 'Change',
        dataIndex: 'change',
        key: 'change',
        sorter: {
            compare: (a, b) => a.change - b.change,
        },
        render(text) {
            return {
                props: {
                    style: { color: parseFloat(text) <= 0 ? "red" : "green" }
                },
                children: <div>{text}</div>
            };
        }
    },
    {
        title: '%Change',
        dataIndex: 'percentchange',
        key: 'percentchange',
        sorter: {
            compare: (a, b) => a.percentchange - b.percentchange,
        },
        render(text, record) {
            return {
                props: {
                    style: { color: parseFloat(text) <= 0 ? "red" : "green" }
                },
                children: <div>{text}</div>
            };
        }
    },
    {
        title: 'Bid',
        dataIndex: 'bid',
        key: 'bid',
        sorter: {
            compare: (a, b) => a.bid - b.bid,
        },
    },
    {
        title: 'Offer',
        dataIndex: 'offer',
        key: 'offer',
        sorter: {
            compare: (a, b) => a.offer - b.offer,
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

const { TabPane } = Tabs;

class Time extends React.Component {
    state = {
        curTime: new Date().toLocaleString(),
    }
    render() {
        return (
            <div>
                <p style={{ textAlign: 'right' }}>
                    Data Time : {this.state.curTime}
                </p>
            </div>
        );
    }
}

export const Settab = () => {
    const [fiftydata, setfiftydata] = useState([])
    const [hundreddata, sethundreddata] = useState([])

    useEffect(() => {
        fetchset50graph(window.localStorage.token).then((info) => {
            setfiftydata(info)
        })
    }, [])

    useEffect(() => {
        fetchset100graph(window.localStorage.token).then((info) => {
            sethundreddata(info)
        })
    }, [])


    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="SET50" key="1">
                    <Table columns={columns} dataSource={fiftydata} style={{ color: '#1890ff' }} size='middle' bordered />,
                </TabPane>
                <TabPane tab="SET100" key="2">
                    <Table columns={columns} dataSource={hundreddata} size='middle' bordered />,
                </TabPane>
            </Tabs>
            <Time />
        </div>

    )
}