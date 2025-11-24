"""
Battery Digital Twin REST API
Production-ready API for battery health predictions.
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from hybrid_digital_twin import HybridDigitalTwin
import numpy as np
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Battery Digital Twin API",
    description="AI-powered battery health prediction and lifecycle management",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model at startup
model = None
model_info = {}

@app.on_event("startup")
async def load_model():
    global model, model_info
    try:
        model_path = Path("models/improved_model.pkl")
        if model_path.exists():
            model = HybridDigitalTwin.load_model(str(model_path))
            model_info = {
                "name": "Improved Hybrid Model",
                "path": str(model_path),
                "loaded_at": datetime.now().isoformat()
            }
        else:
            model = HybridDigitalTwin.load_model("models/hybrid_twin_model.pkl")
            model_info = {
                "name": "Original Hybrid Model",
                "path": "models/hybrid_twin_model.pkl",
                "loaded_at": datetime.now().isoformat()
            }
        logger.info(f"Model loaded successfully: {model_info['name']}")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise

# Request/Response Models
class PredictionRequest(BaseModel):
    cycles: List[int] = Field(..., description="List of cycle numbers to predict", min_items=1)
    temperature: float = Field(..., description="Operating temperature in Celsius", ge=10, le=50)
    charge_time: float = Field(..., description="Charge time in seconds", gt=0)
    initial_capacity: float = Field(..., description="Initial battery capacity in Ah", gt=0)
    
    @validator('cycles')
    def validate_cycles(cls, v):
        if any(c <= 0 for c in v):
            raise ValueError("All cycle numbers must be positive")
        if len(v) > 10000:
            raise ValueError("Maximum 10,000 cycles per request")
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "cycles": [100, 200, 300, 400, 500],
                "temperature": 25.0,
                "charge_time": 3600.0,
                "initial_capacity": 2.0
            }
        }

class PredictionResponse(BaseModel):
    cycles: List[int]
    physics_predictions: List[float]
    hybrid_predictions: List[float]
    ml_corrections: List[float]
    capacity_retention: List[float]
    end_of_life_cycle: Optional[int]
    metadata: Dict
    
    class Config:
        schema_extra = {
            "example": {
                "cycles": [100, 200, 300],
                "physics_predictions": [1.95, 1.90, 1.85],
                "hybrid_predictions": [1.96, 1.91, 1.86],
                "ml_corrections": [0.01, 0.01, 0.01],
                "capacity_retention": [98.0, 95.5, 93.0],
                "end_of_life_cycle": 850,
                "metadata": {
                    "model": "Improved Hybrid Model",
                    "timestamp": "2024-11-24T20:30:00"
                }
            }
        }

class HealthStatus(BaseModel):
    status: str
    model_loaded: bool
    model_info: Dict
    uptime: str

class BatchPredictionRequest(BaseModel):
    scenarios: List[PredictionRequest] = Field(..., max_items=10)
    
    class Config:
        schema_extra = {
            "example": {
                "scenarios": [
                    {
                        "cycles": [100, 200, 300],
                        "temperature": 25.0,
                        "charge_time": 3600.0,
                        "initial_capacity": 2.0
                    },
                    {
                        "cycles": [100, 200, 300],
                        "temperature": 35.0,
                        "charge_time": 3600.0,
                        "initial_capacity": 2.0
                    }
                ]
            }
        }

# API Endpoints
@app.get("/", tags=["General"])
def root():
    """Root endpoint with API information"""
    return {
        "message": "Battery Digital Twin API",
        "version": "1.0.0",
        "status": "running",
        "documentation": "/docs",
        "health_check": "/health"
    }

@app.get("/health", response_model=HealthStatus, tags=["General"])
def health_check():
    """Health check endpoint for monitoring"""
    return HealthStatus(
        status="healthy" if model is not None else "unhealthy",
        model_loaded=model is not None and model.is_trained,
        model_info=model_info,
        uptime="running"
    )

@app.post("/predict", response_model=PredictionResponse, tags=["Predictions"])
async def predict(request: PredictionRequest):
    """
    Predict battery capacity for specified cycles
    
    Returns physics-based predictions, ML corrections, and hybrid predictions
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Generate predictions
        result = model.predict_future(
            cycles=np.array(request.cycles),
            temperature=request.temperature,
            charge_time=request.charge_time,
            initial_capacity=request.initial_capacity
        )
        
        # Calculate capacity retention
        capacity_retention = (result.hybrid_prediction / request.initial_capacity * 100).tolist()
        
        # Find end-of-life cycle (80% capacity)
        eol_threshold = request.initial_capacity * 0.8
        eol_idx = np.where(result.hybrid_prediction < eol_threshold)[0]
        eol_cycle = int(request.cycles[eol_idx[0]]) if len(eol_idx) > 0 else None
        
        return PredictionResponse(
            cycles=request.cycles,
            physics_predictions=result.physics_prediction.tolist(),
            hybrid_predictions=result.hybrid_prediction.tolist(),
            ml_corrections=result.ml_correction.tolist(),
            capacity_retention=capacity_retention,
            end_of_life_cycle=eol_cycle,
            metadata={
                "model": model_info.get("name", "Unknown"),
                "timestamp": datetime.now().isoformat(),
                "temperature": request.temperature,
                "charge_time": request.charge_time,
                "initial_capacity": request.initial_capacity
            }
        )
    
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/batch", tags=["Predictions"])
async def batch_predict(request: BatchPredictionRequest):
    """
    Predict battery capacity for multiple scenarios
    
    Useful for comparing different operating conditions
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    results = []
    
    for idx, scenario in enumerate(request.scenarios):
        try:
            result = await predict(scenario)
            results.append({
                "scenario_id": idx,
                "success": True,
                "data": result
            })
        except Exception as e:
            results.append({
                "scenario_id": idx,
                "success": False,
                "error": str(e)
            })
    
    return {
        "total_scenarios": len(request.scenarios),
        "successful": sum(1 for r in results if r["success"]),
        "failed": sum(1 for r in results if not r["success"]),
        "results": results
    }

@app.get("/predict/eol", tags=["Predictions"])
async def predict_end_of_life(
    temperature: float = Field(..., ge=10, le=50),
    charge_time: float = Field(..., gt=0),
    initial_capacity: float = Field(..., gt=0),
    max_cycles: int = Field(2000, ge=100, le=5000)
):
    """
    Predict end-of-life cycle for given operating conditions
    
    Returns the cycle number when battery reaches 80% capacity
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        cycles = np.arange(1, max_cycles + 1)
        
        result = model.predict_future(
            cycles=cycles,
            temperature=temperature,
            charge_time=charge_time,
            initial_capacity=initial_capacity
        )
        
        # Find EOL
        eol_threshold = initial_capacity * 0.8
        eol_idx = np.where(result.hybrid_prediction < eol_threshold)[0]
        
        if len(eol_idx) > 0:
            eol_cycle = int(cycles[eol_idx[0]])
            eol_capacity = float(result.hybrid_prediction[eol_idx[0]])
            
            return {
                "end_of_life_cycle": eol_cycle,
                "end_of_life_capacity": eol_capacity,
                "capacity_threshold": eol_threshold,
                "operating_conditions": {
                    "temperature": temperature,
                    "charge_time": charge_time,
                    "initial_capacity": initial_capacity
                },
                "recommendation": "Battery will reach end-of-life" if eol_cycle < 1000 else "Battery has good lifespan"
            }
        else:
            return {
                "end_of_life_cycle": None,
                "message": f"Battery will not reach EOL within {max_cycles} cycles",
                "final_capacity": float(result.hybrid_prediction[-1]),
                "capacity_retention": float(result.hybrid_prediction[-1] / initial_capacity * 100)
            }
    
    except Exception as e:
        logger.error(f"EOL prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"EOL prediction failed: {str(e)}")

@app.get("/model/info", tags=["Model"])
def model_information():
    """Get information about the loaded model"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_info": model_info,
        "is_trained": model.is_trained,
        "training_history": model.training_history if hasattr(model, 'training_history') else {}
    }

# Run with: uvicorn api:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
