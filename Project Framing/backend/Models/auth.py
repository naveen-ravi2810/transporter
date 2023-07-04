from functools import wraps
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