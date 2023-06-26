from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config

from Sources.users import Login, Register

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
jwt = JWTManager(app)
api = Api(app)

api.add_resource(Login, '/login')
api.add_resource(Register, '/register')

if __name__=="__main__":
    app.run(debug=True, host='192.168.1.100')