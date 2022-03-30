import celery
from flask import Flask, request, jsonify, make_response
from flask_api import status
from flask_cors import CORS
from functools import wraps
from pymongo import MongoClient
import jwt
from celery import Celery, current_task, current_app
from celery.result import AsyncResult


import json
import yfinance as yf
import pandas as pd
import numpy as np
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pandas_ta as ta
import time

import indicatorfunc as idf
# import tasks

SECRET_KEY = 'stockfinalproject'
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config.update(
    CELERY_BROKER_URL='redis://127.0.0.1:6379/0',
    CELERY_RESULT_BACKEND='redis://127.0.0.1:6379/0'
)

client = MongoClient('mongodb://localhost:27017/')
mydb = client['admin']
db = mydb['finalproj']


def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL'],
        include=['tasks']
    )

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery


celery_app = make_celery(app)
celery_app.conf.task_send_sent_event = True


def token_require(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get("token")

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        except:
            return jsonify({"message": "Token is invalid"}), 403

        return f(*args, **kwargs)

    return decorated


@app.route('/')
def home():
    return "This is home page "


@app.route('/stockname=<name>&startdate=<start>')
@token_require
def chart(name, start):
    # stock = yf.Ticker(name+'.BK').history(period='max').dropna().reset_index()
    stock = yf.download(tickers=name+'.BK', start=pd.to_datetime(start),
                        end=str(datetime.now().date())).dropna().reset_index()
    stock_time = [i.strftime("%Y-%m-%d").replace(' 00:00:00', '')
                  for i in stock['Date']]
    stock_open = stock['Open'].tolist()
    stock_high = stock['High'].tolist()
    stock_low = stock['Low'].tolist()
    stock_close = stock['Close'].tolist()
    stock_volume = stock['Volume'].tolist()

    stock_time = json.dumps(stock_time)
    stock_open = json.dumps(stock_open)
    stock_high = json.dumps(stock_high)
    stock_low = json.dumps(stock_low)
    stock_close = json.dumps(stock_close)
    stock_volume = json.dumps(stock_volume)
    # http://127.0.0.1:5000/stock_name=AAV
    return {'open_data': stock_open, 'high_data': stock_high, 'low_data': stock_low,
            'close_data': stock_close, 'time_data': stock_time, 'volume_data': stock_volume}


@app.route('/setprofile')
@token_require
def setprofile():
    url = 'https://www.settrade.com/C13_MarketSummary.jsp?detail=SET50'
    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    name = soup.find_all('td')
    name_list = []
    for i in name:
        name_list.append(i.string)
    name_list = list(filter(None, name_list))
    name_list = [str(i).replace(
        '\r\n                                    ', '') for i in name_list]
    name_list = name_list[0:22]
    name_list = [str(i).replace(',', '') for i in name_list]
    name_list = [float(i) for i in name_list]

    data = {'key': ['1', '2', '3'],
            'setname': ['SET', 'SET50', 'SET100'],
            'recent': [name_list[0], name_list[7], name_list[14]],
            'change': [name_list[1], name_list[8], name_list[15]],
            'percentchange': [name_list[2], name_list[9], name_list[16]],
            'high': [name_list[3], name_list[10], name_list[17]],
            'low': [name_list[4], name_list[11], name_list[18]],
            'volume': [name_list[5], name_list[12], name_list[19]],
            'value': [name_list[6], name_list[13], name_list[20]],
            }
    data2 = pd.DataFrame(data).to_json(orient='records')

    return data2


@app.route('/set50')
@token_require
def setfifty():
    url = 'https://www.settrade.com/C13_MarketSummary.jsp?detail=SET50'
    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    name = soup.find_all('a')
    name_list = []
    for i in name:
        name_list.append(i.string)

    number = soup.find_all('td')
    number_list = []
    for j in number:
        number_list.append(j.string)
    number_list = list(filter(None, number_list))

    name_list_set50 = name_list[151:201]
    number_list_set50 = number_list[89:589]
    number_list_set50 = [str(i).replace(',', '') for i in number_list_set50]
    number_list_set50 = [float(i) for i in number_list_set50]
    data = {
        'key': [str(i) for i in range(1, 51)],
        'name': name_list_set50,
        'open': [i for i in number_list_set50[0:500:10]],
        'high': [i for i in number_list_set50[1:500:10]],
        'low': [i for i in number_list_set50[2:500:10]],
        'close': [i for i in number_list_set50[3:500:10]],
        'change': [i for i in number_list_set50[4:500:10]],
        'percentchange': [i for i in number_list_set50[5:500:10]],
        'bid': [i for i in number_list_set50[6:500:10]],
        'offer': [i for i in number_list_set50[7:500:10]],
        'volume': [i for i in number_list_set50[8:500:10]],
        'value': [i for i in number_list_set50[9:500:10]],
    }
    data2 = pd.DataFrame(data).to_json(orient='records')

    return data2


@app.route('/set100')
@token_require
def sethundred():
    url = 'https://www.settrade.com/C13_MarketSummary.jsp?detail=SET100'
    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    name = soup.find_all('a')
    name_list = []
    for i in name:
        name_list.append(i.string)

    number = soup.find_all('td')
    number_list = []
    for j in number:
        number_list.append(j.string)
    number_list = list(filter(None, number_list))

    name_list_set100 = name_list[151:251]
    number_list_set100 = number_list[89:1089]
    number_list_set100 = [str(i).replace(',', '') for i in number_list_set100]
    number_list_set100 = [float(i) for i in number_list_set100]
    data = {
        'key': [str(i) for i in range(1, 101)],
        'name': name_list_set100,
        'open': [i for i in number_list_set100[0:1000:10]],
        'high': [i for i in number_list_set100[1:1000:10]],
        'low': [i for i in number_list_set100[2:1000:10]],
        'close': [i for i in number_list_set100[3:1000:10]],
        'change': [i for i in number_list_set100[4:1000:10]],
        'percentchange': [i for i in number_list_set100[5:1000:10]],
        'bid': [i for i in number_list_set100[6:1000:10]],
        'offer': [i for i in number_list_set100[7:1000:10]],
        'volume': [i for i in number_list_set100[8:1000:10]],
        'value': [i for i in number_list_set100[9:1000:10]],
    }
    data2 = pd.DataFrame(data).to_json(orient='records')

    return data2


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data["email"]
    password = data["password"]
    if(db.find_one({'email': email}) and db.find_one({'password': password})):
        token = jwt.encode(
            {'user': email, 'exp': datetime.utcnow() + timedelta(minutes=120)}, SECRET_KEY)
        print(token)
        # token = "".join([chr(i) for i in token])
        print(token)
        return jsonify({'token': token})
    # return 'Record not found', 400
    return make_response("could not verify!", 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']
    linetoken = data['linetoken']
    if db.count_documents({'email': email}, limit=1) != 0:
        return 'This email already exist. Please use another email', status.HTTP_400_BAD_REQUEST
    else:
        db.insert_one(
            {'email': email, 'password': password, 'linetoken': linetoken})
        return jsonify('success', 200)


@app.route('/resetpassword', methods=['POST'])
def resetpassword():
    data = request.json
    email = data['email']
    password = data['password']
    if db.count_documents({'email': email}, limit=1) == 0:
        return "This email isn't exist. Please Recheck your email",  status.HTTP_400_BAD_REQUEST
    else:
        db.update_one({'email': email}, {'$set': {'password': password}})
        return jsonify('success', 200)


@app.route('/notification')
@token_require
def seenoti():
    token = request.args.get("token")
    data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    email = data['user']
    collection = db.find_one({'email': email})

    header_list = ['stock_noti_name', 'malength', 'emalength', 'uoprice',
                   'cciprice', 'mfiprice', 'rsiprice', 'stoprice', 'macdstate', 'bbandstate']
    prepared_data = {}
    try:
        prepared_data['stock_noti'] = collection['stock_noti_name']
        for i in header_list:
            if i in collection['noti']:
                prepared_data[i] = collection['noti'][i]
            else:
                prepared_data[i] = None
    except:
        pass

    return jsonify(prepared_data)


@app.route('/notisetting', methods=['POST'])
@token_require
def setnoti():
    data = request.json
    stock_noti_name = data['stockname']
    token = request.args.get("token")
    token_decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    email = token_decoded['user']
    db.update_one({"email": email}, {
                  "$set": {"stock_noti_name": stock_noti_name}})
    linetoken = db.find_one({'email': email}, {'linetoken': 1, '_id': 0})[
        'linetoken']
    header_dict = {
        'malength': ma,
        'emalength': ema,
        'macdstate': macd,
        'uoprice': uo,
        'cciprice': cci,
        'mfiprice': mfi,
        'rsiprice': rsi,
        'stoprice': sto,
        'bbandstate': bollband
    }
    wait_dict = {}
    wait_id_dict = {}
    for i in header_dict.keys():
        if i in data:
            # create task
            if (i == 'macdstate') or (i == 'bbandstate'):
                # macd and bbands are the only two function with 2 arguments
                x = header_dict[i].delay(stock_noti_name, linetoken)
            else:
                x = header_dict[i].delay(stock_noti_name, data[i], linetoken)
            # prepare data for database
            time.sleep(5)
            if celery_app.AsyncResult(x.task_id).status != 'SUCCESS':
                wait_dict[i] = data[i]
                wait_id_dict[i] = x.task_id
    print(wait_dict)
    db.update_one({'email': email}, {'$set': {'noti': wait_dict}})
    db.update_one({'email': email}, {'$set': {'task_id': wait_id_dict}})

    return data


@app.route('/clearnoti')
@token_require
def clearnoti():
    token = request.args.get("token")
    token_decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    email = token_decoded['user']
    collection = db.find_one({'email': email})
    db.update_one({'email': email}, {'$unset': {'stock_noti_name': ''}})
    for i in collection['task_id']:
        celery_app.AsyncResult(collection['task_id'][i]).revoke(terminate=True)
        print(str(i) + 'revoked')
    db.update_one({'email': email}, {'$unset': {'noti': '', 'task_id': ''}})
    # db.update_one({'email': email}, {'$unset': {'task_id': ''}})
    return 'success'


@app.route('/indicator')
@token_require
def indicator():
    # ดึงชื่อใน set50
    url = 'https://www.settrade.com/C13_MarketSummary.jsp?detail=SET50'
    req = requests.get(url)
    soup = BeautifulSoup(req.text, 'html.parser')
    name = soup.find_all('a')
    name_list = []
    for i in name:
        name_list.append(i.string)
    name_list_set50 = name_list[151:201]

    # ดึงเป็นชม.
    stock = []
    for i in range(50):
        x = yf.download(tickers=str(name_list_set50[i]) + '.BK', start=pd.to_datetime('2022-01-01'),
                        end=str(datetime.now().date()), interval='1h').reset_index()
        stock.append(x)

    # ดึงเป็นวัน
    stock_day = []
    for i in range(50):
        y = yf.download(tickers=name_list_set50[i]+'.BK', start=pd.to_datetime('2008-01-01'),
                        end=str(datetime.now().date()), interval='1d').reset_index()
        stock_day.append(y)

    # สร้าง RSI รวม
    RSI = []
    for i in range(50):
        count = len(stock[i])
        z = stock[i].ta.rsi(close=stock[i]['Close'],
                            length=14, append=True)[count - 2]
        RSI.append(z)

    STOCH = []
    for i in range(50):
        stoch = stock[i].ta.stoch(close=stock[i]['Close'], length=14)
        count1 = len(stock[i])
        t = stoch['STOCHk_14_3_3'][count1-2]
        STOCH.append(t)

    MFI = []
    for i in range(50):
        count2 = len(stock[i])
        mfi = stock[i].ta.mfi(close=stock[i]['Close'], length=14)[count2-2]
        MFI.append(mfi)

    UO = []
    for i in range(50):
        count3 = len(stock[i])
        uo = stock[i].ta.uo(close=stock[i]['Close'])[count3-2]
        UO.append(uo)

    data = {
        'rsi30': idf.rsi30(RSI, name_list_set50),
        'rsi70': idf.rsi70(RSI, name_list_set50),
        'bullishema200': idf.bullishema200(stock, name_list_set50),
        'goldencross50': idf.goldencross(stock, name_list_set50, 50),
        'goldencross100': idf.goldencross(stock, name_list_set50, 100),
        'goldencross150': idf.goldencross(stock, name_list_set50, 150),
        'ath30': idf.ath30(name_list_set50, stock_day),
        'ath90': idf.ath90(name_list_set50, stock_day),
        'ath180': idf.ath180(name_list_set50, stock_day),
        'ath52': idf.ath52(name_list_set50, stock_day),
        'stoch20': idf.stoch20(name_list_set50, STOCH),
        'stoch80': idf.stoch80(name_list_set50, STOCH),
        'mfi20': idf.mfi20(name_list_set50, MFI),
        'mfi80': idf.mfi80(name_list_set50, MFI),
        'uo30': idf.uo30(name_list_set50, UO),
        'uo70': idf.uo70(name_list_set50, UO)

    }

    return jsonify(data)


@celery_app.task(name='ma')
def ma(name, day, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit (7days)', linetoken)
            return 'exceed limit'
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
            text = 'MA' + str(day) + ' crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif last < MA_last and before > MA_before:
            Signal = "good"  # return json
            text = 'MA' + str(day) + ' crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"  # return nothing

        sleep = 3600
        loopcount += 1
        time.sleep(sleep)


@celery_app.task(name='ema')
def ema(name, day, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'
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
            text = 'EMA' + str(day)+' crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif last < EMA_last and before > EMA_before:
            Signal = "good"
            print('done')
            text = 'EMA' + str(day)+' crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"
        sleep = 3600
        loopcount += 1

        time.sleep(sleep)


@celery_app.task(name='macd')
def macd(name, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'
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
            Signal = "good"  # return json
            text = 'MACD crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif macd_last < signal_last and macd_before > signal_before:
            Signal = "good"  # return json
            text = 'MACD crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        sleep = 3600  # 1hr
        loopcount += 1
        time.sleep(sleep)


@celery_app.task(name='uo')  # Ultimate Oscillator
def uo(name, price, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'
        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        uo_last = stock.ta.uo(close=stock['Close'])[count-2]
        uo_before = stock.ta.uo(close=stock['Close'])[count-3]
        Signal = "none"

        if price > uo_last and price < uo_before:
            Signal = "ตัดขึ้น"
            text = 'Ultimate Oscillator crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif price < uo_last and price > uo_before:
            Signal = "ตัดลง"
            text = 'Ultimate Oscillator crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        loopcount += 1
        sleep = 3600
        time.sleep(sleep)


@celery_app.task(name='cci')  # commodity chanel index
def cci(name, price, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'
        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        cci_last = stock.ta.cci(close=stock['Close'], length=20)[count-2]
        cci_before = stock.ta.cci(close=stock['Close'], length=20)[count-3]
        Signal = "none"

        if price > cci_last and price < cci_before:
            Signal = "ตัดขึ้น"
            text = 'Commodity Channel Index crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif price < cci_last and price > cci_before:
            Signal = "ตัดลง"
            text = 'Commodity Channel Index crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        loopcount += 1
        sleep = 3600
        time.sleep(sleep)


@celery_app.task(name='mfi')
def mfi(name, price, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'
        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        mfi_last = stock.ta.mfi(close=stock['Close'], length=14)[count-2]
        mfi_before = stock.ta.mfi(close=stock['Close'], length=14)[count-3]
        Signal = "none"

        if price > mfi_last and price < mfi_before:
            Signal = "ตัดขึ้น"
            text = 'Money Flow Index crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif price < mfi_last and price > mfi_before:
            Signal = "ตัดลง"
            text = 'Money Flow Index crossing detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        loopcount += 1
        sleep = 3600
        time.sleep(sleep)


@celery_app.task(name='rsi')
def rsi(name, price, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'
        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        RSI_last = stock.ta.rsi(
            close=stock['Close'], length=14, append=True)[count-2]
        RSI_before = stock.ta.rsi(
            close=stock['Close'], length=14, append=True)[count-3]
        Signal = "none"

        if price > RSI_last and price < RSI_before:
            Signal = "good"
            text = 'Relative Strength Index crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif price < RSI_last and price > RSI_before:
            Signal = "good"
            text = 'Relative Strength Index crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        loopcount += 1
        sleep = 3600
        time.sleep(sleep)


@celery_app.task(name='sto')
def sto(name, price, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'
        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        stoch = stock.ta.stoch(close=stock['Close'], length=14)
        k_last = (stoch['STOCHk_14_3_3'])[count-2]
        k_before = (stoch['STOCHk_14_3_3'])[count-3]
        Signal = "none"

        if price > k_last and price < k_before:
            Signal = "good"
            text = 'Stochastic Oscillator crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        elif price < k_last and price > k_before:
            Signal = "good"
            text = 'Stochastic Oscillator crossing ' + \
                str(price) + ' detected from ' + name
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        loopcount += 1
        sleep = 3600
        time.sleep(sleep)


@celery_app.task(name='bollband')
def bollband(name, linetoken):
    loopcount = 0
    while True:
        if loopcount == 168:
            linenotify('Notification exceed limit date (7days)', linetoken)
            return 'exceed limit'

        stock = yf.download(tickers=name+'.BK', start=pd.to_datetime('2022-01-01'),
                            end=str(datetime.now().date()), interval='1h').reset_index()

        count = len(stock)
        last = stock['Close'][count-2]
        before = stock['Close'][count-3]
        bbands = stock.ta.bbands(close=stock['Close'], length=20, std=2)
        upper_last = (bbands['BBU_20_2.0'])[count-2]
        upper_before = (bbands['BBU_20_2.0'])[count-3]
        lower_last = (bbands['BBL_20_2.0'])[count-2]
        lower_before = (bbands['BBL_20_2.0'])[count-3]

        Signal = "none"

        if last > upper_last and before < upper_before:
            Signal = 'good'
            text = 'Upper Bollinger band crossing detected from ' + str(name)
            linenotify(text, linetoken)
            return Signal
        elif last < upper_last and before > upper_before:
            Signal = "good"
            text = 'Upper Bollinger band crossing detected from ' + str(name)
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        if last > lower_last and before < lower_before:
            text = 'Lower Bollinger band crossing detected from ' + str(name)
            linenotify(text, linetoken)
            return Signal
        elif last < lower_last and before > lower_before:
            Signal = "good"
            text = 'Lower Bollinger band crossing detected from ' + str(name)
            linenotify(text, linetoken)
            return Signal
        else:
            Signal = "bad"

        loopcount += 1
        sleep = 3600
        time.sleep(sleep)


@celery_app.task(name='test')
def test():
    count = 0
    while True:
        if count == 10:
            linenotify('test#10 finish testing',
                       "tdqgISkyFgDJHF3FSdnW13LbNBwOKiNkTidAlOSSoQ5")
            return 'Done'
        linenotify('test #'+str(count),
                   "tdqgISkyFgDJHF3FSdnW13LbNBwOKiNkTidAlOSSoQ5")
        sleep = 5
        count += 1
        time.sleep(sleep)


@app.route('/checktask')
def checktask():
    #current_app.tasks['macd'].delay('AAV', 'tdqgISkyFgDJHF3FSdnW13LbNBwOKiNkTidAlOSSoQ5')
    macd.delay('AAV', 'tdqgISkyFgDJHF3FSdnW13LbNBwOKiNkTidAlOSSoQ5')
    return 'Done'


@app.route('/findtask')
def findtask():
    result = celery_app.AsyncResult("1a671053-7d77-4bf9-af5e-3ab3db9ef6c1")

    result.revoke(terminate=True)
    return 'Done'


@app.route('/checkstatus')
def checkstatus():
    result = celery_app.AsyncResult("8294333e-6cdb-4357-ba7a-70aa7b40db34")
    print(celery_app.AsyncResult("8294333e-6cdb-4357-ba7a-70aa7b40db34").status)
    print(result.status)
    print(type(result.status))
    return result.status


def linenotify(text, linetoken):
    LINE_TOKEN = linetoken
    line_url = "https://notify-api.line.me/api/notify"
    LINE_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded',
                    "Authorization": "Bearer " + LINE_TOKEN}
    a = requests.post(line_url, headers=LINE_HEADERS, data={'message': text})
    print(a.text)


if __name__ == '__main__':
    app.run(host="localhost", port=5000, debug=True)
