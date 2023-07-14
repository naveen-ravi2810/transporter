from Models.tables import cursor, conn
from flask_restful import Resource
from flask import jsonify, request


class Warehouse(Resource):
    def get(self, id):
        cursor.execute('select * from warehouse where id = %s',(id))
        warehouses = cursor.fetchall()
        return jsonify({'warehouses':id})