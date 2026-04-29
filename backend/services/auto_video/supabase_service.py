import os
import httpx
from typing import Optional

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}


async def list_vehicles(store_id: str) -> list[dict]:
    """Retorna lista de veículos ativos da loja com thumbnail."""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/vehicles",
            headers=HEADERS,
            params={
                "select": "id,brand,title,year,km,price,status",
                "store_id": f"eq.{store_id}",
                "status": "eq.available",
                "order": "created_at.desc",
                "limit": "50",
            },
        )
        res.raise_for_status()
        veiculos = res.json()

    # Busca primeira foto de cada veículo
    for v in veiculos:
        fotos = await _get_fotos(v["id"], limit=1)
        v["thumbnail"] = fotos[0] if fotos else None

    return veiculos


async def get_vehicle_with_photos(vehicle_id: str, store_id: str) -> Optional[dict]:
    """Retorna dados completos do veículo da loja + URLs das fotos do storage."""
    async with httpx.AsyncClient() as client:
        # Dados do veículo
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/vehicles",
            headers=HEADERS,
            params={
                "id": f"eq.{vehicle_id}",
                "store_id": f"eq.{store_id}",
                "select": "*",
                "limit": "1",
            },
        )
        res.raise_for_status()
        data = res.json()

    if not data:
        return None

    vehicle = data[0]
    vehicle["fotos"] = await _get_fotos(vehicle_id, limit=8)
    return vehicle


async def _get_fotos(vehicle_id: str, limit: int = 8) -> list[str]:
    """
    Busca URLs das fotos do veículo.
    """
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/vehicle_media",
            headers=HEADERS,
            params={
                "vehicle_id": f"eq.{vehicle_id}",
                "select": "url,order",
                "order": "order.asc",
                "limit": str(limit),
            },
        )
        res.raise_for_status()
        media_list = res.json()

    # Retorna URLs diretas conforme schema
    return [item["url"] for item in media_list]
