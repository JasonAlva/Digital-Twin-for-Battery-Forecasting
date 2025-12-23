# VoltTwin - Hybrid Digital Twin for Li-ion Battery Modeling

## Comprehensive Project Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [What is a Digital Twin?](#what-is-a-digital-twin)
3. [System Architecture](#system-architecture)
4. [Training Data & Sources](#training-data--sources)
5. [Physics-Based Model](#physics-based-model)
6. [Machine Learning Component](#machine-learning-component)
7. [Hybrid Approach](#hybrid-approach)
8. [Technical Stack](#technical-stack)
9. [Project Usefulness](#project-usefulness)
10. [Detailed Component Breakdown](#detailed-component-breakdown)
11. [How to Use](#how-to-use)

---

## Project Overview

**VoltTwin** is a professional-grade **Hybrid Digital Twin** system designed specifically for **Li-ion battery modeling, capacity prediction, and degradation forecasting**. It combines physics-based mathematical models with machine learning to create a powerful predictive tool for battery management.

### Key Characteristics

- **Hybrid Approach**: Combines physics-based modeling with data-driven ML corrections
- **Production-Ready**: Enterprise-grade code with proper error handling, logging, and validation
- **Accurate Predictions**: Predicts battery capacity loss over thousands of charge cycles
- **Explainable AI**: Physics-guided learning makes predictions more interpretable than pure ML
- **Full Stack**: Includes backend API, frontend dashboard, and training pipeline
- **Real-time Simulation**: Web interface for interactive battery behavior simulation

### Target Applications

- **Predictive Maintenance**: Detect degradation early
- **State of Health (SoH) Estimation**: Track battery performance
- **Fleet Management**: Monitor multiple batteries across vehicle fleets
- **Grid Storage**: Optimize large-scale battery energy storage systems
- **Warranty Management**: Predict end-of-life accurately
- **Product Design**: Improve battery specifications

---

## What is a Digital Twin?

A **Digital Twin** is a virtual representation of a physical system that can predict and simulate its behavior.

### Why "Digital Twin" for Batteries?

```
Physical Battery (Real World)
         ↓
    Sensors measure:
    - Voltage
    - Current
    - Temperature
    - Capacity degradation
         ↓
Digital Twin (Virtual Model)
    Learns patterns from sensor data
         ↓
Can predict:
    - Future capacity
    - Remaining useful life
    - Optimal charging strategy
    - Failure prediction
```

### Why "Hybrid"?

A traditional digital twin uses EITHER:

- **Physics-based models**: Accurate near training conditions but poor extrapolation
- **Machine Learning**: Accurate everywhere it was trained but unexplainable

**VoltTwin's Hybrid Approach** = Physics Model + ML Correction

This gives us the best of both worlds:

- ✅ Physics model provides interpretable baseline
- ✅ ML model learns and corrects physics model errors
- ✅ Works well outside training data range
- ✅ Explainable and accurate

---

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         VoltTwin System                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Frontend (Web Interface - Next.js)               │  │
│  │  - Interactive battery simulator form                    │  │
│  │  - Real-time results visualization                       │  │
│  │  - Charts and graphs for capacity prediction             │  │
│  │  - Modern React UI with Tailwind CSS                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↕ HTTP/REST                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Backend API (FastAPI - Port 8000)                 │  │
│  │  - REST endpoints for battery simulation                 │  │
│  │  - Validates input parameters                            │  │
│  │  - Orchestrates prediction pipeline                      │  │
│  │  - CORS enabled for frontend communication               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Prediction Engine (Python/TensorFlow)            │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Physics-Based Model                              │ │  │
│  │  │  - Xu et al. (2016) battery degradation equations │ │  │
│  │  │  - Deterministic, explainable predictions         │ │  │
│  │  │  - C_physics = C_0 * exp(-f_d)                    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                        ↓                                  │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  ML Correction Model (TensorFlow Neural Network)  │ │  │
│  │  │  - Learns residual between physics & observations │ │  │
│  │  │  - Deep learning with dropout & regularization    │ │  │
│  │  │  - Corrects systematic physics model errors       │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                        ↓                                  │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Hybrid Result                                     │ │  │
│  │  │  C_hybrid = C_physics + ML_correction             │ │  │
│  │  │  (Most accurate prediction)                        │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Training Pipeline (Offline)                      │  │
│  │  - Loads raw battery discharge data (CSV)               │  │
│  │  - Preprocesses and validates                           │  │
│  │  - Trains both physics and ML models                    │  │
│  │  - Saves trained models as pickle files                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
battery twin/
│
├── backend/                           # Backend Python application
│   ├── src/hybrid_digital_twin/       # Main source code
│   │   ├── __init__.py
│   │   ├── cli.py                     # Command-line interface
│   │   ├── core/
│   │   │   └── digital_twin.py        # Core HybridDigitalTwin class
│   │   ├── data/
│   │   │   └── data_loader.py         # Loads & preprocesses battery data
│   │   ├── models/
│   │   │   ├── physics_model.py       # Physics-based Xu et al. model
│   │   │   └── ml_model.py            # TensorFlow neural network
│   │   ├── utils/
│   │   │   ├── exceptions.py          # Custom error classes
│   │   │   ├── metrics.py             # Performance metrics (MSE, MAE, R²)
│   │   │   └── validators.py          # Input validation
│   │   └── visualization/
│   │       └── plotters.py            # Visualization utilities
│   │
│   ├── config/
│   │   └── default.yaml               # Configuration parameters
│   ├── data/
│   │   └── raw/
│   │       └── discharge.csv          # Raw training data (170k rows)
│   ├── models/                        # Trained model files
│   │   └── hybrid_twin_model.pkl      # Serialized trained model
│   │
│   ├── voltwin_api_enhanced.py        # FastAPI REST backend
│   ├── use_trained_model.py           # Example usage script
│   ├── pyproject.toml                 # Python package config
│   └── requirements-voltwin.txt       # Python dependencies
│
├── frontend/                          # React/Next.js web app
│   ├── pages/
│   │   ├── _app.tsx                   # App wrapper & styling
│   │   ├── _document.tsx              # HTML document setup
│   │   └── index.tsx                  # Main page (simulator)
│   ├── components/
│   │   ├── Navbar.tsx                 # Navigation bar
│   │   ├── Hero.tsx                   # Hero section
│   │   ├── SimulatorForm.tsx          # Battery input form
│   │   ├── ResultsDashboard.tsx       # Results visualization
│   │   ├── TechStack.tsx              # Technology display
│   │   └── Footer.tsx                 # Footer
│   ├── styles/
│   │   └── globals.css                # Global styling
│   ├── next.config.js                 # Next.js configuration
│   ├── tsconfig.json                  # TypeScript config
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS config
│   ├── package.json                   # Dependencies & scripts
│   └── next-env.d.ts                  # Next.js type definitions
│
├── START_VOLTWIN.bat                  # One-click launcher script
├── README.md                          # Original project README
├── PROJECT_DOCUMENTATION.md           # This file
└── .gitignore                         # Git ignore rules
```

---

## Training Data & Sources

### Data Format

**File**: `backend/data/raw/discharge.csv`
**Size**: ~170,000 rows of battery monitoring data
**Source**: Li-ion battery discharge cycle experiments

### Data Columns

```
Voltage_measured        → Voltage reading (Volts)
Current_measured        → Current draw (Amperes)
Temperature_measured    → Cell temperature (°C)
Current_charge          → Charge current (A)
Voltage_charge          → Charge voltage (V)
Time                    → Time elapsed (seconds)
Capacity                → Current capacity (Ah)
id_cycle                → Cycle number
type                    → 'discharge' or 'charge'
ambient_temperature     → Environmental temp (°C)
Battery                 → Battery identifier (e.g., B0005)
```

### Data Characteristics

- **Multiple batteries**: Different battery samples (B0005, etc.)
- **Many cycles**: Records from 1st to 1000+ charge/discharge cycles
- **High frequency**: Multiple measurements per cycle
- **Real-world data**: Noise, variations, realistic conditions

### Data Usage in Training

```
Raw Data (discharge.csv)
        ↓
Data Loader
    - Group by cycle and battery
    - Aggregate measurements per cycle
    - Calculate cycle-level capacity
        ↓
Preprocessing
    - Handle missing values
    - Normalize features (temperature, current, time)
    - Remove outliers
        ↓
Feature Engineering
    - Create derived features:
        * Cycle number
        * Temperature effects
        * Current variations
        * Time per cycle
        ↓
Train/Validation Split (80/20)
        ↓
Physics Model Fitting
    - Estimate initial capacity
    - Fit degradation parameters
        ↓
ML Model Training
    - Use physics predictions as input
    - Learn residuals (observed - physics)
    - Train neural network
        ↓
Validation & Testing
    - Calculate MSE, MAE, R²
    - Cross-validate performance
        ↓
Save Trained Models
    - pickle file for deployment
```

---

## Physics-Based Model

### Mathematical Foundation

The physics component is based on **Xu et al. (2016)** - a widely cited paper on Li-ion battery degradation modeling.

### Battery Lifetime Equation

$$L(t) = 1 - (1 - L_0) \times e^{-f_d}$$

Where:

- $L(t)$ = Battery lifetime fraction at time $t$ (0 = dead, 1 = healthy)
- $L_0$ = Initial lifetime loss fraction
- $f_d$ = Degradation rate factor

### Degradation Rate Function

$$f_d = \frac{k \times T_c \times i}{t}$$

Where:

- $k$ = Empirical degradation coefficient (≈ 0.13 - determined experimentally)
- $T_c$ = Cell temperature (°C)
- $i$ = Cycle number
- $t$ = Charge time per cycle (seconds)

### Battery Capacity Equation

$$C(cycle) = C_0 \times e^{-f_d}$$

Where:

- $C(cycle)$ = Battery capacity at a given cycle (Ah)
- $C_0$ = Initial battery capacity (Ah)
- $e^{-f_d}$ = Exponential degradation factor

### Key Physics Insights

1. **Temperature Effects**: Higher temperature → faster degradation

   - Exponential relationship: small temp increase = large capacity loss
   - $f_d \propto T_c$ (directly proportional)

2. **Cycle Effects**: More cycles → more degradation

   - Linear accumulation: $f_d \propto i$
   - Each cycle causes incremental damage

3. **Charge Time Effects**: Longer charge times → less degradation per cycle

   - Inverse relationship: $f_d \propto 1/t$
   - Slower charging is gentler on the battery

4. **Exponential Decay**: Capacity follows exponential curve, not linear
   - Explains why batteries seem "fine" then suddenly fail
   - Critical for predicting end-of-life

### Example Calculation

Assume:

- Initial capacity: C₀ = 2.0 Ah
- Degradation coefficient: k = 0.13
- Temperature: T_c = 40°C
- Cycle number: i = 500
- Time per cycle: t = 3600 seconds (1 hour)

**Calculate degradation factor:**
$$f_d = \frac{0.13 \times 40 \times 500}{3600} = 0.722$$

**Calculate remaining capacity:**
$$C(500) = 2.0 \times e^{-0.722} = 2.0 \times 0.486 = 0.972 \text{ Ah}$$

**Result**: After 500 cycles, battery retains 97.2% capacity

### Limitations of Pure Physics Model

- ❌ Assumes linear degradation accumulation
- ❌ Doesn't capture battery-specific variations
- ❌ Ignores complex electrochemical processes
- ❌ Single empirical coefficient (k) for all conditions
- ❌ Can't adapt to new data

**Solution**: Add ML correction layer

---

## Machine Learning Component

### Purpose

The ML model learns to **correct** the physics model by predicting the residual:

$$\Delta C = C_{observed} - C_{physics}$$

This residual represents all the physics model errors and unmodeled phenomena.

### Neural Network Architecture

```
Input Layer (14 features)
    ↓
Dense Layer (64 neurons) + ReLU activation
    ↓
Dropout (10% rate) - prevents overfitting
    ↓
Dense Layer (64 neurons) + ReLU activation
    ↓
Dropout (10% rate)
    ↓
Output Layer (1 neuron) - Linear activation
    ↓
Output: Capacity Correction (ΔC in Ah)
```

### Input Features (14 dimensions)

1. **C_physics** - Physics model prediction
2. **Temperature** - Operating temperature (°C)
3. **Cycle_number** - Current cycle
4. **Time_per_cycle** - Charge/discharge duration
5. **Initial_capacity** - Rated capacity
6. **Current_magnitude** - Absolute current draw
7. **Temperature_deviation** - Difference from reference (25°C)
8. **Temperature_squared** - Nonlinear temperature effect
9. **Cycle_interaction** - Cycle × Temperature interaction
10. **Time_interaction** - Time × Temperature interaction
11. **Log_cycle** - Log-transformed cycle number
12. **Current_density** - Current relative to capacity
13. **Normalized_cycle** - Cycle normalized by expected life
14. **Age_factor** - Combined age indicator

### Training Process

**Step 1: Data Preparation**

```python
# Load raw battery data
data = load_battery_data('discharge.csv')

# Group by cycle, aggregate measurements
data_aggregated = aggregate_by_cycle(data)

# Split: 80% training, 20% validation
X_train, X_val, y_train, y_val = train_test_split(data, test_size=0.2)
```

**Step 2: Feature Scaling**

```python
# Normalize features to [0,1] range
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)
```

**Step 3: Physics Predictions**

```python
# Get physics baseline for training data
C_physics_train = physics_model.predict(X_train_scaled)

# Calculate targets: what ML needs to correct
y_correction = y_train - C_physics_train  # ΔC
```

**Step 4: Neural Network Training**

```python
# Compile model
model = Sequential([
    Dense(64, activation='relu', input_dim=14),
    Dropout(0.1),
    Dense(64, activation='relu'),
    Dropout(0.1),
    Dense(1, activation='linear')
])
model.compile(
    optimizer=Adam(lr=0.001),
    loss='mse',
    metrics=['mae']
)

# Train with early stopping
history = model.fit(
    X_train_scaled, y_correction,
    validation_data=(X_val_scaled, y_val - physics_model.predict(X_val_scaled)),
    epochs=100,
    batch_size=32,
    callbacks=[EarlyStopping(patience=10)]
)
```

**Step 5: Validation**

```python
# Test on validation set
y_pred_physics = physics_model.predict(X_val_scaled)
y_pred_correction = ml_model.predict(X_val_scaled)
y_pred_hybrid = y_pred_physics + y_pred_correction

# Calculate metrics
mse = mean_squared_error(y_val, y_pred_hybrid)
mae = mean_absolute_error(y_val, y_pred_hybrid)
r2 = r2_score(y_val, y_pred_hybrid)
```

### Key Hyperparameters

| Parameter         | Value       | Purpose                                 |
| ----------------- | ----------- | --------------------------------------- |
| Hidden layers     | [64, 64]    | Network width                           |
| Dropout rate      | 0.1         | Overfitting prevention                  |
| Learning rate     | 0.001       | Optimization speed                      |
| Batch size        | 32          | Gradient estimation                     |
| Epochs            | 100         | Training iterations                     |
| Early stopping    | patience=10 | Stop when validation metric plateaus    |
| L2 regularization | 0.001       | Weight penalty (prevents large weights) |

### Why These Hyperparameters?

- **Hidden layers [64, 64]**: Wide enough to learn complex patterns, narrow enough to avoid overfitting
- **Dropout 0.1**: Light regularization (0.1 = 10% of neurons dropped per batch)
- **Learning rate 0.001**: Slow enough to converge, fast enough to train quickly
- **Batch size 32**: Balance between gradient noise and computational efficiency
- **Early stopping patience=10**: Stop if validation doesn't improve for 10 epochs

---

## Hybrid Approach

### The Three-Step Prediction

When you input battery parameters, the system performs three predictions:

#### **1️⃣ Physics Prediction**

Input parameters → Physics equations → $C_{physics}$

```python
def physics_predict(capacity_ah, temperature_c, cycle_num, time_per_cycle):
    # Calculate degradation factor
    f_d = (k * temperature_c * cycle_num) / time_per_cycle

    # Apply exponential decay
    C_physics = capacity_ah * np.exp(-f_d)

    return C_physics
```

**Pros**: Interpretable, based on scientific principles
**Cons**: Doesn't learn from data, has systematic errors

#### **2️⃣ ML Correction**

Physics prediction + other features → Neural network → $\Delta C$

```python
def ml_correct(C_physics, temperature, cycle, time, ...):
    # Prepare input features
    features = [C_physics, temperature, cycle, time, ...]

    # Scale features
    features_scaled = scaler.transform(features)

    # Neural network prediction
    delta_C = ml_model.predict(features_scaled)

    return delta_C
```

**Pros**: Learns from data, adapts to real conditions
**Cons**: Can't extrapolate beyond training, like a "black box"

#### **3️⃣ Hybrid Prediction**

$$C_{hybrid} = C_{physics} + \Delta C$$

```python
def hybrid_predict(capacity_ah, temperature_c, cycle_num, time_per_cycle):
    # Get physics baseline
    C_physics = physics_predict(capacity_ah, temperature_c, cycle_num, time_per_cycle)

    # Get ML correction
    delta_C = ml_correct(C_physics, temperature_c, cycle_num, time_per_cycle)

    # Combine
    C_hybrid = C_physics + delta_C

    return C_hybrid
```

**Pros**: Combines both approaches!
✅ Interpretable (physics baseline)
✅ Accurate (learns from data)
✅ Robust (extrapolates better)

### Visualization Example

For a battery at different cycles:

```
Cycle 100:
  C_physics = 1.98 Ah    ← Physics says ~1.98
  ML correction = +0.02 Ah ← ML says "add a tiny bit"
  C_hybrid = 2.00 Ah     ← Final prediction

Cycle 500:
  C_physics = 1.85 Ah    ← Physics says ~1.85
  ML correction = +0.05 Ah ← ML says "add more here"
  C_hybrid = 1.90 Ah     ← Final prediction

Cycle 1000:
  C_physics = 1.65 Ah    ← Physics says ~1.65
  ML correction = +0.08 Ah ← ML says "add even more"
  C_hybrid = 1.73 Ah     ← Final prediction (more accurate)
```

The ML learns that physics predictions are systematically too pessimistic (too low) for this specific battery, so it adds an appropriate correction.

### Advantages Over Single Approaches

| Aspect                  | Physics Only | ML Only   | Hybrid         |
| ----------------------- | ------------ | --------- | -------------- |
| **Interpretability**    | ✅ High      | ❌ Low    | ✅ Medium-High |
| **Accuracy in-range**   | ⚠️ Medium    | ✅ High   | ✅ High        |
| **Accuracy out-range**  | ⚠️ Medium    | ❌ Poor   | ✅ Good        |
| **Data needed**         | ❌ None      | ✅ Lots   | ✅ Medium      |
| **Computation**         | ✅ Fast      | ✅ Fast   | ✅ Fast        |
| **Scientific validity** | ✅ Yes       | ⚠️ Maybe  | ✅ Yes         |
| **Adaptability**        | ❌ Fixed     | ✅ Learns | ✅ Both        |

---

## Technical Stack

### Backend (Python)

```
Core Framework
├── FastAPI 0.109.0          # REST API framework (async, modern)
├── Uvicorn 0.27.0           # ASGI server (runs FastAPI)
└── Pydantic                 # Data validation & serialization

Scientific Computing
├── NumPy 1.26.4             # Numerical arrays & math
├── Pandas 2.1.4             # Data manipulation & analysis
├── SciPy 1.11.4             # Scientific functions
└── scikit-learn 1.3.2       # ML utilities (scaling, metrics)

Machine Learning
├── TensorFlow 2.15.0        # Deep learning framework
├── Keras                    # High-level NN API (part of TF)
└── joblib                   # Model serialization

Utilities
├── Pydantic 1.8.0           # Data validation
├── typer                    # CLI interface
├── rich                     # Beautiful terminal output
├── loguru                   # Advanced logging
├── hydra-core               # Configuration management
├── MLflow 1.30.0            # ML experiment tracking
└── pickle                   # Python object serialization

Development
├── pytest                   # Testing framework
├── black                    # Code formatter
├── mypy                     # Type checking
└── flake8                   # Linting
```

### Frontend (React/TypeScript)

```
Core Framework
├── Next.js 14.0.0           # React meta-framework (SSR, SSG)
├── React 18.2.0             # UI library
└── React-DOM 18.2.0         # React web rendering

Styling & UI
├── Tailwind CSS 3.3.0       # Utility-first CSS
├── PostCSS 8.4.0            # CSS transformations
├── Autoprefixer             # CSS vendor prefixes
└── framer-motion 10.16.0    # Animation library

Data Visualization
├── Recharts 2.10.0          # React charting library
└── Lucide React 0.294.0     # Icon library

HTTP & API
├── Axios 1.6.0              # HTTP client
└── (Fetch API)              # Browser built-in

Development
├── TypeScript 5.2.0         # Static typing
├── ESLint                   # Code quality
└── Next Lint                # NextJS-specific linting
```

### DevOps & Deployment

```
Local Development
├── Windows PowerShell       # Command execution
├── Node.js + npm            # Frontend package management
└── Python 3.8+              # Backend runtime

Version Control
├── Git                      # Source control
└── GitHub                   # Remote repository

Process Management
├── Windows taskkill         # Process termination
└── Batch scripts (.bat)     # Windows automation
```

### Why These Technologies?

| Technology        | Why                                                    |
| ----------------- | ------------------------------------------------------ |
| **FastAPI**       | Modern, fast, auto-documentation, great for REST APIs  |
| **React/Next.js** | Best-in-class frontend, SEO-friendly, production-grade |
| **TensorFlow**    | Industry standard for ML/DL, well-documented           |
| **Tailwind CSS**  | Rapid UI development, responsive design                |
| **TypeScript**    | Type safety catches errors at compile time             |
| **Recharts**      | Simple React charts without heavy dependencies         |

---

## Project Usefulness

### Real-World Applications

#### 1. **Electric Vehicle (EV) Battery Management**

- Monitor battery health in real-time
- Predict when battery replacement is needed
- Optimize charging schedules
- Extend battery lifespan
- **Impact**: Save thousands in replacement costs

#### 2. **Grid Energy Storage**

- Large-scale battery storage for renewable energy
- Predict degradation across thousands of batteries
- Optimize maintenance schedules
- Maximize return on investment
- **Impact**: Enable renewable energy adoption

#### 3. **IoT Devices**

- Track battery health in wireless sensors
- Predict device failures before they happen
- Schedule maintenance proactively
- **Impact**: Improve system reliability and uptime

#### 4. **Battery Manufacturing**

- Quality control during production
- Identify defective batteries before shipment
- Understand degradation mechanisms
- Improve battery designs
- **Impact**: Reduce warranty claims and recalls

#### 5. **Predictive Maintenance**

- Detect degradation early
- Schedule maintenance before failure
- Reduce downtime
- Optimize spare parts inventory
- **Impact**: Reduce operational costs by 20-40%

### Key Benefits

**For Businesses:**

- 💰 **Cost Reduction**: Avoid unexpected failures, plan maintenance
- 📊 **Data-Driven Decisions**: Know exactly when to replace batteries
- 🔧 **Operational Efficiency**: Optimize charging and usage patterns
- 📈 **Scalability**: Works with hundreds/thousands of batteries
- 📋 **Compliance**: Document battery health for regulations

**For Engineers:**

- 🔬 **Understanding**: Understand battery degradation mechanisms
- 🧪 **Experimentation**: Test "what-if" scenarios
- 📚 **Learning**: Study hybrid ML approaches
- 🛠️ **Tools**: Production-grade code to learn from

**For Research:**

- 📖 **Publication Material**: Novel hybrid approach
- 🎯 **Benchmarking**: Compare physics vs ML vs hybrid
- 🔍 **Insights**: Learn what drives battery degradation
- 🚀 **Innovation**: Build upon this framework

---

## Real-World Daily Usage: Company Examples

This section explains **exactly how different companies use VoltTwin in their daily operations**, with specific inputs, outputs, and business processes.

---

### 1️⃣ **Electric Vehicle (EV) Manufacturer - Tesla/BMW/Audi**

#### The Problem They Face

- They manufacture 500,000 EVs per year with 100-200 kWh batteries
- Batteries degrade over time, warranty claims cost $5,000-$15,000 per battery
- They need to know when batteries will fail to manage warranty reserves
- Competitors need early degradation detection for customer satisfaction

#### Daily Workflow

**Morning: Battery Quality Check**

```
Employee: QA Engineer
Task: Check overnight battery test data
Time: 8:00 AM

Step 1: Upload test data to VoltTwin
File: "TestBatch_2025_12_23.csv"
Contains real measurements from 50 test batteries:
- Voltage readings (every second)
- Current draw (every second)
- Temperature sensors (every 5 seconds)
- Capacity measurements (every cycle)

Step 2: Run degradation analysis
Input Parameters (from test data):
{
  "initial_capacity_ah": 150,          // Battery rated capacity
  "temperature_celsius": 35,            // Avg test temperature
  "discharge_current_a": 250,           // Typical EV discharge rate
  "num_cycles": 1000,                   // Simulating 10-year lifespan
  "time_per_cycle_minutes": 120,        // Typical EV charge time
  "usage_profile": "heavy"              // EV use case
}

Step 3: Receive Results (in 2 seconds)

Output:
{
  "cycles": [1, 2, 3, ..., 1000],
  "capacity_physics": [150.0, 149.8, 149.6, ...],
  "capacity_ml": [150.0, 149.9, 149.8, ...],
  "capacity_hybrid": [150.0, 149.9, 149.8, ...],
  "eol_cycle": 847,                    // Battery reaches 80% at cycle 847
  "metrics": {
    "mse": 0.0023,
    "mae": 0.031,
    "r2": 0.9947
  }
}

Step 4: Interpret Results
- Physics Prediction: "Optimistic" baseline
- ML Correction: "Real-world adjustments"
- Hybrid (MOST RELIABLE): Says this battery hits 80% SOH at cycle 847
- 847 cycles × 120 minutes/cycle = 1,694 hours ≈ 8.5 years
- Within expected 8-10 year warranty ✅

Step 5: Compare with 50 other test batteries
- If all 50 show consistent EOL cycles (800-900): Production is good ✅
- If 5 show EOL at 600 cycles: These are defective, investigate manufacturing
- Statistical outliers get deep analysis
```

**Afternoon: Warranty Reserve Planning**

```
Employee: Finance Manager
Task: Calculate warranty costs for next quarter

Uses VoltTwin results:
- Average EOL cycle from testing: 847
- Expected failures per year: 1,200 vehicles
- Cost per replacement battery: $8,000
- Annual warranty reserve needed: 1,200 × $8,000 = $9.6 million

Without VoltTwin:
- Overestimate: Reserve $15M (wastes $5.4M per year)
- Underestimate: Reserve $5M (gets sued for failures)

With VoltTwin:
- Precise estimate: Reserve exactly $9.6M ✅
- Saves company millions in cash flow
```

**Evening: Predictive Maintenance Alerts**

```
System: Automated monitoring
Task: Monitor fleet of 10,000 EVs in real-time

Each EV sends data:
- Every 100 km: Battery measurements uploaded
- VoltTwin predicts current SoH (State of Health)
- If SoH < 80%: Alert sent
- If SoH degrading too fast: Contact customer
- If SoH < 60%: Schedule recall/replacement

Example Alert:
"Vehicle VIN# WBA1234567 shows abnormal degradation.
Predicted EOL: 3 months instead of 12 months.
Recommend recall inspection. Approve replacement costs?"
```

---

### 2️⃣ **Grid Energy Storage Company - NextEra Energy/EDF**

#### The Problem They Face

- They operate 1 GWh battery storage facility (10,000+ batteries)
- Each battery costs $300,000
- Maintenance downtime costs $50,000/hour
- Need to predict failures to minimize downtime
- Grid must be stable 99.99% of the time

#### Daily Workflow

**Morning Shift: 6:00 AM - Facility Status Check**

```
Employee: Operations Manager
Task: Check grid battery health before peak demand

Step 1: System pulls data from 10,000 batteries
Automatic VoltTwin analysis

For each battery:
Input (automatically collected):
{
  "initial_capacity_ah": 300,           // Battery rated capacity
  "temperature_celsius": 22,             // Datacenter temperature
  "discharge_current_a": 1500,           // Max discharge rate
  "num_cycles": 8500,                    // Cycles so far this year
  "time_per_cycle_minutes": 180,         // Typical discharge duration
  "usage_profile": "heavy"               // Grid use = constant cycling
}

Step 2: Get Health Status for Each Battery
Output = SoH (State of Health) percentage

Results from 10,000 batteries:
- 9,200 batteries: SoH = 90-100% ✅ (Healthy, normal operation)
- 750 batteries: SoH = 80-89% ⚠️  (Aging, monitor closely)
- 45 batteries: SoH = 70-79% 🔴 (High risk, schedule maintenance)
- 5 batteries: SoH < 70% 🚨 (URGENT, take offline)

Step 3: Action Plan
Today's Maintenance Schedule:
┌─────────────────────────────────────────┐
│ 8:00 AM - Replace 5 failed batteries    │
│ (24 hours lead time, parts ready)       │
│                                         │
│ 10:00 AM - Service 45 degraded batteries│
│ (perform capacity check, replace if     │
│  degraded below functional threshold)   │
│                                         │
│ 2:00 PM - Check 750 aging batteries     │
│ (no action needed yet, flag for next    │
│  month's maintenance)                   │
└─────────────────────────────────────────┘

Step 4: Financial Impact
Without VoltTwin:
- Sudden failures: 20 batteries fail unexpectedly
- Emergency replacement: $20 × $300,000 = $6M cost
- Emergency response: $50,000/hour × 8 hours = $400K
- Grid instability fines: $2M
- Total loss: $8.4M

With VoltTwin:
- Predict failures 30 days in advance
- Order replacement batteries (no rush fee)
- Schedule maintenance during low-demand hours
- Zero unplanned downtime
- Cost: $6M (no premiums)
- Savings: $2.4M per incident
```

**Afternoon: Energy Trading Decisions**

```
Employee: Trading Analyst
Task: Decide how much energy to buy/sell tomorrow

Uses VoltTwin SoH data:

Current Status:
- 10,000 batteries available
- SoH status: 9,200 healthy, 750 aging, 50 offline

Decision:
- Healthy batteries = can support 100% grid demand
- With 750 degraded = can't sustain peak loads
- With 50 offline = lower capacity
- Predicted available capacity: 9,200/10,000 = 92%

Trading Decision:
- Can sell 92% of contracted capacity
- For 8% gap: Buy power from other grids
- Cost: 8% × $100K/hour = $8,000/hour cost
- Revenue: 92% × $150K/hour = $138,000/hour profit
- Net: $138K - $8K = $130K/hour

Without VoltTwin prediction:
- Guess availability: 85% (too conservative)
- Buy more backup power unnecessarily
- Miss profit opportunity
```

---

### 3️⃣ **Electric Bus Fleet Operator - BYD/Proterra**

#### The Problem They Face

- Operating 500 electric buses
- Each battery pack costs $50,000, lasts 8-10 years
- Bus downtime costs $500/day (lost revenue + penalties)
- Drivers need reliability (can't strand passengers)
- Need to optimize battery usage across fleet

#### Daily Workflow

**Morning: Fleet Dispatch**

```
Employee: Fleet Manager
Task: Assign buses to routes, knowing battery health

Input from VoltTwin monitoring system:
Each of 500 buses has real-time SoH:

Top Tier (SoH > 95%): 350 buses
- Fully healthy
- Can do long intercity routes (500 km)
- Full power available

Middle Tier (SoH 85-95%): 130 buses
- Still good
- Assign to shorter urban routes (200 km)
- Avoid extreme temperatures
- Avoid constant highway speeds

Lower Tier (SoH 70-85%): 15 buses
- Getting old
- Assign to short depot runs (50 km)
- Not suitable for passenger routes

End of Life (SoH < 70%): 5 buses
- OFFLINE
- In maintenance for battery replacement
- Scheduled to return in 2 weeks

Decision:
"Route 42 (Boston-NYC, 250 km): Assign bus #247 (SoH 92%) - enough capacity"
"Route 15 (City loop, 100 km): Assign bus #398 (SoH 78%) - suitable for short route"
"Do NOT assign bus #156 (SoH 68%): Will be offline for maintenance"
```

**Midday: Real-time Monitoring**

```
System: Automatic tracking
Scenario: Bus #247 on Route 42

Real-time data being collected:
- Current battery voltage
- Current draw
- Temperature
- Distance traveled
- Estimated remaining range

At 150 km point:
System calculates:
- SoH during trip: Dropped from 92% to 88%
- Remaining capacity: 65% of maximum
- Remaining range at current consumption: 220 km
- Route requires: 100 km to destination
- Status: ✅ OK - Safe margin (120 km extra)

Message to driver: "Battery status: Good. Route completable with 55% reserve."

Alternative scenario - Bus #289 on same route:
- SoH: 78% (not ideal but assigned)
- Remaining capacity: 45% of maximum
- Remaining range: 150 km
- Route requires: 100 km to destination
- Status: ✅ OK - 50 km safety margin
- Message: "Warning: Limited reserve. Drive efficiently to improve margin."

Worst case - Battery drops faster than predicted:
- At 160 km: Remaining range now shows 130 km
- Route needs 90 km
- Status: ⚠️ Still OK but close
- VoltTwin predicts: "Will arrive with 15% charge"
- Message to driver: "Battery lower than expected. Recommend charging at next stop."
```

**Evening: Battery Replacement Planning**

```
Employee: Maintenance Manager
Task: Schedule battery replacements

VoltTwin data shows:
- 15 buses at SoH 70-85% (aging phase)
- 5 buses at SoH <70% (end of life)

Prediction:
- 5 buses at SoH 70-75% will likely need replacement in 3-6 months
- 10 buses at SoH 75-85% will need replacement in 6-12 months

Budget Planning:
- Current replacements: 5 × $50,000 = $250,000 (Q1 2026)
- Predicted Q2: 10 × $50,000 = $500,000
- Predicted Q3: 5 × $50,000 = $250,000
- Total 1-year budget: $1,000,000

Without VoltTwin:
- Surprise failure: Bus down, emergency replacement
- Lost revenue + emergency fees: $50,000 per failure
- Poor maintenance planning

With VoltTwin:
- Planned replacement during off-season
- Bulk ordering of batteries (10% discount)
- Zero emergency costs
- Saves: $50K × 5 unexpected failures = $250K per year
```

---

### 4️⃣ **Renewable Energy + Storage Provider - Tesla Energy/Sunrun**

#### The Problem They Face

- Install residential battery systems (10-15 kWh per home)
- Warranty: 10 years or 80% capacity
- Monitor thousands of home batteries
- Customers see degradation through app
- Need to manage warranty claims proactively

#### Daily Workflow

**Morning: Customer Support Dashboard**

```
Employee: Customer Service AI
Task: Monitor 10,000 residential batteries, flag issues

Automated system runs VoltTwin for each battery:

Input (from smart meter):
{
  "initial_capacity_ah": 25,             // 10 kWh system
  "temperature_celsius": 24,              // Home climate
  "discharge_current_a": 30,              // Typical discharge
  "num_cycles": 2,847,                    // Cycles so far
  "time_per_cycle_minutes": 240,          // Typical usage duration
  "usage_profile": "standard"             // Residential use
}

Results show SoH (State of Health):

Green Zone (SoH > 90%): 9,500 homes
- System working great
- Customer gets: "Your battery is healthy!"
- No action needed

Yellow Zone (SoH 80-90%): 450 homes
- Still within warranty
- Customer gets: "Your battery is aging normally. Expected to reach 80% in 2-3 years"
- Offer: "Upgrade to larger system? 20% discount"

Red Zone (SoH < 80%): 50 homes
- Warranty trigger! System degraded faster than expected
- Automatic process:
  * Flag for free replacement/repair
  * Customer gets: "Your system qualifies for warranty service. We'll contact you"
  * Technician dispatched within 48 hours
  * Replacement battery installed (covered by warranty)

Plus Alerts:
- 5 systems showing "unusual degradation pattern"
- VoltTwin analysis shows these were installed in high-heat locations
- Email customer: "We detected your location may cause faster aging. Recommendations..."
```

**Afternoon: Predictive Support**

```
Employee: Warranty Manager
Task: Forecast warranty costs for next 12 months

VoltTwin analysis across 10,000 systems:

Current predictions:
- Systems below 80% SoH TODAY: 50 units
- Systems predicted to hit 80% in next 12 months: 200 units
- Systems predicted to hit 80% in 12-24 months: 800 units
- Systems expected healthy for >3 years: 8,950 units

Cost calculation:
Replacement cost per system: $3,000
- Next 12 months: (50 + 200) × $3,000 = $750,000
- 12-24 months: 800 × $3,000 = $2.4M
- Total 2-year warranty reserve: $3.15M

Quarterly breakdown:
- Q1 2026: 60 replacements = $180K
- Q2 2026: 70 replacements = $210K
- Q3 2026: 80 replacements = $240K
- Q4 2026: 40 replacements = $120K
(Staffing, parts inventory, logistics planned accordingly)

Without VoltTwin:
- Unexpected claims: $5M/year
- Insufficient reserve: Get sued
- Emergency response costs add 30%

With VoltTwin:
- Exact forecast: Plan precisely
- Bulk order batteries (save 15%)
- Schedule technicians efficiently
- Perfect customer experience
```

**Evening: Customer Experience**

```
Customer: John Smith (homeowner)
Opens: Sunrun App

Dashboard shows:
┌──────────────────────────┐
│  Your Battery System     │
├──────────────────────────┤
│  State of Health: 87%    │
│  Installed: Jan 2019     │
│  Age: 6 years            │
│                          │
│  Warranty Status: ✅ OK  │
│  Remaining Life: 3-4 yrs │
│                          │
│  Daily Savings: $2.50    │
│  Monthly Savings: $75    │
│  Annual Savings: $900    │
│                          │
│  📊 View Details         │
│  💡 Upgrade Options      │
└──────────────────────────┘

John clicks "View Details":
- Capacity trend: Shows gradual decline over 6 years
- Warranty expiry: Estimated in 3-4 years
- Health factor: Excellent (no defects)
- Recommendation: "System aging normally. Consider upgrade when SoH reaches 70%"

John feels informed, trusts company, doesn't worry about "hidden" degradation.
Company proactively manages expectations, reduces support tickets.
```

---

### 5️⃣ **Battery Manufacturing QA - CATL/LG Energy**

#### The Problem They Face

- Produce 1 million battery cells per day
- Strict quality standards
- Need to test cells without destroying them
- Defects discovered late = losses multiply (cell → module → pack → vehicle)
- Quality metrics are competitive advantage

#### Daily Workflow

**Production Floor: Cell Testing**

```
Employee: QA Technician
Task: Test cells from production line for degradation patterns

Process:
- Every 100th cell from production gets tested
- Test: Charge/discharge 50 cycles in controlled chamber
- Measure voltage, current, temperature, capacity

Cell #2,847 from line:

Input to VoltTwin:
{
  "initial_capacity_ah": 3.5,            // Cell rated capacity
  "temperature_celsius": 25,              // Test chamber
  "discharge_current_a": 3.5,             // C-rate: 1.0C
  "num_cycles": 50,                       // Initial screening cycles
  "time_per_cycle_minutes": 60,           // 1 hour per cycle
  "usage_profile": "standard"             // Normal discharge
}

Results:
Physics Model: Predicts 3.48 Ah after 50 cycles (99.4% retained)
ML Correction: Predicts -0.01 Ah correction
Hybrid Result: 3.47 Ah (99.1% retained)

Analysis:
- Expected: 99%+ retention for healthy cell
- Observed: 99.1% ✅ PASS - Cell is healthy
- This cell goes to next production step

Cell #3,014 from line:

Same test setup:
Physics Model: 3.48 Ah
ML Correction: -0.05 Ah
Hybrid Result: 3.43 Ah (98.0% retained)

Analysis:
- Unexpected: Only 98% retention
- VoltTwin flags: "Cell shows accelerated degradation"
- Reason: Internal resistance issue (predicted by ML model)
- Action: ❌ REJECT - Cell fails QA
- Send to scrap/analysis (defect is caught early)

Savings: This defect found at $0.50 cost (cell)
If passed through:
- Module assembly: Add $50 of components
- Pack assembly: Add $200 of labor/integration
- Vehicle assembly: Add $500 of integration
- Field failure: $5,000 warranty claim
Catching defect early saves: ~$4,750 per bad cell
```

**Quality Report: End of Shift**

```
Daily QA Summary:
- Cells tested: 10,000 (every 100th cell from 1M daily production)
- Cells passed: 9,987 (99.87% pass rate)
- Cells rejected: 13 (flagged by VoltTwin anomaly detection)
- Average SoH: 99.1%
- Trend: Stable ✅

Root cause analysis of 13 failures:
- 8 cells: High internal resistance (manufacturing issue in sealing)
- 3 cells: Low initial capacity (material batch defect)
- 2 cells: Rapid degradation (electrode coating problem)

Action items:
- Notify production manager: Sealing process needs review
- Contact materials supplier: Check material batch #X
- Adjust electrode coating parameters for next batch

Cost impact:
- Defects caught: 13 cells × $4,750 = $61,750 saved per day
- Monthly: $61,750 × 25 days = $1.54M saved
- Annual: $18.8M saved through early defect detection
```

---

### Summary: Why Companies Use VoltTwin Daily

**The Universal Pattern Across Industries:**

| Stage             | Input              | VoltTwin Output      | Business Action        | Savings              |
| ----------------- | ------------------ | -------------------- | ---------------------- | -------------------- |
| **Manufacturing** | Test measurements  | Defect detection     | Reject bad cells       | $4,750 per defect    |
| **QA/Validation** | Battery test data  | Degradation forecast | Accept/reject models   | $1.5M per year       |
| **Deployment**    | Field data         | SoH status           | Maintenance scheduling | $250K per incident   |
| **Customer Use**  | Real usage data    | EOL prediction       | Warranty management    | $2.4M per year       |
| **Support**       | Complaint data     | Anomaly detection    | Proactive support      | 30% ticket reduction |
| **Finance**       | Degradation curves | Reserve estimation   | Budget planning        | $5-8M per year       |
| **Fleet/Grid**    | System health      | Capacity planning    | Demand forecasting     | $2.4M per incident   |

**Core Value Proposition:**

VoltTwin transforms battery data into **actionable business intelligence**:

1. **Predict before it breaks** = zero emergency costs
2. **Manage expectations** = fewer warranty claims
3. **Optimize timing** = best use of resources
4. **Reduce waste** = catch defects early
5. **Improve decisions** = data-driven strategy

---

## Detailed Component Breakdown

### Component 1: Physics Model (`physics_model.py`)

**What it does**: Implements the Xu et al. (2016) battery degradation equation.

```python
class PhysicsBasedModel:
    def predict(self, data: pd.DataFrame) -> np.ndarray:
        """
        Input: DataFrame with columns:
        - temperature_celsius
        - cycle_number
        - time_per_cycle_seconds

        Output: Predicted capacity (Ah)
        """
        # Equation: C(t) = C_0 * exp(-k*T*i/t)
        f_d = (self.params.k * data['temperature_celsius']
               * data['cycle_number']
               / data['time_per_cycle_seconds'])

        C_predicted = data['initial_capacity'] * np.exp(-f_d)

        return C_predicted
```

**Parameters**:

- `k = 0.13`: Empirical degradation coefficient
- `temperature_ref = 25°C`: Reference temperature

**Outputs**:

- Predicted capacity at each cycle
- Fitness metrics (MSE, MAE, R²)

### Component 2: ML Model (`ml_model.py`)

**What it does**: TensorFlow neural network that learns residuals.

```python
class MLCorrectionModel:
    def __init__(self):
        self.model = Sequential([
            Dense(64, activation='relu', input_dim=14),
            Dropout(0.1),
            Dense(64, activation='relu'),
            Dropout(0.1),
            Dense(1, activation='linear')
        ])
        self.scaler = StandardScaler()

    def fit(self, X: np.ndarray, y: np.ndarray):
        """
        Train network to predict capacity corrections.

        X shape: (samples, 14 features)
        y shape: (samples,) - correction values
        """
        X_scaled = self.scaler.fit_transform(X)

        self.model.fit(
            X_scaled, y,
            epochs=100,
            batch_size=32,
            validation_split=0.2,
            callbacks=[EarlyStopping(patience=10)]
        )

    def predict(self, X: np.ndarray) -> np.ndarray:
        """Return correction term ΔC"""
        X_scaled = self.scaler.transform(X)
        return self.model.predict(X_scaled)
```

**Key Methods**:

- `fit()`: Train on data
- `predict()`: Get corrections
- `save()`: Serialize to disk
- `load()`: Deserialize from disk

### Component 3: Digital Twin (`digital_twin.py`)

**What it does**: Orchestrates both models, combines predictions.

```python
class HybridDigitalTwin:
    def __init__(self):
        self.physics_model = PhysicsBasedModel()
        self.ml_model = MLCorrectionModel()

    def predict(self, data: pd.DataFrame) -> PredictionResult:
        """Generate all three predictions"""

        # Physics prediction
        C_physics = self.physics_model.predict(data)

        # ML correction
        delta_C = self.ml_model.predict(data)

        # Hybrid combination
        C_hybrid = C_physics + delta_C

        return PredictionResult(
            physics_prediction=C_physics,
            ml_correction=delta_C,
            hybrid_prediction=C_hybrid
        )

    def fit(self, data: pd.DataFrame):
        """Train both components on data"""

        # Train physics model
        self.physics_model.fit(data)

        # Get physics predictions for ML
        C_physics = self.physics_model.predict(data)

        # Train ML to correct physics
        y_correction = data['capacity'] - C_physics
        self.ml_model.fit(data, y_correction)
```

### Component 4: FastAPI Backend (`voltwin_api_enhanced.py`)

**What it does**: REST API that serves predictions to frontend.

```python
@app.post("/simulate")
async def simulate(input_data: SimulationInput) -> SimulationResult:
    """
    Main API endpoint

    Input JSON:
    {
        "initial_capacity_ah": 2.0,
        "temperature_celsius": 40,
        "discharge_current_a": 1.5,
        "num_cycles": 500,
        "time_per_cycle_minutes": 60,
        "usage_profile": "standard"
    }

    Output JSON:
    {
        "cycles": [1, 2, 3, ...],
        "capacity_physics": [1.99, 1.98, 1.97, ...],
        "capacity_ml": [1.99, 1.99, 1.98, ...],
        "capacity_hybrid": [1.99, 1.99, 1.98, ...],
        "eol_cycle": 2847,
        "metrics": {
            "mse": 0.0012,
            "mae": 0.025,
            "r2": 0.9876
        }
    }
    """

    # Create simulation data
    cycles = list(range(1, input_data.num_cycles + 1))
    data = pd.DataFrame({
        'cycle': cycles,
        'temperature_celsius': input_data.temperature_celsius,
        'discharge_current_a': input_data.discharge_current_a,
        'time_per_cycle_minutes': input_data.time_per_cycle_minutes,
        'initial_capacity_ah': input_data.initial_capacity_ah
    })

    # Get predictions
    result = digital_twin.predict(data)

    # Find end-of-life (80% capacity)
    eol_cycle = None
    for i, cap in enumerate(result.hybrid_prediction):
        if cap < input_data.initial_capacity_ah * 0.80:
            eol_cycle = cycles[i]
            break

    return SimulationResult(
        cycles=cycles,
        capacity_physics=result.physics_prediction.tolist(),
        capacity_ml=result.ml_correction.tolist(),
        capacity_hybrid=result.hybrid_prediction.tolist(),
        eol_cycle=eol_cycle,
        metrics={...}
    )
```

### Component 5: Frontend (`pages/index.tsx`)

**What it does**: Web interface for users to run simulations.

```typescript
export default function Home() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSimulation = async (formData: any) => {
    setLoading(true);

    try {
      // Call backend API
      const response = await axios.post("http://localhost:8000/simulate", {
        initial_capacity_ah: formData.initial_capacity_ah,
        temperature_celsius: formData.temperature_celsius,
        discharge_current_a: formData.discharge_current_a,
        num_cycles: formData.num_cycles,
        time_per_cycle_minutes: formData.time_per_cycle_minutes,
        usage_profile: formData.usage_profile,
      });

      // Display results
      setResults(response.data);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <Hero />
      <SimulatorForm onSimulate={handleSimulation} />
      {results && <ResultsDashboard results={results} />}
      <TechStack />
      <Footer />
    </div>
  );
}
```

**Key Features**:

- Input validation on form
- Real-time loading state
- Error handling
- Results visualization with Recharts

---

## How to Use

### 1. Start the System

**One-click startup:**

```bash
# Double-click START_VOLTWIN.bat
# Or run in terminal:
START_VOLTWIN.bat
```

This will:

- Kill old Python/Node processes
- Start FastAPI backend on port 8000
- Start Next.js frontend on port 3000
- Open browser to http://localhost:3000

### 2. Use the Web Interface

**Home Page** (`http://localhost:3000`)

- ✅ Enter battery parameters in the form
- ✅ Click "Run Simulation"
- ✅ View results with interactive charts

**Input Parameters:**

- **Initial Capacity (Ah)**: 0.1 - 500 (your battery's rated capacity)
- **Temperature (°C)**: 15 - 60 (operating temperature)
- **Discharge Current (A)**: 0.1 - 50 (how fast battery discharges)
- **Number of Cycles**: 1 - 5000 (how many charge/discharge cycles)
- **Time Per Cycle (minutes)**: 10 - 1440 (duration of each cycle)
- **Usage Profile**: Light / Standard / Heavy

**Output:**

- 📊 Three capacity curves (Physics / ML / Hybrid)
- 📉 Degradation rate
- ⚠️ End-of-Life cycle (when capacity reaches 80%)
- 📈 Performance metrics (MSE, MAE, R²)

### 3. Use the API Directly

**Endpoint**: `POST http://localhost:8000/simulate`

**cURL example:**

```bash
curl -X POST "http://localhost:8000/api/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "initial_capacity_ah": 2.0,
    "temperature_celsius": 40,
    "discharge_current_a": 1.5,
    "num_cycles": 500,
    "time_per_cycle_minutes": 60,
    "usage_profile": "standard"
  }'
```

**Python example:**

```python
import requests
import json

response = requests.post(
    'http://localhost:8000/simulate',
    json={
        'initial_capacity_ah': 2.0,
        'temperature_celsius': 40,
        'discharge_current_a': 1.5,
        'num_cycles': 500,
        'time_per_cycle_minutes': 60,
        'usage_profile': 'standard'
    }
)

results = response.json()
print(f"End-of-Life cycle: {results['eol_cycle']}")
print(f"Model metrics: {results['metrics']}")
```

### 4. Train Your Own Model

**Using the CLI:**

```bash
cd backend
python -m hybrid_digital_twin train \
  --data-path data/raw/discharge.csv \
  --output-path models/hybrid_twin_model.pkl \
  --config config/default.yaml
```

**Using Python directly:**

```python
from hybrid_digital_twin.core.digital_twin import HybridDigitalTwin
import pandas as pd

# Load data
data = pd.read_csv('backend/data/raw/discharge.csv')

# Train model
twin = HybridDigitalTwin()
metrics = twin.fit(data, target_column='Capacity')

print(f"Model MSE: {metrics['mse']}")
print(f"Model R²: {metrics['r2']}")

# Save model
twin.save('backend/models/hybrid_twin_model.pkl')
```

### 5. Advanced Usage

**Access API documentation:**

```
http://localhost:8000/docs
```

This shows interactive Swagger documentation for all endpoints.

**Check health:**

```bash
curl http://localhost:8000/health
```

**Stop services:**

```bash
# Close the command windows, or:
taskkill /F /IM node.exe      # Kill frontend
taskkill /F /IM python.exe     # Kill backend
```

---

## Summary

**VoltTwin** is a complete, production-grade hybrid digital twin system that:

✅ **Combines physics and ML** for accurate battery predictions
✅ **Provides a web interface** for easy interaction
✅ **Exposes REST API** for integration with other systems
✅ **Includes training pipeline** to improve with new data
✅ **Uses real battery data** (170K+ rows)
✅ **Explains predictions** through physics and corrections
✅ **Handles edge cases** with proper validation and error handling

The hybrid approach is superior to either pure physics or pure ML alone because it:

- 🎯 Learns from data (better accuracy)
- 🔬 Respects physics (better extrapolation)
- 🧠 Stays interpretable (explainable AI)
- 🚀 Works in production (reliable, fast)

This makes it ideal for real-world battery management applications where accuracy, reliability, and interpretability are all critical.

---

**Document Version**: 1.0
**Project**: VoltTwin Hybrid Digital Twin
**Last Updated**: December 23, 2025
