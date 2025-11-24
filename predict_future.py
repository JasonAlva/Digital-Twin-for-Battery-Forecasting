"""
Future Battery Life Prediction
Predicts battery degradation under different operating conditions.
"""

import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from hybrid_digital_twin import HybridDigitalTwin

def main():
    print("=" * 60)
    print("Battery Digital Twin - Future Life Prediction")
    print("=" * 60)
    
    # Create plots directory
    plots_dir = Path("plots")
    plots_dir.mkdir(exist_ok=True)
    
    # Load trained model
    print("\n[1/4] Loading trained model...")
    model = HybridDigitalTwin.load_model("models/hybrid_twin_model.pkl")
    print("✓ Model loaded successfully")
    
    # Define prediction scenarios
    print("\n[2/4] Setting up prediction scenarios...")
    future_cycles = np.arange(1, 1001)
    initial_capacity = 2.0  # Ah
    charge_time = 3600  # 1 hour in seconds
    
    # Different temperature scenarios
    temperatures = [15, 25, 35, 45]  # °C
    colors = ['blue', 'green', 'orange', 'red']
    
    print(f"  Predicting {len(future_cycles)} cycles")
    print(f"  Temperature scenarios: {temperatures}°C")
    print(f"  Initial capacity: {initial_capacity} Ah")
    print(f"  Charge time: {charge_time/3600:.1f} hours")
    
    # Generate predictions
    print("\n[3/4] Generating predictions...")
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
    
    eol_results = []
    
    for temp, color in zip(temperatures, colors):
        print(f"  Predicting at {temp}°C...")
        
        predictions = model.predict_future(
            cycles=future_cycles,
            temperature=temp,
            charge_time=charge_time,
            initial_capacity=initial_capacity
        )
        
        # Plot 1: Capacity degradation
        ax1.plot(
            future_cycles, 
            predictions.hybrid_prediction,
            label=f'{temp}°C - Hybrid',
            linewidth=2.5,
            color=color,
            alpha=0.8
        )
        
        ax1.plot(
            future_cycles, 
            predictions.physics_prediction,
            label=f'{temp}°C - Physics',
            linewidth=1.5,
            linestyle='--',
            color=color,
            alpha=0.5
        )
        
        # Find end-of-life (80% capacity)
        eol_threshold = initial_capacity * 0.8
        eol_idx = np.where(predictions.hybrid_prediction < eol_threshold)[0]
        
        if len(eol_idx) > 0:
            eol_cycle = future_cycles[eol_idx[0]]
            eol_capacity = predictions.hybrid_prediction[eol_idx[0]]
            eol_results.append({
                'temperature': temp,
                'eol_cycle': eol_cycle,
                'eol_capacity': eol_capacity
            })
            
            # Mark end-of-life point
            ax1.scatter([eol_cycle], [eol_capacity], 
                       color=color, s=100, zorder=5, marker='X')
            ax1.axvline(x=eol_cycle, color=color, linestyle=':', alpha=0.3)
        else:
            eol_results.append({
                'temperature': temp,
                'eol_cycle': '>1000',
                'eol_capacity': predictions.hybrid_prediction[-1]
            })
        
        # Plot 2: ML Correction over time
        ax2.plot(
            future_cycles,
            predictions.ml_correction,
            label=f'{temp}°C',
            linewidth=2,
            color=color,
            alpha=0.7
        )
    
    # Configure Plot 1
    ax1.axhline(y=initial_capacity * 0.8, color='red', linestyle='--', 
                linewidth=2, label='80% Capacity (End of Life)', alpha=0.7)
    ax1.set_xlabel('Cycle Number', fontsize=12)
    ax1.set_ylabel('Battery Capacity (Ah)', fontsize=12)
    ax1.set_title('Battery Degradation Prediction at Different Temperatures', 
                  fontsize=14, fontweight='bold')
    ax1.legend(fontsize=9, loc='best', ncol=2)
    ax1.grid(True, alpha=0.3)
    ax1.set_xlim(0, 1000)
    
    # Configure Plot 2
    ax2.axhline(y=0, color='black', linestyle='--', linewidth=1, alpha=0.5)
    ax2.set_xlabel('Cycle Number', fontsize=12)
    ax2.set_ylabel('ML Correction (Ah)', fontsize=12)
    ax2.set_title('Machine Learning Correction Over Battery Life', 
                  fontsize=14, fontweight='bold')
    ax2.legend(fontsize=10, loc='best')
    ax2.grid(True, alpha=0.3)
    ax2.set_xlim(0, 1000)
    
    plt.tight_layout()
    
    # Save figure
    output_path = plots_dir / 'future_predictions.png'
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"✓ Saved to {output_path}")
    
    # Display results
    print("\n[4/4] End-of-Life Predictions:")
    print("\n  Temperature | EOL Cycle | EOL Capacity | Lifespan")
    print("  " + "-" * 55)
    
    for result in eol_results:
        temp = result['temperature']
        eol = result['eol_cycle']
        cap = result['eol_capacity']
        
        if isinstance(eol, str):
            print(f"  {temp:>11}°C | {eol:>9} | {cap:>12.4f} Ah | >1000 cycles")
        else:
            print(f"  {temp:>11}°C | {eol:>9} | {cap:>12.4f} Ah | {eol} cycles")
    
    # Calculate temperature impact
    if len([r for r in eol_results if isinstance(r['eol_cycle'], int)]) >= 2:
        valid_results = [r for r in eol_results if isinstance(r['eol_cycle'], int)]
        temp_diff = valid_results[-1]['temperature'] - valid_results[0]['temperature']
        cycle_diff = valid_results[0]['eol_cycle'] - valid_results[-1]['eol_cycle']
        
        print(f"\n  Temperature Impact:")
        print(f"    {temp_diff}°C increase → {cycle_diff} cycles reduction")
        print(f"    ~{cycle_diff/temp_diff:.1f} cycles lost per °C increase")
    
    plt.show()
    
    print("\n" + "=" * 60)
    print("✓ Future prediction complete!")
    print("=" * 60)
    print("\nKey Insights:")
    print("  • Higher temperatures accelerate battery degradation")
    print("  • ML correction adapts to different operating conditions")
    print("  • Optimal operating temperature: 15-25°C")
    print("  • Avoid prolonged operation above 35°C")

if __name__ == "__main__":
    main()
