from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import socket

from config import Config

from Sources.users import Login, Register, Users, ApproveUser, Profile

from Sources.warehouse import Warehouse

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
jwt = JWTManager(app)
api = Api(app)

api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
api.add_resource(Users, '/user/<usertype>')
api.add_resource(ApproveUser, '/approveuser/<userid>/<usertype>')
api.add_resource(Profile, '/profile')

api.add_resource(Warehouse, '/get_warehouse/<string:district>')

from Sources.orders import OrdersforFarmer,TransporterAcceptanceResource
api.add_resource(OrdersforFarmer, '/placeorder')
api.add_resource(TransporterAcceptanceResource, '/transport_view')

def get_ipv4_address():
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    return ip_address

if __name__=="__main__":
    app.run(debug=True ,host=get_ipv4_address(), port=5000)