"""
Quick Implementation Viewer
Shows your improved model results immediately.
"""

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
from hybrid_digital_twin import HybridDigitalTwin, BatteryDataLoader

def main():
    print("\n" + "="*70)
    print("🔋 BATTERY DIGITAL TWIN - IMPLEMENTATION VIEWER")
    print("="*70)
    
    # Check what models exist
    print("\n📦 Available Models:")
    original_exists = Path("models/hybrid_twin_model.pkl").exists()
    improved_exists = Path("models/improved_model.pkl").exists()
    
    if original_exists:
        print("  ✅ Original Model: models/hybrid_twin_model.pkl")
    if improved_exists:
        print("  ✅ Improved Model: models/improved_model.pkl")
    
    if not original_exists and not improved_exists:
        print("  ❌ No models found. Please train a model first.")
        return
    
    # Load the best available model
    if improved_exists:
        model_path = "models/improved_model.pkl"
        model_name = "Improved Model"
        print(f"\n✨ Using: {model_name}")
    else:
        model_path = "models/hybrid_twin_model.pkl"
        model_name = "Original Model"
        print(f"\n✨ Using: {model_name}")
    
    model = HybridDigitalTwin.load_model(model_path)
    
    # Quick prediction demo
    print("\n" + "-"*70)
    print("🔮 FUTURE PREDICTION DEMO")
    print("-"*70)
    
    temperatures = [20, 25, 30, 35, 40]
    print(f"\nPredicting battery life at different temperatures...")
    print(f"Initial Capacity: 2.0 Ah")
    print(f"Charge Time: 1 hour")
    print(f"Prediction Range: 1-1000 cycles\n")
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 6))
    
    eol_data = []
    
    for temp in temperatures:
        cycles = np.arange(1, 1001)
        predictions = model.predict_future(
            cycles=cycles,
            temperature=temp,
            charge_time=3600.0,
            initial_capacity=2.0
        )
        
        # Plot capacity degradation
        ax1.plot(cycles, predictions.hybrid_prediction, 
                label=f'{temp}°C', linewidth=2, alpha=0.8)
        
        # Find EOL (80% capacity)
        eol_idx = np.where(predictions.hybrid_prediction < 1.6)[0]
        if len(eol_idx) > 0:
            eol_cycle = cycles[eol_idx[0]]
            eol_data.append(eol_cycle)
            ax1.scatter([eol_cycle], [1.6], s=100, zorder=5)
        else:
            eol_data.append(1000)
    
    # Configure plot 1
    ax1.axhline(y=1.6, color='red', linestyle='--', linewidth=2, 
                label='80% Capacity (EOL)', alpha=0.7)
    ax1.set_xlabel('Cycle Number', fontsize=12, fontweight='bold')
    ax1.set_ylabel('Battery Capacity (Ah)', fontsize=12, fontweight='bold')
    ax1.set_title('Battery Degradation at Different Temperatures', 
                  fontsize=14, fontweight='bold')
    ax1.legend(fontsize=10, loc='best')
    ax1.grid(True, alpha=0.3)
    
    # Plot 2: EOL comparison
    colors = plt.cm.RdYlGn_r(np.linspace(0.2, 0.8, len(temperatures)))
    bars = ax2.bar(range(len(temperatures)), eol_data, color=colors, alpha=0.8)
    ax2.set_xticks(range(len(temperatures)))
    ax2.set_xticklabels([f'{t}°C' for t in temperatures])
    ax2.set_ylabel('End-of-Life Cycle', fontsize=12, fontweight='bold')
    ax2.set_xlabel('Operating Temperature', fontsize=12, fontweight='bold')
    ax2.set_title('Temperature Impact on Battery Lifespan', 
                  fontsize=14, fontweight='bold')
    ax2.grid(True, alpha=0.3, axis='y')
    
    # Add value labels on bars
    for i, (bar, val) in enumerate(zip(bars, eol_data)):
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height,
                f'{int(val)}', ha='center', va='bottom', 
                fontsize=10, fontweight='bold')
    
    plt.tight_layout()
    
    # Save figure
    output_path = Path("plots/quick_view.png")
    output_path.parent.mkdir(exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"✅ Visualization saved to: {output_path}")
    
    # Display results table
    print("\n" + "-"*70)
    print("📊 END-OF-LIFE PREDICTIONS")
    print("-"*70)
    print(f"\n{'Temperature':<15} {'EOL Cycle':<15} {'Lifespan Impact':<20}")
    print("-"*70)
    
    baseline_eol = eol_data[temperatures.index(25)]  # 25°C as baseline
    
    for temp, eol in zip(temperatures, eol_data):
        impact = eol - baseline_eol
        impact_str = f"{impact:+d} cycles" if impact != 0 else "Baseline"
        print(f"{temp}°C{'':<11} {eol:<15} {impact_str:<20}")
    
    print("-"*70)
    
    # Key insights
    print("\n" + "="*70)
    print("💡 KEY INSIGHTS")
    print("="*70)
    
    temp_diff = temperatures[-1] - temperatures[0]
    cycle_diff = eol_data[0] - eol_data[-1]
    
    print(f"\n1. Temperature Impact:")
    print(f"   • {temp_diff}°C increase → {cycle_diff} cycles reduction")
    print(f"   • ~{cycle_diff/temp_diff:.1f} cycles lost per °C increase")
    
    print(f"\n2. Optimal Operating Conditions:")
    print(f"   • Best temperature: {temperatures[eol_data.index(max(eol_data))]}°C")
    print(f"   • Maximum lifespan: {max(eol_data)} cycles")
    
    print(f"\n3. Recommendations:")
    if max(eol_data) > 800:
        print(f"   ✅ Excellent: Battery can last {max(eol_data)} cycles at optimal temp")
    elif max(eol_data) > 500:
        print(f"   ⚠️  Good: Battery will last {max(eol_data)} cycles")
    else:
        print(f"   ❌ Warning: Battery lifespan only {max(eol_data)} cycles")
    
    print(f"   • Keep temperature below 30°C for best results")
    print(f"   • Avoid prolonged operation above 35°C")
    
    # Show the plot
    print("\n" + "="*70)
    print("📈 Opening visualization...")
    print("="*70)
    plt.show()
    
    print("\n✅ Done! Check plots/quick_view.png for saved visualization.")
    
    # Next steps
    print("\n" + "="*70)
    print("🚀 NEXT STEPS")
    print("="*70)
    print("\n1. Interactive Dashboard (once Streamlit installs):")
    print("   streamlit run dashboard.py")
    print("\n2. REST API:")
    print("   uvicorn api:app --reload")
    print("\n3. More Visualizations:")
    print("   python visualize_results.py")
    print("   python predict_future.py")
    print("\n4. Documentation:")
    print("   Read IMPLEMENTATION_SUMMARY.md")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
