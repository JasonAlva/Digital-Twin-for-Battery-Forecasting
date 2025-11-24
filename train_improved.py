"""
Train Improved Model
Uses better configuration and random data splitting for improved generalization.
"""

from hybrid_digital_twin import HybridDigitalTwin, BatteryDataLoader
from pathlib import Path
from sklearn.model_selection import train_test_split
import yaml
import json

def main():
    print("=" * 60)
    print("Training Improved Hybrid Digital Twin Model")
    print("=" * 60)
    
    # Load improved configuration
    print("\n[1/6] Loading improved configuration...")
    with open('improved_config.yaml', 'r') as f:
        config = yaml.safe_load(f)
    print("✓ Configuration loaded")
    print(f"  Network: {config['ml_model']['hidden_layers']}")
    print(f"  Dropout: {config['ml_model']['dropout_rate']}")
    print(f"  L2 Regularization: {config['ml_model']['l2_regularization']}")
    
    # Load data
    print("\n[2/6] Loading battery data...")
    loader = BatteryDataLoader(data_dir=Path("data"))
    data = loader.load_csv("raw/discharge.csv")
    print(f"✓ Loaded {len(data)} data points")
    
    # Use RANDOM split instead of sequential for better generalization
    print("\n[3/6] Splitting data (random split for better generalization)...")
    train_data, test_data = train_test_split(
        data, 
        test_size=0.2, 
        random_state=42,
        shuffle=True  # This is key for better generalization!
    )
    
    print(f"✓ Training samples: {len(train_data):,}")
    print(f"✓ Test samples: {len(test_data):,}")
    
    # Train model with improved config
    print("\n[4/6] Training improved model...")
    print("  This may take a few minutes...")
    
    twin = HybridDigitalTwin(config=config)
    metrics = twin.fit(train_data, target_column="Capacity")
    
    print("\n✓ Training complete!")
    
    # Display training metrics
    print("\n  Training Metrics:")
    for key, value in sorted(metrics.items()):
        if isinstance(value, float) and 'train' in key:
            print(f"    {key}: {value:.6f}")
    
    print("\n  Validation Metrics:")
    for key, value in sorted(metrics.items()):
        if isinstance(value, float) and 'val' in key:
            print(f"    {key}: {value:.6f}")
    
    # Evaluate on test set
    print("\n[5/6] Evaluating on test set...")
    test_metrics = twin.evaluate(test_data)
    
    print("\n  Test Metrics:")
    for key, value in sorted(test_metrics.items()):
        if isinstance(value, float):
            print(f"    {key}: {value:.6f}")
    
    # Compare with original model
    print("\n[6/6] Comparing with original model...")
    try:
        original_model = HybridDigitalTwin.load_model("models/hybrid_twin_model.pkl")
        original_test_metrics = original_model.evaluate(test_data)
        
        print("\n  Performance Comparison:")
        print("  " + "-" * 50)
        print(f"  {'Metric':<15} | {'Original':<12} | {'Improved':<12} | {'Change':<10}")
        print("  " + "-" * 50)
        
        for key in ['rmse', 'mae', 'r2', 'mape']:
            if key in test_metrics and key in original_test_metrics:
                orig = original_test_metrics[key]
                impr = test_metrics[key]
                
                if key == 'r2':
                    # For R², higher is better
                    change = impr - orig
                    symbol = "↑" if change > 0 else "↓"
                else:
                    # For errors, lower is better
                    change = orig - impr
                    symbol = "↑" if change > 0 else "↓"
                
                print(f"  {key.upper():<15} | {orig:>12.6f} | {impr:>12.6f} | {symbol} {abs(change):>8.6f}")
        
        print("  " + "-" * 50)
        
        # Determine which is better
        if test_metrics['rmse'] < original_test_metrics['rmse']:
            print("\n  ✅ Improved model performs BETTER!")
            print(f"     RMSE reduced by {(original_test_metrics['rmse'] - test_metrics['rmse']):.6f}")
        else:
            print("\n  ⚠️  Original model still performs better")
            print("     Try adjusting hyperparameters further")
            
    except Exception as e:
        print(f"\n  ⚠️  Could not load original model for comparison: {e}")
    
    # Save improved model
    print("\n[Saving] Saving improved model...")
    twin.save_model("models/improved_model.pkl")
    print("✓ Model saved to models/improved_model.pkl")
    
    # Save metrics to JSON for later analysis
    results = {
        'training_metrics': {k: float(v) if isinstance(v, (int, float)) else v 
                           for k, v in metrics.items()},
        'test_metrics': {k: float(v) if isinstance(v, (int, float)) else v 
                        for k, v in test_metrics.items()},
        'configuration': config
    }
    
    with open('results/improved_model_results.json', 'w') as f:
        Path('results').mkdir(exist_ok=True)
        json.dump(results, f, indent=2)
    print("✓ Results saved to results/improved_model_results.json")
    
    print("\n" + "=" * 60)
    print("✓ Improved model training complete!")
    print("=" * 60)
    
    # Provide recommendations
    print("\n💡 Next Steps:")
    if test_metrics['r2'] > 0.8:
        print("  ✅ Model shows good performance!")
        print("  → Try visualizing results: python visualize_results.py")
        print("  → Make future predictions: python predict_future.py")
    elif test_metrics['r2'] > 0.5:
        print("  ⚠️  Model shows moderate performance")
        print("  → Try further hyperparameter tuning")
        print("  → Consider collecting more diverse training data")
    else:
        print("  ❌ Model needs significant improvement")
        print("  → Review data quality and preprocessing")
        print("  → Try simpler model architecture")
        print("  → Check for data leakage or errors")

if __name__ == "__main__":
    main()
