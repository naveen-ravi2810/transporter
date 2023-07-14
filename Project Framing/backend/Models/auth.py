from functools import wraps
from flask import jsonify,request
from flask_jwt_extended import verify_jwt_in_request, get_jwt

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["role"] == 'admin' :
                return fn(*args, **kwargs)
            else:
                return {'msg':"Admins only!"},401
        return decorator
    return wrapper

def farmer_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["role"] == 'farmer' :
                return fn(*args, **kwargs)
            else:
                return {'msg':"farmers only!"},401
        return decorator
    return wrapper

def transporter_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["role"] == 'transporter' :
                return fn(*args, **kwargs)
            else:
                return {'msg':"transporters only!"},401
        return decorator
    return wrapper

def warehouse_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims["role"] == 'warehouse' :
                return fn(*args, **kwargs)
            else:
                return {'msg':"warehouse only!"},401
        return decorator
    return wrapper