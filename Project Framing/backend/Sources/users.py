from Models.tables import cursor, conn
import bcrypt
from flask_restful import Resource
from flask import jsonify, request
from datetime import datetime
from Models.auth import admin_required
from flask_jwt_extended import create_access_token

class Login(Resource):
    # def get(self):
    #     return "Hi"
    
    def post(self):
        data = request.get_json()
        number = int(data['number'])
        password = data['password']
        cursor.execute('select * from users where phone = %s',int(number))
        user = cursor.fetchone()
        if user is not None:
            if (bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8'))):
                if(user['status']==1):
                    access_token = create_access_token(identity = user['id'], additional_claims = {
                        'name' : user['name'],
                        'role' : user['role'],
                        'status' : user['status']
                    })
                    return jsonify({'status' : True, 'role':user['role'], 'access_token':access_token })
                else:
                    return jsonify({'status' : False, 'message':'You are not Approved yet'})
            return jsonify({'status' : False, 'message':'Incorrect Password'}) 
        return jsonify({"status":False, 'message':'Incorrect Number'})
    

class Register(Resource):
    def post(self):
        data = request.get_json()
        name = data['name']
        hashed_pw = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        phone = data['phone']
        role = data['role']
        sql = "insert into users (name, password, phone, role, status) values (%s, %s, %s, %s, 0)"
        query = (name, hashed_pw, phone, role)
        cursor.execute(sql, query)
        conn.commit()
        return jsonify({'status':True})
        # To make New admin alter here
        # password = 'subash'
        # hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        # cursor.execute('''insert into users (name, password, phone, role, status) values ("subash", %s, 9994665347, "admin", 1)''',(hashed_pw))
        # conn.commit()
    
class Users(Resource):
    @admin_required()
    def get(self, usertype):
        if usertype == 'approved':
            status = 1
        elif usertype == 'notapproved':
            status = 0
        else:
            status = -1
        cursor.execute('select * from users where status = %s and role != "admin"', status )
        # cursor.execute('select * from users where status = %s', status )
        users = cursor.fetchall()
        return {'status':True, 'users':users}
    
class ApproveUser(Resource):

    # def get(self, userid, usertype):
    #     return jsonify({'text':str(userid)+usertype})
    
    @admin_required()
    def post(self, userid, usertype):
        data = request.get_json()
        name = data['username']
        phone = data['phone']
        address = data['address']
        pincode = data['pincode']
        print(int(userid))
        cursor.execute('''update users set status = 1 where id = %s''', int(userid))
        conn.commit()
        if usertype == 'farmer':
            landarea = data['landarea']
            cursor.execute('''insert into farmers (id, name, phone, landarea, address, pincode) values 
            (%s, %s, %s, %s, %s, %s)''',(userid, name, phone, landarea, address, pincode))
            conn.commit()
            return jsonify({'status':True})
        elif usertype == 'transporter':
            vehicle_number = data['vehicle_number']
            vehicle_name = data['vehicle_name']
            license_number = data['license_number']
            cursor.execute('''insert into transporters (id, name, phone, vehicle_number, vehicle_name, 
            license_number, address, pincode ) values (%s, %s, %s, %s, %s, %s, %s, %s )''',(userid, 
            name, phone, vehicle_number, vehicle_name, license_number, address, pincode))
            conn.commit()
            return jsonify({'status':True})
        else :
            warehouse_type = data['warehouse_type']
            warehouse_global_id = data['warehouse_id']
            cursor.execute('''insert into warehouse (id, name, phone, warehouse_type, warehouse_global_id, 
            address ,pincode) values (%s, %s, %s, %s, %s, %s, %s)''',(userid, name, phone, warehouse_type, 
            warehouse_global_id, address, pincode))
            conn.commit()
            return jsonify({'status':True})