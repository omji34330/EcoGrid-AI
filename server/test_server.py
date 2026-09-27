import sys
sys.stdout.reconfigure(encoding='utf-8')

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["project"] == "EcoGrid AI"
    print("[PASS] test_root passed:", data["project"])

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "Kanpur" in data["site"]
    print("[PASS] test_health passed:", data["status"], data["site"])

def test_chat_domain_fallback():
    # Test chat endpoint with domain query
    res = client.post("/api/chat", json={"message": "How is solar calculated?"})
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert len(data["reply"]) > 20
    print("[PASS] test_chat passed. Source:", data.get("source"))

def test_chat_empty_validation():
    res = client.post("/api/chat", json={"message": "   "})
    assert res.status_code == 400
    print("[PASS] test_chat_empty_validation passed (rejected empty prompt)")

def test_explain_prediction():
    payload = {
        "solar_kwh": 24.5,
        "wind_kwh": 12.0,
        "cloud_cover_pct": 25.0,
        "wind_speed_kmh": 16.5,
        "temperature_c": 28.5,
        "battery_soc_pct": 74.0,
        "co2_avoided_kg": 29.9,
    }
    res = client.post("/api/predict/explain", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "summary" in data
    assert len(data["insights"]) > 0
    print("[PASS] test_explain_prediction passed. Summary:", data["summary"])

if __name__ == "__main__":
    test_root()
    test_health()
    test_chat_domain_fallback()
    test_chat_empty_validation()
    test_explain_prediction()
    print("\nALL BACKEND TESTS PASSED CLEANLY!")
