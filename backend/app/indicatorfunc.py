import pandas as pd
import numpy as np
import pandas_ta as ta


def rsi30(RSI, name):
    # หา RSI น้อยกว่า 30
    RSI_30 = []
    for i in RSI:
        if i > 30:
            i = np.nan
            RSI_30.append(i)
        else:
            RSI_30.append(i)
    data = pd.DataFrame(list(zip(name, RSI_30)),
                        columns=['name', 'RSI_30'])
    data = data.dropna()
    if data['name'].empty:
        rsi30list = ['None']
    else:
        rsi30list = data['name'].tolist()

    return rsi30list


def rsi70(RSI, name):
    # หา RSI มากกว่า 70
    RSI_70 = []
    for i in RSI:
        if i < 70:
            i = np.nan
            RSI_70.append(i)
        else:
            RSI_70.append(i)
    data2 = pd.DataFrame(list(zip(name, RSI_70)),
                         columns=['name', 'RSI_70'])
    data2 = data2.dropna()
    if data2['name'].empty:
        rsi70list = ['None']
    else:
        rsi70list = data2['name'].tolist()
    return rsi70list


def bullishema200(stock, name):
    # กราฟที่มีเเนวโน้ม bullish เกิดจากราคาอยู่เหนือเส้น ema 200
    EMA = []
    for i in range(50):
        count = len(stock[i])
        i = stock[i]['Close'].ewm(span=200, adjust=False).mean()[count - 2]
        EMA.append(i)
    for i in range(50):
        price = EMA[i] - (stock[i]['Close'][count - 2])
        if price < 0:
            EMA[i] = np.nan
    data3 = pd.DataFrame(list(zip(name, EMA)),
                         columns=['name', 'EMA'])
    data3 = data3.dropna()
    if data3['name'].empty:
        bullishema200_list = ['None']
    else:
        bullishema200_list = data3['name'].tolist()

    return bullishema200_list


def goldencross(stock, name, num):
    # อยู่ในช่วง golden cross 200-50 ถ้าอยากเพิ่มเปลี่ยนตรง rolling เอามี 200-150 กับ 200-100 อีกเผื่อมึงอยากได้เยอะๆ
    MA_200 = []
    for i in range(50):
        count = len(stock[i])
        i = stock[i]['Close'].rolling(200).mean()[count - 2]
        MA_200.append(i)

    MA_50 = []
    for i in range(50):
        count = len(stock[i])
        i = stock[i]['Close'].rolling(num).mean()[count - 2]
        MA_50.append(i)

    for i in range(50):
        price = MA_50[i] - MA_200[i]
        if price < 0:
            MA_50[i] = np.nan
    data4 = pd.DataFrame(list(zip(name, MA_50)),
                         columns=['name', 'MA_50'])
    data4 = data4.dropna()
    if data4['name'].empty:
        goldencross_list = ['None']
    else:
        goldencross_list = data4['name'].tolist()

    return goldencross_list


def ath30(name, stock_day):
    # รายชื่อหุ้นที่ทำ all time high ใน 1 เดือนล่าสุด
    ATH_30 = []
    max = []
    for i in range(50):
        day = stock_day[i]['Close'].argmax()
        max.append(day)
        if max[i] <= len(stock_day[i])-30:
            ATH_30.append(i)
            ATH_30[i] = np.nan
        else:
            ATH_30.append(i)
    data5 = pd.DataFrame(list(zip(name, ATH_30)),
                         columns=['name', 'ATH_30'])
    data5 = data5.dropna()
    if data5['name'].empty:
        ath30list = ['None']
    else:
        ath30list = data5['name'].tolist()
    return ath30list


def ath90(name, stock_day):
    # รายชื่อหุ้นที่ทำ all time high ใน 3 เดือนล่าสุด
    ATH_90 = []
    max = []
    for i in range(50):
        day = stock_day[i]['Close'].argmax()
        max.append(day)
        if max[i] <= len(stock_day[i])-90:
            ATH_90.append(i)
            ATH_90[i] = np.nan
        else:
            ATH_90.append(i)
    data6 = pd.DataFrame(list(zip(name, ATH_90)),
                         columns=['name', 'ATH_90'])
    data6 = data6.dropna()
    if data6['name'].empty:
        ath90list = ['None']
    else:
        ath90list = data6['name'].tolist()
    return ath90list


def ath180(name, stock_day):
    # รายชื่อหุ้นที่ทำ all time high ใน 6 เดือนล่าสุด
    ATH_180 = []
    max = []
    for i in range(50):
        day = stock_day[i]['Close'].argmax()
        max.append(day)
        if max[i] <= len(stock_day[i])-180:
            ATH_180.append(i)
            ATH_180[i] = np.nan
        else:
            ATH_180.append(i)
    data7 = pd.DataFrame(list(zip(name, ATH_180)),
                         columns=['name', 'ATH_180'])
    data7 = data7.dropna()
    if data7['name'].empty:
        ath180list = ['None']
    else:
        ath180list = data7['name'].tolist()
    return ath180list


def ath52(name, stock_day):
    # รายชื่อหุ้นที่ทำ all time high ใน 52 สัปดาห์ หรือ 1 ปีล่าสุด
    ATH_52 = []
    max = []
    for i in range(50):
        day = stock_day[i]['Close'].argmax()
        max.append(day)
        if max[i] <= len(stock_day[i])-364:
            ATH_52.append(i)
            ATH_52[i] = np.nan
        else:
            ATH_52.append(i)
    data8 = pd.DataFrame(list(zip(name, ATH_52)),
                         columns=['name', 'ATH_52'])
    data8 = data8.dropna()
    if data8['name'].empty:
        ath52list = ['None']
    else:
        ath52list = data8['name'].tolist()
    return ath52list


def stoch20(name, STOCH):
    STOCH_20 = []
    for i in STOCH:
        if i > 20:
            i = np.nan
            STOCH_20.append(i)
        else:
            STOCH_20.append(i)
    data9 = pd.DataFrame(list(zip(name, STOCH_20)),
                         columns=['name', 'STOCH_20'])
    data9 = data9.dropna()
    if data9['name'].empty:
        stoch20list = ['None']
    else:
        stoch20list = data9['name'].tolist()
    return stoch20list


def stoch80(name, STOCH):
    STOCH_80 = []
    for i in STOCH:
        if i < 80:
            i = np.nan
            STOCH_80.append(i)
        else:
            STOCH_80.append(i)
    data10 = pd.DataFrame(list(zip(name, STOCH_80)),
                          columns=['name', 'STOCH_80'])
    data10 = data10.dropna()
    if data10['name'].empty:
        stoch80list = ['None']
    else:
        stoch80list = data10['name'].tolist()
    return stoch80list


# หา mfi มากกว่า 80
def mfi80(name, MFI):
    MFI_80 = []
    for i in MFI:
        if i < 80:
            i = np.nan
            MFI_80.append(i)
        else:
            MFI_80.append(i)
    data11 = pd.DataFrame(list(zip(name, MFI_80)),
                          columns=['name', 'MFI_80'])
    data11 = data11.dropna()
    if data11['name'].empty:
        mfi80list = ['None']
    else:
        mfi80list = data11['name'].tolist()
    return mfi80list


# หา mfi น้อยกว่า 20
def mfi20(name, MFI):
    MFI_20 = []
    for i in MFI:
        if i > 20:
            i = np.nan
            MFI_20.append(i)
        else:
            MFI_20.append(i)
    data12 = pd.DataFrame(list(zip(name, MFI_20)),
                          columns=['name', 'MFI_20'])
    data12 = data12.dropna()
    if data12['name'].empty:
        mfi20list = ['None']
    else:
        mfi20list = data12['name'].tolist()
    return mfi20list


# หา UO มากกว่า 70
def uo70(name, UO):
    UO_70 = []
    for i in UO:
        if i < 70:
            i = np.nan
            UO_70.append(i)
        else:
            UO_70.append(i)
    data13 = pd.DataFrame(list(zip(name, UO_70)),
                          columns=['name', 'UO_70'])
    data13 = data13.dropna()
    if data13['name'].empty:
        uo70list = ['None']
    else:
        uo70list = data13['name'].tolist()
    return uo70list


# หา UO น้อยกว่า 30
def uo30(name, UO):
    UO_30 = []
    for i in UO:
        if i > 30:
            i = np.nan
            UO_30.append(i)
        else:
            UO_30.append(i)
    data14 = pd.DataFrame(list(zip(name, UO_30)),
                          columns=['name', 'UO_30'])
    data14 = data14.dropna()
    if data14['name'].empty:
        uo30list = ['None']
    else:
        uo30list = data14['name'].tolist()
    return uo30list
