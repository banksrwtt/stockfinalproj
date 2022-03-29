import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom'
import { fetchgraph } from "../service/FetchData";
import { IgrFinancialChart } from 'igniteui-react-charts';
import { IgrFinancialChartModule } from 'igniteui-react-charts';
import { FNGROUPCOUNTRecord } from "igniteui-react-excel";
import { Input, Button, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

IgrFinancialChartModule.register()

export const DisplayChart = () => {
    const [data, setdata] = useState([])
    const [stockname, setstockname] = useState("")
    const [startdate, setstartdate] = useState("")

    const search_stock = () => {
    
        fetchgraph(stockname, window.localStorage.token, startdate).then((info) => {
            setdata(info)
        })
        setstockname("")
        setstartdate("")
        //console.log(startdate)

    }
    // useEffect(()=>{
    //     fetchgraph("AAV").then((info)=>{
    //         console.log(info)
    //         setdata(info)
    //     })
    // },[])



    return (
        <div>
            <Input label='Stock name:' placeholder="ex. PTT" value={stockname} onChange={(e) => { setstockname(e.target.value.toUpperCase()) }} style={{ width: 304 }} />
            <br></br>
            <DatePicker label='Start date:' placeholder="Select start date" onChange={(e) => { setstartdate(e.format('YYYY-MM-DD')) }} />
            <br></br>
            <Button type="primary" icon={<SearchOutlined />} onClick={(e) => { search_stock() }}>
                Search
            </Button>
            <div className="container" style={{ height: "calc(100% - 25px)" }}>
                <IgrFinancialChart
                    width="100%"
                    height='700px'
                    chartType="Candle"
                    zoomSliderType="Candle"
                    volumeType="Area"
                    overlayBrushes="rgba(0, 181, 204, 0.5)"
                    overlayOutlines="rgba(0, 181, 204, 1)"
                    overlayThickness={1}
                    dataSource={data}
                    trendLineBrushes="rgba(0, 101, 209, 1)"
                />
            </div>
        </div>
    )
}