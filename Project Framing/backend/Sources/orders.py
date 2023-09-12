from flask import Flask, jsonify, request
from flask_restful import Resource
from Models.auth import farmer_required,get_jwt, transporter_required
from Models.tables import conn,cursor

import datetime
import pytz

kolkata_tz = pytz.timezone('Asia/Kolkata')
current_time_kolkata = datetime.datetime.now(kolkata_tz)

class OrdersforFarmer(Resource):
    @farmer_required()
    def get(self):
        claims = get_jwt()
        farmer_id = claims['sub']
        cursor.execute('''select f.name, f.id, f.address, 
                       w.id, w.name as warehouse_name, w.warehouse_type, w.warehouse_global_id, w.address, 
                       o.order_no, o.product, o.quantity, o.order_on from productorders o
                       INNER JOIN farmers f ON o.farmer_id = f.id
                       INNER JOIN warehouse w ON o.warehouse_id = w.id
                       where o.farmer_id = %s and o.transporter_id = 0 ''', (farmer_id))
                    #    t.id, t.name, t.vehicle_number, 
                    #    INNER JOIN transporters t ON o.transport_id = t.id
        unconfirmed_orders = cursor.fetchall()
        cursor.execute('''select f.name, f.id, f.address, 
                       w.id, w.name as warehouse_name, w.warehouse_type, w.warehouse_global_id, w.address, 
                       t.id, t.name, t.vehicle_number, 
                       o.order_no, o.product, o.quantity, o.order_on, o.accepted_on, o.pickup_on, o.deliver_on from productorders o
                       INNER JOIN farmers f ON o.farmer_id = f.id
                       INNER JOIN warehouse w ON o.warehouse_id = w.id
                       INNER JOIN transporters t ON o.transporter_id = t.id
                       where o.farmer_id = %s ''', (farmer_id))
        confirmed_orders = cursor.fetchall()
        # print(unconfirmed_orders)
        return jsonify({'status':True, 'unconfirmed_orders':unconfirmed_orders, 'confirmed_orders':confirmed_orders})
    
    @farmer_required()
    def post(self):
        data = request.get_json()
        claims = get_jwt()
        farmer_id = claims['sub']
        warehouse_id = data['warehouse_id']
        product = data['product']
        quantity = data['quantity']
        # print(farmer_id, warehouse_id, product, quantity, current_time_kolkata)
        cursor.execute('''insert into productorders (farmer_id, warehouse_id , product, quantity, order_on) 
                        values (%s,%s,%s,%s,%s)''',(farmer_id, warehouse_id, product, quantity, current_time_kolkata))
        conn.commit()
        return jsonify({'status':True})
    

class TransporterAcceptanceResource(Resource):
    @transporter_required()
    def get(self):
        claims = get_jwt()
        transporter_id = claims['sub']
        cursor.execute('''select district from transporters where id = %s''', int(transporter_id))
        district = cursor.fetchone()
        # print(district['district'])
        cursor.execute(''' select * from productorders o
                       INNER JOIN farmers f ON o.farmer_id = f.id
                       INNER JOIN warehouse w ON o.warehouse_id = w.id 
                       where w.district = %s''', district['district'])
        available_orders = cursor.fetchall()
        # print(available_orders)
        # print(available_orders)
        return jsonify({'status':True, 'available_orders' : available_orders})