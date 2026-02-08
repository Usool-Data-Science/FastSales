import os
from typing import List, Dict, Any

import requests
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from starlette.requests import Request
from dotenv import load_dotenv

from payment.utils import Order, order_completed

load_dotenv()
INVENTORY_SERVICE_URL = os.environ.get("INVENTORY_SERVICE_URL")

app = FastAPI(
    title="FastSales Payment Service",
    description="Service responsible for order creation and lifecycle",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def root() -> Dict[str, str]:
    """
    Health check endpoint.
    """
    return {"message": "Payment service is running"}


@app.get("/orders", tags=["Orders"])
def get_all_orders() -> List[Dict[str, Any]]:
    """
    Retrieve all orders.

    Returns:
        List of orders formatted for frontend consumption.

    Order shape:
    {
        "id": str,
        "product_id": str,
        "price": float,
        "fee": float,
        "total": float,
        "quantity": int,
        "status": str
    }
    """
    return [order.to_dict() for order in Order.all()]


@app.get("/orders/{order_id}", tags=["Orders"])
def get_single_order(order_id: str) -> Dict[str, Any]:
    """
    Retrieve a single order by ID.

    Args:
        order_id (str): Order identifier

    Returns:
        Order object formatted for frontend use
    """
    order = Order.get(order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order.to_dict()


@app.post("/orders", tags=["Orders"])
async def create_order(
    request: Request,
    background_tasks: BackgroundTasks
) -> Dict[str, Any]:
    """
    Create a new order.

    Request body:
    {
        "product_id": str,
        "quantity": int
    }

    Workflow:
    1. Fetch product details from Inventory Service
    2. Calculate price, fee, and total
    3. Persist order
    4. Trigger background completion task

    Returns:
        Created order formatted for frontend use
    """
    body = await request.json()

    product_id = body.get("product_id")
    quantity = body.get("quantity", 1)

    if not product_id or quantity <= 0:
        raise HTTPException(status_code=400, detail="Invalid order payload")

    # Fetch product from inventory service
    response = requests.get(
        f"{INVENTORY_SERVICE_URL}/products/{product_id}"
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=404,
            detail="Product not found in inventory service"
        )

    product = response.json()

    price = product["price"]
    fee = round(0.2 * price, 2)
    total = round((price + fee) * quantity, 2)

    order = Order(
        product_id=product_id,
        price=price,
        fee=fee,
        total=total,
        quantity=quantity,
        status="Pending",
    )

    order_id = order.save()

    background_tasks.add_task(order_completed, order)

    return order.to_dict()
