import pymysql
import os 
from dotenv import load_dotenv
load_dotenv()

try:
    conn = pymysql.connect(host = os.getenv('sqlhost'),
                        user = os.getenv('sqluser'),
                        password = os.getenv('sqlpassword'),
                        database= 'transporter',
                        cursorclass=pymysql.cursors.DictCursor
                        )
    cursor = conn.cursor()
except:
    print( "Error in db",Exception)

