import os
import time
from redis_om import get_redis_connection, HashModel
from dotenv import load_dotenv

load_dotenv()

# Dont forget to instantiate a new database for payment service
redis = get_redis_connection(
    host=os.environ.get("REDIS_HOST"),
    port=os.environ.get("REDIS_PORT"),
    password=os.environ.get("REDIS_PASSWORD"),
    username="default",
    decode_responses=True
)

# Create a model that will be converted into a table in Redis DB
class Order(HashModel):
    product_id: str
    price: float
    fee: float
    total: float
    quantity: int
    status: str # Pending, completed and refunded

    class Meta:
        database = redis

def order_completed(order: Order):
    time.sleep(5)
    order.status = 'completed'
    order.save()
    redis.xadd('order_completed', order.dict(), '*')