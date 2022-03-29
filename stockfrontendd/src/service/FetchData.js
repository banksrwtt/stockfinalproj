import axios from "axios"

const convert = (str_json) => {
    var list_of_str = str_json.slice(1, -1).split(", ")
    var new_list = []
    for (let i = 0; i < list_of_str.length; i++) {
        new_list.push(parseFloat(list_of_str[i]))
    }
    return new_list
}
const convert_date = (str_json) => {
    var list_of_str = str_json.slice(1, -1).split(", ")
    var new_list = []
    for (let i = 0; i < list_of_str.length; i++) {

        var parts = list_of_str[i].slice(1, -1).split("-")

        var date = new Date(parts[0], parts[1], parts[2]);

        new_list.push(date)
    }
    return new_list
}

const convert_format = (oitem) => {
    var stockitem = []
    for (let i = 0; i < oitem.open_data.length; i++) {
        let item = {};
        item.Date = oitem.time_data[i]
        item.Open = oitem.open_data[i]
        item.High = oitem.high_data[i]
        item.Low = oitem.low_data[i]
        item.Close = oitem.close_data[i]
        item.Volume = oitem.volume_data[i]
        stockitem.push(item);
    }
    return stockitem
}

export async function fetchgraph(stockname, token, startdate) {

    //console.log("stockname", stockname)
    //console.log(start)
    //console.log(end)
    const res = await axios.get(`http://localhost:5000/stockname=${stockname}&startdate=${startdate}?token=${token}`)

    const info = await res.data
    //console.log("info", info)
    var item = {}
    item.open_data = convert(info.open_data)
    item.high_data = convert(info.high_data)
    item.low_data = convert(info.low_data)
    item.close_data = convert(info.close_data)
    item.time_data = convert_date(info.time_data)
    item.volume_data = convert(info.volume_data)


    //console.log(convert_format(item))
    //console.log(info)
    return convert_format(item)
}

