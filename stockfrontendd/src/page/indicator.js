import React from 'react';
import { List, Collapse, Spin, Select, Button } from 'antd';
import { useState, useEffect } from "react";
import { fetchindicator } from '../service/Fetchindicator';
import { useNavigate } from "react-router-dom";

function Indicator() {

    const navigate = useNavigate()
    const { Option } = Select;
    const { Panel } = Collapse;
    const [spinstate, setspinstate] = useState(false)
    const [data2, setdata2] = useState([])

    const [mixdata, setmixdata] = useState([])
    const [indicatorlist, setindicatorliststate] = useState([])

    // just fetch data from backend and show them in panel
    useEffect(() => {
        setspinstate(true)
        fetchindicator(window.localStorage.token).then((info) => {
            setdata2(info)
            setspinstate(false)
        }).catch((error) => {
            if (error.response) {
                alert('Please login before using this site')
                window.localStorage.removeItem('token')
                window.localStorage.removeItem('sessionstart')
                navigate("/signup")
            }
        })
    }, [])

    function findmixdata(value) {
        setindicatorliststate(value)
    }

    const mixoncilck = () => {
        var preparemixdata = []
        indicatorlist.forEach(e => {
            preparemixdata.push(data2[e])
        })
        let result = preparemixdata.shift().reduce(function (res, v) {
            if (res.indexOf(v) === -1 && preparemixdata.every(function (a) {
                return a.indexOf(v) !== -1;
            })) res.push(v);
            return res;
        }, []);
        if (result.length === 0) {
            result.push('None')
        }
        setmixdata(result)
    }

    const children = []
    const children2 = ['rsi30', 'rsi70', 'bullishema200', 'goldencross50', 'goldencross100', 'goldencross150',
        'ath30', 'ath90', 'ath180', 'ath52', 'stoch20', 'stoch80', 'mfi20', 'mfi80', 'uo30', 'uo70', 'macd']
    const children3 = ['RSI<30', 'RSI>70', 'Bullish Divergence', 'Golden Cross MA200-50', "Golden Cross MA200-100",
        'Golden Cross MA200-150', 'All time high 30 days', 'All time high 90 days', 'All time high 180 days',
        'All time high 52 weeks', 'STO<20', 'STO>80', 'MFI<20', 'MFI>80', 'UO<30', 'UO>70', 'MACD']
    children2.forEach((e, i) => {
        children.push(
            <Option value={e} key={e}>
                {children3[i]}
            </Option>
        );
    })

    return (
        <div>
            <Spin spinning={spinstate} tip='Fetching data'>
                <h1>SET50 Indicator Scanner</h1>
                <Collapse>
                    <Panel header="Relative Strength Index" key="1">
                        <Collapse defaultActiveKey="1">
                            <Panel header="RSI<30">
                                <List
                                    bordered
                                    dataSource={data2.rsi30}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="2">
                            <Panel header="RSI>70" >
                                <List
                                    bordered
                                    dataSource={data2.rsi70}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                    </Panel>

                    <Panel header="Bullish divergence" key="2">
                        <List
                            bordered
                            dataSource={data2.bullishema200}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>

                    <Panel header="Golden Cross" key="3">
                        <Collapse defaultActiveKey="1">
                            <Panel header="MA200-50">
                                <List
                                    bordered
                                    dataSource={data2.goldencross50}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="2">
                            <Panel header="MA200-100" >
                                <List
                                    bordered
                                    dataSource={data2.goldencross100}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="3">
                            <Panel header="MA200-150" >
                                <List
                                    bordered
                                    dataSource={data2.goldencross150}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                    </Panel>

                    <Panel header="All Time High" key="4">
                        <Collapse defaultActiveKey="1">
                            <Panel header="30 days">
                                <List
                                    bordered
                                    dataSource={data2.ath30}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="2">
                            <Panel header="90 days" >
                                <List
                                    bordered
                                    dataSource={data2.ath90}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="3">
                            <Panel header="180 days" >
                                <List
                                    bordered
                                    dataSource={data2.ath180}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="4">
                            <Panel header="52 weeks" >
                                <List
                                    bordered
                                    dataSource={data2.ath52}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                    </Panel>

                    <Panel header="Stochastic Oscillator" key="5">
                        <Collapse defaultActiveKey="1">
                            <Panel header="STO<20">
                                <List
                                    bordered
                                    dataSource={data2.stoch20}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="2">
                            <Panel header="STO>80" >
                                <List
                                    bordered
                                    dataSource={data2.stoch80}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                    </Panel>

                    <Panel header="Money Flow Index" key="6">
                        <Collapse defaultActiveKey="1">
                            <Panel header="MFI<20">
                                <List
                                    bordered
                                    dataSource={data2.mfi20}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="2">
                            <Panel header="MFI>80" >
                                <List
                                    bordered
                                    dataSource={data2.mfi80}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                    </Panel>

                    <Panel header="Ultimate Oscillator" key="7">
                        <Collapse defaultActiveKey="1">
                            <Panel header="UO<30">
                                <List
                                    bordered
                                    dataSource={data2.uo30}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                        <Collapse defaultActiveKey="2">
                            <Panel header="UO>70" >
                                <List
                                    bordered
                                    dataSource={data2.uo70}
                                    renderItem={item => <List.Item>{item}</List.Item>}
                                />
                            </Panel>
                        </Collapse>
                    </Panel>

                    <Panel header="MACD" key='8'>
                        <List
                            bordered
                            dataSource={data2['macd']}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>
                </Collapse>
                <br></br>

                <Select
                    mode="multiple"
                    placeholder="Select a mix indicator scanner"
                    onChange={findmixdata}
                    style={{ width: '400px' }}
                >
                    {children}
                </Select>
                &nbsp;&nbsp;&nbsp;
                <Button type="primary" htmlType="submit" onClick={mixoncilck}>
                    Submit
                </Button>

                <br></br>

                <Collapse defaultActiveKey='1'>
                    <Panel header='Mix Indicator Scanner' key='9'>
                        <List
                            bordered
                            dataSource={mixdata}
                            renderItem={item => <List.Item>{item}</List.Item>}
                        />
                    </Panel>
                </Collapse>

            </Spin>

        </div >
    )

}
export default Indicator;
