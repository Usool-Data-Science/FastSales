from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from inventory.utils import Product, format_product

app = FastAPI(
    title="FastSales Inventory API",
    description="Backend service for managing FastSales products",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
def root() -> Dict[str, bool]:
    """
    Health check endpoint.

    Returns:
        dict: API health status
    """
    return {"health": True}


@app.get("/products", tags=["Products"])
def get_all_products() -> List[Dict[str, Any]]:
    """
    Retrieve all products.

    Returns:
        List of products formatted for frontend consumption.

    Product shape:
    {
        "id": str,
        "name": str,
        "price": float,
        "quantity": int
    }
    """
    return [format_product(pk) for pk in Product.all_pks()]


@app.get("/products/{product_id}", tags=["Products"])
def get_single_product(product_id: str) -> Dict[str, Any]:
    """
    Retrieve a single product by ID.

    Args:
        product_id (str): Product identifier

    Returns:
        Product object formatted for frontend use
    """
    product = Product.get(product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return format_product(product_id)


@app.post("/products", tags=["Products"])
def create_product(product: Product) -> Dict[str, Any]:
    """
    Create a new product.

    Request body:
    {
        "name": str,
        "price": float,
        "quantity": int
    }

    Returns:
        Created product formatted for frontend use
    """
    product_id = product.save()
    return format_product(product_id)


@app.delete("/products/{product_id}", tags=["Products"])
def delete_product(product_id: str) -> Dict[str, str]:
    """
    Delete a product by ID.

    Args:
        product_id (str): Product identifier

    Returns:
        Confirmation message.
        (Frontend only relies on HTTP 200 + product_id it already has)
    """
    success = Product.delete(product_id)

    if not success:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"deleted": product_id}
