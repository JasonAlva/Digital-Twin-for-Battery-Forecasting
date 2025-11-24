"""
Interactive Battery Digital Twin Dashboard
Real-time battery health monitoring and prediction interface.
"""

import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from hybrid_digital_twin import HybridDigitalTwin
from pathlib import Path

# Page configuration
st.set_page_config(
    page_title="Battery Digital Twin Dashboard",
    page_icon="🔋",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        padding: 1rem 0;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .warning-box {
        background-color: #fff3cd;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ffc107;
    }
    .success-box {
        background-color: #d4edda;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #28a745;
    }
</style>
""", unsafe_allow_html=True)

# Title
st.markdown('<div class="main-header">🔋 Battery Digital Twin Dashboard</div>', unsafe_allow_html=True)
st.markdown("---")

# Load model
@st.cache_resource
def load_model():
    try:
        model_path = Path("models/improved_model.pkl")
        if model_path.exists():
            return HybridDigitalTwin.load_model(str(model_path)), "Improved Model"
        else:
            return HybridDigitalTwin.load_model("models/hybrid_twin_model.pkl"), "Original Model"
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None, None

model, model_name = load_model()

if model is None:
    st.error("❌ Could not load model. Please train a model first.")
    st.stop()

st.success(f"✅ {model_name} loaded successfully!")

# Sidebar - Input Parameters
st.sidebar.header("⚙️ Prediction Parameters")

st.sidebar.subheader("Operating Conditions")
temperature = st.sidebar.slider(
    "🌡️ Temperature (°C)", 
    min_value=10, 
    max_value=50, 
    value=25,
    help="Operating temperature affects degradation rate"
)

charge_time = st.sidebar.slider(
    "⏱️ Charge Time (hours)", 
    min_value=0.5, 
    max_value=4.0, 
    value=1.0,
    step=0.5,
    help="Time to fully charge the battery"
)

initial_capacity = st.sidebar.number_input(
    "⚡ Initial Capacity (Ah)", 
    min_value=1.0, 
    max_value=5.0, 
    value=2.0,
    step=0.1,
    help="Battery capacity when new"
)

st.sidebar.subheader("Prediction Range")
max_cycles = st.sidebar.slider(
    "📊 Maximum Cycles", 
    min_value=100, 
    max_value=2000, 
    value=1000,
    step=100,
    help="Number of charge/discharge cycles to predict"
)

# Generate predictions
with st.spinner("🔄 Generating predictions..."):
    cycles = np.arange(1, max_cycles + 1)
    charge_time_seconds = charge_time * 3600
    
    predictions = model.predict_future(
        cycles=cycles,
        temperature=temperature,
        charge_time=charge_time_seconds,
        initial_capacity=initial_capacity
    )

# Calculate key metrics
eol_threshold = initial_capacity * 0.8
eol_idx = np.where(predictions.hybrid_prediction < eol_threshold)[0]
eol_cycle = cycles[eol_idx[0]] if len(eol_idx) > 0 else max_cycles
final_capacity = predictions.hybrid_prediction[-1]
capacity_retention = (final_capacity / initial_capacity) * 100

# Current capacity at different milestones
capacity_100 = predictions.hybrid_prediction[min(99, len(predictions.hybrid_prediction)-1)]
capacity_500 = predictions.hybrid_prediction[min(499, len(predictions.hybrid_prediction)-1)]

# Display Key Metrics
st.subheader("📊 Key Performance Indicators")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        label="🔋 End of Life Cycle",
        value=f"{eol_cycle:,}",
        delta=f"{eol_cycle - 500} vs 500 cycles" if eol_cycle != max_cycles else "Beyond prediction",
        help="Cycle when capacity drops below 80%"
    )

with col2:
    st.metric(
        label="🌡️ Operating Temp",
        value=f"{temperature}°C",
        delta=f"{temperature - 25}°C vs optimal" if temperature != 25 else "Optimal",
        delta_color="inverse",
        help="Current operating temperature"
    )

with col3:
    st.metric(
        label="⚡ Final Capacity",
        value=f"{final_capacity:.3f} Ah",
        delta=f"{((final_capacity/initial_capacity - 1) * 100):.1f}%",
        help=f"Capacity at cycle {max_cycles}"
    )

with col4:
    st.metric(
        label="📈 Retention Rate",
        value=f"{capacity_retention:.1f}%",
        delta=f"{capacity_retention - 80:.1f}% vs EOL",
        help="Percentage of original capacity remaining"
    )

# Warning/Success boxes
if eol_cycle < 500:
    st.markdown(f"""
    <div class="warning-box">
        ⚠️ <strong>Warning:</strong> Battery will reach end-of-life in {eol_cycle} cycles. 
        Consider reducing operating temperature or charge rate.
    </div>
    """, unsafe_allow_html=True)
elif eol_cycle > 800:
    st.markdown(f"""
    <div class="success-box">
        ✅ <strong>Excellent:</strong> Battery expected to last {eol_cycle} cycles. 
        Current operating conditions are optimal.
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# Main Visualization
st.subheader("📈 Battery Degradation Prediction")

# Create interactive plot with Plotly
fig = make_subplots(
    rows=2, cols=1,
    subplot_titles=('Capacity Degradation Over Time', 'ML Correction Analysis'),
    vertical_spacing=0.12,
    row_heights=[0.6, 0.4]
)

# Plot 1: Capacity degradation
fig.add_trace(
    go.Scatter(
        x=cycles,
        y=predictions.physics_prediction,
        name='Physics Model',
        line=dict(color='orange', width=2, dash='dash'),
        hovertemplate='Cycle: %{x}<br>Physics: %{y:.4f} Ah<extra></extra>'
    ),
    row=1, col=1
)

fig.add_trace(
    go.Scatter(
        x=cycles,
        y=predictions.hybrid_prediction,
        name='Hybrid Model',
        line=dict(color='green', width=3),
        hovertemplate='Cycle: %{x}<br>Hybrid: %{y:.4f} Ah<extra></extra>'
    ),
    row=1, col=1
)

# Add EOL threshold line
fig.add_hline(
    y=eol_threshold,
    line_dash="dot",
    line_color="red",
    annotation_text="80% Capacity (End of Life)",
    annotation_position="right",
    row=1, col=1
)

# Mark EOL point
if eol_cycle < max_cycles:
    fig.add_trace(
        go.Scatter(
            x=[eol_cycle],
            y=[predictions.hybrid_prediction[eol_idx[0]]],
            mode='markers',
            name='End of Life',
            marker=dict(color='red', size=15, symbol='x'),
            hovertemplate=f'EOL at Cycle {eol_cycle}<extra></extra>'
        ),
        row=1, col=1
    )

# Plot 2: ML Correction
fig.add_trace(
    go.Scatter(
        x=cycles,
        y=predictions.ml_correction,
        name='ML Correction',
        line=dict(color='purple', width=2),
        fill='tozeroy',
        fillcolor='rgba(128, 0, 128, 0.1)',
        hovertemplate='Cycle: %{x}<br>Correction: %{y:.4f} Ah<extra></extra>'
    ),
    row=2, col=1
)

fig.add_hline(y=0, line_dash="dash", line_color="gray", row=2, col=1)

# Update layout
fig.update_xaxes(title_text="Cycle Number", row=2, col=1)
fig.update_yaxes(title_text="Capacity (Ah)", row=1, col=1)
fig.update_yaxes(title_text="ML Correction (Ah)", row=2, col=1)

fig.update_layout(
    height=700,
    hovermode='x unified',
    showlegend=True,
    legend=dict(
        orientation="h",
        yanchor="bottom",
        y=1.02,
        xanchor="right",
        x=1
    )
)

st.plotly_chart(fig, use_container_width=True)

# Data Table
st.markdown("---")
st.subheader("📋 Detailed Prediction Data")

# Create dataframe with key cycles
key_cycles = [1, 100, 250, 500, 750, 1000]
key_cycles = [c for c in key_cycles if c <= max_cycles]

df_display = pd.DataFrame({
    'Cycle': key_cycles,
    'Physics Prediction (Ah)': [predictions.physics_prediction[c-1] for c in key_cycles],
    'Hybrid Prediction (Ah)': [predictions.hybrid_prediction[c-1] for c in key_cycles],
    'ML Correction (Ah)': [predictions.ml_correction[c-1] for c in key_cycles],
    'Capacity Retention (%)': [(predictions.hybrid_prediction[c-1]/initial_capacity*100) for c in key_cycles]
})

st.dataframe(
    df_display.style.format({
        'Physics Prediction (Ah)': '{:.4f}',
        'Hybrid Prediction (Ah)': '{:.4f}',
        'ML Correction (Ah)': '{:.4f}',
        'Capacity Retention (%)': '{:.2f}%'
    }).background_gradient(subset=['Capacity Retention (%)'], cmap='RdYlGn'),
    use_container_width=True
)

# Download predictions
st.markdown("---")
st.subheader("💾 Export Data")

col1, col2 = st.columns(2)

with col1:
    # Prepare full data for download
    full_df = pd.DataFrame({
        'Cycle': cycles,
        'Physics_Prediction_Ah': predictions.physics_prediction,
        'Hybrid_Prediction_Ah': predictions.hybrid_prediction,
        'ML_Correction_Ah': predictions.ml_correction,
        'Capacity_Retention_Percent': (predictions.hybrid_prediction/initial_capacity*100)
    })
    
    csv = full_df.to_csv(index=False)
    st.download_button(
        label="📥 Download Full Predictions (CSV)",
        data=csv,
        file_name=f"battery_predictions_{temperature}C_{max_cycles}cycles.csv",
        mime="text/csv"
    )

with col2:
    # Summary report
    summary = f"""
    Battery Digital Twin Prediction Report
    =====================================
    
    Operating Conditions:
    - Temperature: {temperature}°C
    - Charge Time: {charge_time} hours
    - Initial Capacity: {initial_capacity} Ah
    
    Predictions (up to {max_cycles} cycles):
    - End of Life Cycle: {eol_cycle}
    - Final Capacity: {final_capacity:.4f} Ah
    - Capacity Retention: {capacity_retention:.2f}%
    
    Model: {model_name}
    Generated: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}
    """
    
    st.download_button(
        label="📄 Download Summary Report (TXT)",
        data=summary,
        file_name=f"battery_report_{temperature}C.txt",
        mime="text/plain"
    )

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: gray; padding: 1rem;'>
    🔋 Battery Digital Twin Dashboard | Powered by Hybrid AI | 
    <a href='https://github.com/Javihaus/Digital-Twin-in-python' target='_blank'>GitHub</a>
</div>
""", unsafe_allow_html=True)
