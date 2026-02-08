import os
from redis_om import get_redis_connection, HashModel
from dotenv import load_dotenv

load_dotenv()


redis = get_redis_connection(
    host=os.environ.get("REDIS_HOST"),
    port=os.environ.get("REDIS_PORT"),
    password=os.environ.get("REDIS_PASSWORD"),
    username="default",
    decode_responses=True
)

# Create a model that will be converted into a table in Redis DB
class Product(HashModel):
    name: str
    price: float
    quantity: int

    class Meta:
        database = redis

def format_product(pk: str):
    product = Product.get(pk)

    return {
        "id": product.pk,
        "name": product.name,
        "price": product.price,
        "quantity": product.quantity,
    }