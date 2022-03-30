import yfinance as yf
from datetime import datetime
import pandas as pd
import time
import requests
import pandas_ta as ta
from celery import shared_task

"""

ใช้แบบแยกไฟล์ไม่ได้ไม่รู้เป็นไร เลยเอาไปรวมที่ app.py ไปเลย

@shared_task(name='ma')
def ma(name, day, linetoken):
    while True:
        stock = yf.download(tickers=name + '.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()
        count = len(stock)
        last = stock['Close'][count - 2]
        before = stock['Close'][count - 3]
        MA_last = stock['Close'].rolling(day).mean()[count - 2]
        MA_before = stock['Close'].rolling(day).mean()[count - 3]
        Signal = "none"

        if last > MA_last and before < MA_before:
            Signal = "good"  # return json
            text = "############\n" + 'MA' + \
                str(day)+' crossing detected from ' + \
                name + '\n#########################'
            linenotify(text, linetoken)
            return Signal
        elif last < MA_last and before > MA_before:
            Signal = "good"  # return json
            text = "############\n" + 'MA' + \
                str(day)+' crossing detected from ' + \
                name + '\n#########################'
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"  # return nothing

        # print("\n""####### Signal and Trend #####")
        # print("Signal = ", Signal)
        sleep = 3600

        # print("\n""Sleep", sleep, "sec.")
        time.sleep(sleep)


@shared_task(name='ema')
def ema(name, day, linetoken):
    while True:
        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        last = stock['Close'][count-2]
        before = stock['Close'][count-3]
        EMA_last = stock['Close'].ewm(span=day, adjust=False).mean()[count-2]
        EMA_before = stock['Close'].ewm(span=day, adjust=False).mean()[count-3]
        Signal = "none"

        if last > EMA_last and before < EMA_before:
            Signal = "good"
            print('done')
            text = "############\n" + 'EMA' + \
                str(day)+' crossing detected from ' + \
                name + '\n#########################'
            linenotify(text, linetoken)
            return Signal
        elif last < EMA_last and before > EMA_before:
            Signal = "good"
            print('done')
            text = "############\n" + 'EMA' + \
                str(day)+' crossing detected from ' + \
                name + '\n#########################'
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        # print("\n""####### Signal and Trend #####")
        # print("Signal = ", Signal)
        sleep = 3600

        # print("\n""Sleep", sleep, "sec.")
        time.sleep(sleep)"""


@shared_task(name='macd')
def macd(name, linetoken):
    count = 0
    while True:
        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        MACD = stock.ta.macd(close=stock['Close'], fast=12, slow=26, signal=9)
        macd_last = MACD['MACD_12_26_9'][count-2]
        macd_before = MACD['MACD_12_26_9'][count-3]
        signal_last = MACD['MACDs_12_26_9'][count-2]
        signal_before = MACD['MACDs_12_26_9'][count-3]
        Signal = "none"

        if macd_last > signal_last and macd_before < signal_before:
            Signal = "good" 
            text = 'MACD crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif macd_last < signal_last and macd_before > signal_before:
            Signal = "good"  
            text = 'MACD crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"  # return nothing


        import time
        sleep = 3600
        count+=1
        time.sleep(sleep)



def linenotify(text, linetoken):
    LINE_TOKEN = linetoken
    line_url = "https://notify-api.line.me/api/notify"
    LINE_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded',
                    "Authorization": "Bearer " + LINE_TOKEN}
    a = requests.post(line_url, headers=LINE_HEADERS, data={'message': text})
    print(a.text)
