def public_route(f):
    f._is_public = True
    return f