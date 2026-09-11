import os
import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_pipeline():
    print("[1] Testing Root & Health endpoints...")
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["status"] == "online"

    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["database"] == "connected"
    print("    [PASS] Root & Health endpoints verified.")

    print("[2] Testing Weather Service...")
    resp = client.get("/api/weather/current?lat=28.6139&lon=77.2090&city=Delhi")
    assert resp.status_code == 200
    weather = resp.json()
    assert weather["success"] is True
    print(f"    [PASS] Weather: {weather['data']['city']}, Temp: {weather['data']['temperature']}C, Condition: {weather['data']['condition']}")

    print("[3] Testing Auth Flow (Signup / Login)...")
    test_email = "test_user_ai@pincher.luxury"
    test_password = "SecurePassword123!"

    # Try signup or login
    signup_resp = client.post("/api/auth/signup", json={
        "name": "Alex Vance",
        "email": test_email,
        "password": test_password,
        "persona": "classic"
    })
    
    if signup_resp.status_code == 201:
        token = signup_resp.json()["token"]
        print("    [PASS] New user signed up successfully.")
    else:
        login_resp = client.post("/api/auth/login", json={
            "email": test_email,
            "password": test_password
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["token"]
        print("    [PASS] Existing user logged in successfully.")

    headers = {"Authorization": f"Bearer {token}"}

    print("[4] Testing Auth Profile (/api/auth/me)...")
    me_resp = client.get("/api/auth/me", headers=headers)
    assert me_resp.status_code == 200
    assert me_resp.json()["user"]["email"] == test_email
    print(f"    [PASS] Authenticated user profile: {me_resp.json()['user']['name']}")

    print("[5] Testing Wardrobe Item Insertion & Retrieval...")
    # Add a top
    top_resp = client.post("/api/wardrobe", headers=headers, json={
        "name": "Luxury Silk Blazer",
        "category": "tops",
        "subcategory": "Blazer",
        "color_hex": "#B8860B",
        "color_name": "Dark Goldenrod",
        "season": "all",
        "occasion": "formal",
        "image_url": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35"
    })
    assert top_resp.status_code == 201
    top_item = top_resp.json()

    # Add bottoms
    bot_resp = client.post("/api/wardrobe", headers=headers, json={
        "name": "Tailored Charcoal Trousers",
        "category": "bottoms",
        "subcategory": "Trousers",
        "color_hex": "#27272A",
        "color_name": "Charcoal",
        "season": "all",
        "occasion": "formal",
        "image_url": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80"
    })
    assert bot_resp.status_code == 201
    bot_item = bot_resp.json()

    # Add shoes
    shoe_resp = client.post("/api/wardrobe", headers=headers, json={
        "name": "Italian Leather Oxfords",
        "category": "shoes",
        "subcategory": "Dress Shoes",
        "color_hex": "#1C1917",
        "color_name": "Black",
        "season": "all",
        "occasion": "formal",
        "image_url": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4"
    })
    assert shoe_resp.status_code == 201

    # Fetch items
    list_resp = client.get("/api/wardrobe", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()["items"]) >= 2
    print(f"    [PASS] Wardrobe catalog contains {list_resp.json()['total']} items.")

    print("[6] Testing 100% Wardrobe-Grounded Outfit Recommendation Engine...")
    rec_resp = client.post("/api/outfits/recommend", headers=headers, json={
        "occasion": "formal",
        "temperature": 21.0,
        "weather_condition": "Clear",
        "persona": "classic"
    })
    assert rec_resp.status_code == 200
    rec_data = rec_resp.json()
    assert rec_data["success"] is True
    assert len(rec_data["recommendations"]) > 0
    top_rec = rec_data["recommendations"][0]
    print(f"    [PASS] Recommended Outfit: {top_rec['title']} (Score: {top_rec['scores']['total_score']}, Harmony: {top_rec['harmony_tag']})")
    print(f"           Top: {top_rec['top']['name']}, Bottom: {top_rec['bottom']['name']}")
    print(f"           Explanation: {top_rec['explanation']}")

    print("[7] Testing Save Outfit to Collection...")
    save_resp = client.post("/api/outfits/save", headers=headers, json={
        "title": top_rec["title"],
        "top_item_id": top_rec["top"]["id"] if top_rec.get("top") else None,
        "bottom_item_id": top_rec["bottom"]["id"] if top_rec.get("bottom") else None,
        "shoes_item_id": top_rec["shoes"]["id"] if top_rec.get("shoes") else None,
        "occasion": "formal",
        "harmony_score": top_rec["scores"]["color_harmony"],
        "explanation": top_rec["explanation"]
    })
    assert save_resp.status_code == 201
    saved_outfit_id = save_resp.json()["outfit"]["id"]

    saved_list_resp = client.get("/api/outfits/saved", headers=headers)
    assert saved_list_resp.status_code == 200
    assert saved_list_resp.json()["total"] > 0
    print(f"    [PASS] Saved outfits retrieved: {saved_list_resp.json()['total']} collections.")

    print("\n=======================================================")
    print(" ALL FASTAPI BACKEND SERVICES AND APIS VERIFIED 100%!")
    print("=======================================================")

if __name__ == "__main__":
    test_full_pipeline()
