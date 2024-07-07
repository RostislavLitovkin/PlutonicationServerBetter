from hashlib import blake2b

def auth(password):
    hashed_value = blake2b(password.encode("utf-8"))
    return "571787bcd1c4b74015672f3feed1c84bf0bb1c8a99b9be2441aeffb2991cefe3cbb624a0821a75a50cf674e5e90c431e5084b776507787cf85b2ab47649ab040" == hashed_value.hexdigest()