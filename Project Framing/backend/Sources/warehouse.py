from Models.tables import cursor, conn
from flask_restful import Resource
from flask import jsonify, request


class Warehouse(Resource):
    def get(self, district):
        cursor.execute('select * from warehouse where district = %s',(district))
        warehouses = cursor.fetchall()
        return jsonify({'warehouses':warehouses})