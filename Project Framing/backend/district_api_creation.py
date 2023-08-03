import bcrypt
import pymysql

password = "madhu"
hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
print(hashed_pw)
conn = pymysql.connect(host = 'database-2.cwaohnk7rqfh.us-east-1.rds.amazonaws.com',
                        user = 'admin',
                        password = 'TheNewPasswordfordatabaseofprintmajesty',
                        database= 'PrintMajesty',
                        cursorclass=pymysql.cursors.DictCursor
                        )
cursor = conn.cursor()

# cursor.execute("delete from users where name='admin'")
cursor.execute("insert into users (name, email, password, role) values ('madhumohan', 'madhumohanmadhumohan3@gmail.com', %s, 'admin')",(hashed_pw))
conn.commit()