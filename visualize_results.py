"""
Visualize Training Results
Creates comprehensive plots to understand model performance.
"""

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path
from hybrid_digital_twin import HybridDigitalTwin, BatteryDataLoader

def main():
    print("=" * 60)
    print("Battery Digital Twin - Results Visualization")
    print("=" * 60)
    
    # Create plots directory
    plots_dir = Path("plots")
    plots_dir.mkdir(exist_ok=True)
    
    # Load model and data
    print("\n[1/5] Loading trained model...")
    model = HybridDigitalTwin.load_model("models/hybrid_twin_model.pkl")
    print("✓ Model loaded successfully")
    
    print("\n[2/5] Loading battery data...")
    loader = BatteryDataLoader(data_dir=Path("data"))
    data = loader.load_csv("raw/discharge.csv")
    print(f"✓ Loaded {len(data)} data points")
    
    # Make predictions
    print("\n[3/5] Generating predictions...")
    result = model.predict(data, return_components=True)
    actual = data['Capacity'].values
    print("✓ Predictions generated")
    
    # Calculate errors
    error = actual - result.hybrid_prediction
    physics_error = actual - result.physics_prediction
    
    # Create comprehensive visualization
    print("\n[4/5] Creating visualizations...")
    
    fig = plt.figure(figsize=(16, 12))
    
    # Plot 1: Predictions vs Actual (first 1000 samples)
    ax1 = plt.subplot(3, 2, 1)
    samples = min(1000, len(actual))
    ax1.plot(actual[:samples], label='Actual', alpha=0.8, linewidth=2, color='blue')
    ax1.plot(result.physics_prediction[:samples], label='Physics Model', 
             alpha=0.6, linewidth=1.5, linestyle='--', color='orange')
    ax1.plot(result.hybrid_prediction[:samples], label='Hybrid Model', 
             alpha=0.8, linewidth=2, color='green')
    ax1.set_xlabel('Sample Index', fontsize=10)
    ax1.set_ylabel('Capacity (Ah)', fontsize=10)
    ax1.set_title('Battery Capacity: Actual vs Predictions', fontsize=12, fontweight='bold')
    ax1.legend(fontsize=9)
    ax1.grid(True, alpha=0.3)
    
    # Plot 2: Prediction Error Distribution
    ax2 = plt.subplot(3, 2, 2)
    ax2.scatter(actual, error, alpha=0.3, s=10, color='red')
    ax2.axhline(y=0, color='black', linestyle='--', linewidth=2)
    ax2.set_xlabel('Actual Capacity (Ah)', fontsize=10)
    ax2.set_ylabel('Prediction Error (Ah)', fontsize=10)
    ax2.set_title('Hybrid Model: Prediction Error vs Actual', fontsize=12, fontweight='bold')
    ax2.grid(True, alpha=0.3)
    
    # Plot 3: Error Histogram
    ax3 = plt.subplot(3, 2, 3)
    ax3.hist(error, bins=50, edgecolor='black', alpha=0.7, color='red')
    ax3.axvline(x=0, color='black', linestyle='--', linewidth=2)
    ax3.axvline(x=np.mean(error), color='blue', linestyle='--', linewidth=2, 
                label=f'Mean: {np.mean(error):.4f}')
    ax3.set_xlabel('Prediction Error (Ah)', fontsize=10)
    ax3.set_ylabel('Frequency', fontsize=10)
    ax3.set_title('Error Distribution', fontsize=12, fontweight='bold')
    ax3.legend(fontsize=9)
    ax3.grid(True, alpha=0.3)
    
    # Plot 4: ML Correction Analysis
    ax4 = plt.subplot(3, 2, 4)
    ax4.scatter(result.physics_prediction[:samples], result.ml_correction[:samples], 
                alpha=0.5, s=10, color='purple')
    ax4.axhline(y=0, color='black', linestyle='--', linewidth=2)
    ax4.set_xlabel('Physics Prediction (Ah)', fontsize=10)
    ax4.set_ylabel('ML Correction (Ah)', fontsize=10)
    ax4.set_title('ML Correction vs Physics Prediction', fontsize=12, fontweight='bold')
    ax4.grid(True, alpha=0.3)
    
    # Plot 5: Capacity Degradation Over Cycles
    ax5 = plt.subplot(3, 2, 5)
    if 'id_cycle' in data.columns:
        cycle_data = data.groupby('id_cycle').agg({
            'Capacity': 'mean'
        }).reset_index()
        
        ax5.plot(cycle_data['id_cycle'], cycle_data['Capacity'], 
                marker='o', markersize=3, label='Actual', alpha=0.7, linewidth=2, color='blue')
        ax5.set_xlabel('Cycle Number', fontsize=10)
        ax5.set_ylabel('Capacity (Ah)', fontsize=10)
        ax5.set_title('Battery Degradation Over Cycles', fontsize=12, fontweight='bold')
        ax5.legend(fontsize=9)
        ax5.grid(True, alpha=0.3)
    
    # Plot 6: Model Comparison (Physics vs Hybrid)
    ax6 = plt.subplot(3, 2, 6)
    metrics_comparison = {
        'Physics RMSE': np.sqrt(np.mean(physics_error**2)),
        'Hybrid RMSE': np.sqrt(np.mean(error**2)),
        'Physics MAE': np.mean(np.abs(physics_error)),
        'Hybrid MAE': np.mean(np.abs(error))
    }
    
    bars = ax6.bar(range(len(metrics_comparison)), list(metrics_comparison.values()), 
                   color=['orange', 'green', 'orange', 'green'], alpha=0.7)
    ax6.set_xticks(range(len(metrics_comparison)))
    ax6.set_xticklabels(list(metrics_comparison.keys()), rotation=45, ha='right', fontsize=9)
    ax6.set_ylabel('Error (Ah)', fontsize=10)
    ax6.set_title('Model Performance Comparison', fontsize=12, fontweight='bold')
    ax6.grid(True, alpha=0.3, axis='y')
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax6.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.4f}', ha='center', va='bottom', fontsize=8)
    
    plt.tight_layout()
    
    # Save figure
    output_path = plots_dir / 'training_results_comprehensive.png'
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    print(f"✓ Saved to {output_path}")
    
    # Display statistics
    print("\n[5/5] Performance Statistics:")
    print(f"\n  Hybrid Model:")
    print(f"    RMSE: {np.sqrt(np.mean(error**2)):.6f} Ah")
    print(f"    MAE:  {np.mean(np.abs(error)):.6f} Ah")
    print(f"    Max Error: {np.max(np.abs(error)):.6f} Ah")
    print(f"    Mean Error: {np.mean(error):.6f} Ah")
    
    print(f"\n  Physics Model:")
    print(f"    RMSE: {np.sqrt(np.mean(physics_error**2)):.6f} Ah")
    print(f"    MAE:  {np.mean(np.abs(physics_error)):.6f} Ah")
    
    print(f"\n  Improvement:")
    improvement = (np.sqrt(np.mean(physics_error**2)) - np.sqrt(np.mean(error**2))) / np.sqrt(np.mean(physics_error**2)) * 100
    print(f"    RMSE Reduction: {improvement:.2f}%")
    
    plt.show()
    
    print("\n" + "=" * 60)
    print("✓ Visualization complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
