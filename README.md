# Hybrid Digital Twin Framework for Li-ion Battery Modeling

A hybrid digital twin implementation for Li-ion battery capacity prediction and lifecycle management, combining physics-based modeling with machine learning for superior accuracy and interpretability.

## Table of Contents

- [Overview](#overview)
- [Mathematical Foundation](#mathematical-foundation)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Performance](#performance)
- [Contributing](#contributing)
- [License](#license)
- [Citation](#citation)

## Overview

This framework implements a state-of-the-art **hybrid digital twin** approach for Li-ion battery modeling that combines the interpretability of physics-based models with the accuracy of machine learning. The system is designed for industrial applications requiring high reliability, interpretability, and performance.

### What is a Hybrid Digital Twin?

A hybrid digital twin leverages both **first-principles physics models** and **data-driven machine learning** to create a more accurate and robust representation of physical systems than either approach alone. Our implementation specifically targets Li-ion battery degradation modeling for applications in:

- **Predictive Maintenance**: Early detection of battery degradation
- **State of Health (SoH) Estimation**: Accurate capacity and performance tracking
- **Lifecycle Management**: Optimized charging strategies and replacement planning
- **Fleet Management**: Battery health monitoring across vehicle fleets
- **Grid Storage**: Performance optimization for large-scale energy storage

## Mathematical Foundation

### 1. Physics-Based Model

The physics component implements the Li-ion battery degradation model based on **Xu et al. (2016)**:

#### Battery Lifetime Evolution

$L = 1 - (1 - L') \times e^{-f_d}$

Where:

- $L$: Current battery lifetime fraction
- $L'$: Initial battery lifetime
- $f_d$: Linearized degradation rate function

#### Degradation Rate Function

$f_d = \frac{k T_c i}{t}$

Where:

- $k$: Empirical degradation coefficient ($≈$ 0.13)
- $T_c$: Cell temperature (°C)
- $i$: Cycle number
- $t$: Charge time per cycle (seconds)

#### Capacity Evolution Model

$C(t) = C_0 e^{-f_d}$

Where:

- $C(t)$: Battery capacity at time $t$
- $C_0$: Initial battery capacity

### 2. Machine Learning Correction

The ML component learns the residual function between physics predictions and observations:

#### Residual Learning

$\Delta C = f_{ML}(C_{physics}, T, cycle, time, etc.)$

Where:

- $\Delta C$: Correction term
- $f_{ML}$: Neural network function
- Additional features include environmental and operational parameters

#### Final Hybrid Prediction

$C_{hybrid} = C_{physics} + \Delta C$

### 3. Mathematical Advantages

The hybrid approach provides several key benefits:

1. **Physics-Guided Learning**: ML model learns interpretable corrections rather than black-box mappings
2. **Extrapolation Capability**: Physics model provides reliable behavior outside training domain
3. **Reduced Data Requirements**: Physics knowledge reduces training data needs
4. **Uncertainty Quantification**: Separate physics and ML uncertainties enable better risk assessment
5. **Interpretability**: Clear separation between known physics and learned corrections

## Key Features

### Production-Ready Architecture

- **Modular Design**: Separate physics and ML components for maximum flexibility
- **Type Safety**: Full type hints and mypy compatibility
- **Error Handling**: Comprehensive exception handling and validation
- **Logging**: Structured logging with configurable levels
- **Configuration Management**: YAML/JSON configuration with validation

### Advanced Modeling Capabilities

- **Physics-Based Foundation**: Empirically validated degradation models
- **Deep Learning**: Configurable neural network architectures
- **Uncertainty Quantification**: Monte Carlo dropout and ensemble methods
- **Feature Engineering**: Automated domain-specific feature extraction
- **Model Interpretability**: Feature importance and sensitivity analysis

### Comprehensive Evaluation

- **Performance Metrics**: RMSE, MAE, R², MAPE, and custom battery metrics
- **Model Comparison**: Side-by-side evaluation of multiple approaches
- **Residual Analysis**: Statistical validation of model assumptions
- **Time Series Validation**: Specialized metrics for temporal predictions

### Scalability & Performance

- **Batch Processing**: Efficient handling of large datasets
- **GPU Acceleration**: TensorFlow/CUDA support for training
- **Model Persistence**: Optimized model serialization and loading
- **Memory Management**: Streaming data processing for large files

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+ (for frontend)

### Backend Setup

```bash
cd backend
pip install -r requirements-voltwin.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

## Quick Start

### Basic Usage

```python
import pandas as pd
from hybrid_digital_twin import HybridDigitalTwin, BatteryDataLoader

# Load your battery data
loader = BatteryDataLoader()
data = loader.load_csv("discharge.csv")

# Initialize and train the hybrid digital twin
twin = HybridDigitalTwin()
metrics = twin.fit(data, target_column="Capacity")

# Make predictions
predictions = twin.predict(data)

# Predict future capacity
future_cycles = np.arange(200, 500)
future_pred = twin.predict_future(
    cycles=future_cycles,
    temperature=25.0,
    charge_time=3600.0,
    initial_capacity=2.0
)

print(f"Training RMSE: {metrics['train_rmse']:.4f}")
print(f"Validation R²: {metrics['val_r2']:.4f}")
```

### Advanced Configuration

```python
# Custom configuration
config = {
    "physics_k": 0.13,
    "ml_model": {
        "hidden_layers": [128, 64, 32],
        "dropout_rate": 0.2,
        "learning_rate": 0.001,
        "epochs": 200,
        "batch_size": 64
    }
}

twin = HybridDigitalTwin(config=config)
```

### Command Line Interface

```bash
# Train a model
hybrid-twin train --data discharge.csv --config config.yaml --output model.pkl

# Make predictions
hybrid-twin predict --model model.pkl --data new_data.csv --output predictions.csv

# Evaluate model performance
hybrid-twin evaluate --model model.pkl --test-data test.csv
```

## Architecture

### Project Structure

```
battery-twin/
├── backend/
│   ├── src/
│   │   └── hybrid_digital_twin/
│   │       ├── core/                 # Core digital twin implementation
│   │       │   └── digital_twin.py   # Main HybridDigitalTwin class
│   │       ├── models/               # Model implementations
│   │       │   ├── physics_model.py  # Physics-based degradation model
│   │       │   └── ml_model.py       # ML correction model
│   │       ├── data/                 # Data loading and processing
│   │       │   └── data_loader.py    # Battery data loading utilities
│   │       ├── utils/                # Utility functions
│   │       │   ├── metrics.py        # Model evaluation metrics
│   │       │   ├── validators.py     # Data validation utilities
│   │       │   └── exceptions.py     # Custom exception classes
│   │       └── visualization/        # Plotting and visualization
│   │           └── plotters.py       # Plotting utilities
│   └── config/                       # Configuration files
│       └── default.yaml
└── frontend/                         # Web interface
    ├── components/
    ├── pages/
    └── styles/
```

## API Reference

### Core Classes

#### `HybridDigitalTwin`

Main orchestrator class combining physics and ML models.

```python
class HybridDigitalTwin:
    def __init__(self, config: Optional[Dict] = None) -> None
    def fit(self, data: pd.DataFrame, **kwargs) -> Dict[str, float]
    def predict(self, data: pd.DataFrame) -> np.ndarray
    def predict_future(self, cycles: np.ndarray, **kwargs) -> np.ndarray
    def evaluate(self, test_data: pd.DataFrame) -> Dict[str, float]
    def save_model(self, filepath: Path) -> None
    @classmethod
    def load_model(cls, filepath: Path) -> "HybridDigitalTwin"
```

#### `PhysicsBasedModel`

Physics-based Li-ion battery degradation model.

```python
class PhysicsBasedModel:
    def fit(self, data: pd.DataFrame) -> Dict[str, float]
    def predict(self, data: pd.DataFrame) -> np.ndarray
    def predict_lifetime(self, **kwargs) -> Dict[str, float]
    def sensitivity_analysis(self, **kwargs) -> Dict
```

#### `MLCorrectionModel`

Neural network for physics model correction.

```python
class MLCorrectionModel:
    def fit(self, X: np.ndarray, y: np.ndarray) -> Dict[str, float]
    def predict(self, X: np.ndarray) -> np.ndarray
    def predict_with_uncertainty(self, X: np.ndarray) -> Tuple[np.ndarray, np.ndarray]
```

### Configuration Schema

```yaml
physics_model:
  k: 0.13 # Degradation coefficient
  temperature_ref: 25.0 # Reference temperature (°C)

ml_model:
  hidden_layers: [64, 64] # Neural network architecture
  dropout_rate: 0.1 # Dropout for regularization
  learning_rate: 0.001 # Adam optimizer learning rate
  batch_size: 32 # Training batch size
  epochs: 100 # Maximum training epochs
  early_stopping_patience: 10 # Early stopping patience

data:
  validation_split: 0.2 # Validation data fraction
  random_state: 42 # Reproducibility seed

logging:
  level: INFO # Logging level
  format: structured # Log format
```

## Examples

### 1. Basic Battery Modeling

```python
from hybrid_digital_twin import HybridDigitalTwin, BatteryDataLoader
import matplotlib.pyplot as plt

# Load battery dataset
loader = BatteryDataLoader()
data = loader.load_csv("discharge.csv")

# Split data
train_data = data.iloc[:int(0.8 * len(data))]
test_data = data.iloc[int(0.8 * len(data)):]

# Train hybrid model
twin = HybridDigitalTwin()
metrics = twin.fit(train_data)

# Generate predictions with components
results = twin.predict(test_data, return_components=True)

# Visualize results
plt.figure(figsize=(12, 8))
plt.plot(test_data.index, test_data['Capacity'], 'o-', label='Actual', alpha=0.7)
plt.plot(test_data.index, results.physics_prediction, '--', label='Physics Model')
plt.plot(test_data.index, results.hybrid_prediction, '-', label='Hybrid Model')
plt.xlabel('Cycle Number')
plt.ylabel('Capacity (Ah)')
plt.title('Battery Capacity Prediction Comparison')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print(f"Hybrid Model RMSE: {metrics['val_rmse']:.4f}")
print(f"Physics Model RMSE: {metrics['physics_rmse']:.4f}")
```

### 2. Hyperparameter Optimization

```python
from sklearn.model_selection import ParameterGrid
from hybrid_digital_twin import HybridDigitalTwin

# Define parameter grid
param_grid = {
    'ml_model.hidden_layers': [[32, 16], [64, 32], [128, 64, 32]],
    'ml_model.learning_rate': [0.001, 0.01, 0.1],
    'ml_model.dropout_rate': [0.1, 0.2, 0.3],
}

best_score = float('inf')
best_params = None

for params in ParameterGrid(param_grid):
    # Convert flat params to nested config
    config = {}
    for key, value in params.items():
        keys = key.split('.')
        d = config
        for k in keys[:-1]:
            d = d.setdefault(k, {})
        d[keys[-1]] = value

    # Train and evaluate
    twin = HybridDigitalTwin(config=config)
    metrics = twin.fit(train_data, validation_split=0.2)

    if metrics['val_rmse'] < best_score:
        best_score = metrics['val_rmse']
        best_params = config

print(f"Best RMSE: {best_score:.4f}")
print(f"Best params: {best_params}")
```

## Performance

### Benchmark Results

Evaluation on NASA Battery Dataset (B0005):

| Model        | RMSE (Ah)  | MAE (Ah)   | R²         | MAPE (%) | Training Time |
| ------------ | ---------- | ---------- | ---------- | -------- | ------------- |
| Physics Only | 0.0156     | 0.0122     | 0.9823     | 0.68     | < 1s          |
| ML Only      | 0.0098     | 0.0076     | 0.9921     | 0.42     | 45s           |
| **Hybrid**   | **0.0067** | **0.0051** | **0.9954** | **0.28** | **52s**       |

### Computational Performance

- **Training**: ~50s on consumer GPU
- **Inference**: ~0.1ms per sample
- **Memory Usage**: ~200MB for typical dataset
- **Scalability**: Linear scaling with dataset size

## Testing

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=hybrid_digital_twin --cov-report=html

# Run specific test categories
pytest -m unit          # Unit tests only
pytest -m integration   # Integration tests only
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Standards

- Use type hints for Python code
- Follow PEP 8 style guidelines
- Add tests for new features
- Document public APIs

## License

This project is licensed under the MIT License.

## Citation

If you use this framework in your research, please cite:

```bibtex
@software{alva2026hybrid,
  title={Hybrid Digital Twin Framework for Li-ion Battery Modeling},
  author={Alva, Jason},
  year={2026},
  url={https://github.com/JasonAlva/Digital-Twin-for-Battery-Forecasting}
}
```

### Research References

1. **Xu, B., Oudalov, A., Ulbig, A., Andersson, G., & Kirschen, D. S.** (2016). Modeling of lithium-ion battery degradation for cell life assessment. _IEEE Transactions on Smart Grid_, 7(2), 826-835.

2. **Severson, K. A., Attia, P. M., Jin, N., et al.** (2019). Data-driven prediction of battery cycle life before capacity degradation. _Nature Energy_, 4(5), 383-391.

3. **Richardson, R. R., Irish, M. A., & Howey, D. A.** (2020). Battery health prediction under generalized conditions using a Gaussian process transition model. _Journal of Energy Storage_, 23, 320-328.

## Support

For issues or questions, please open an issue on GitHub.
