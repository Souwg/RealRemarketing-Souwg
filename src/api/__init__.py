# src/api/utils.py

class APIException(Exception):
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.status_code = status_code


def generate_sitemap():
    # Implementación del sitemap
    pass
