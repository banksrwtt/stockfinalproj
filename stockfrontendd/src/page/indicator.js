import React from 'react';
import { List, Collapse } from 'antd';
import { useState, useEffect } from "react";
import { fetchindicator } from '../service/Fetchindicator';
import { useNavigate } from "react-router-dom";

function Indicator() {

    const { Panel } = Collapse;
    const [data2, setdata2] = useState([])
    const navigate = useNavigate()

    // just fetch data from backend and show them in panel
    useEffect(() => {
        fetchindicator(window.localStorage.token).then((info) => {
            setdata2(info)
        }).catch((error) => {
            if (error.response) {
                alert('Please login before using this site')
                navigate("/signup")
            }
        })
    }, [])

    return (
        <div>
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

            </Collapse>
        </div>
    )

}
export default Indicator;
