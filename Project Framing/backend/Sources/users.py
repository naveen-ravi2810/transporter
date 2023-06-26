from Models.tables import cursor, conn
import bcrypt
from flask_restful import Resource
from flask import jsonify, request

class Login(Resource):
    def get(self):
        return "Hi"
    
    def post(self):
        data = request.get_json()
        number = int(data['number'])
        password = data['password']
        cursor.execute('select * from users where phone = %s',int(number))
        user = cursor.fetchone()
        if user is not None:
            if (bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8'))):
                return jsonify({'status' : True, 'role':user['role'] })
            return jsonify({'status' : False, 'message':'Incorrect Password'}) 
        return jsonify({"status":False, 'message':'Incorrect Email'})
    

class Register(Resource):
    def post(self):
        data = request.get_json()
        name = data['name']
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        phone = data['phone']
        role = data['role']
        additional_data = data['additional_data']
        sql = "insert into users (name, password, phone, role, additional_data) values (%s, %s, %s, %s, %s)"
        query = (name, hashed_pw, phone, role, additional_data)
        cursor.execute(sql, query)
        conn.commit()
        return jsonify({'status':True})
        # To make New admin alter here
        # cursor.execute('''insert into users (name, password, phone, role, status, data) values ("naveen", %s, 8903711436, "admin", "true", '{"role":"No need to data"}')''',(hashed_pw))
        # conn.commit()