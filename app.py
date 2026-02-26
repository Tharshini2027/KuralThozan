import os
import sys
from flask import Flask, request, render_template, jsonify
from PIL import Image
import numpy as np
import io

# Initialize Flask app
app = Flask(__name__)

print("=" * 50)
print("🌱 TOMATO DISEASE DETECTOR - TF 2.19.0 COMPATIBLE")
print("=" * 50)

# Try to load model
model = None
class_names = ['tomato_early_blight', 'tomato_healthy', 'tomato_late_blight']

try:
    # Import TensorFlow
    import tensorflow as tf
    print(f"✅ TensorFlow version: {tf.__version__}")
    
    # Load the model (TF 2.19.0 compatible)
    model = tf.keras.models.load_model('tomato_disease_model.keras')
    print("✅ Model loaded successfully!")
    
    # Show model summary
    print("\n📊 Model Summary:")
    model.summary()
    
except Exception as e:
    print(f"❌ Error loading model: {e}")
    print("\n🔧 Troubleshooting steps:")
    print("1. Make sure 'tomato_disease_model.keras' is in the same folder as app.py")
    print("2. Check file size (should be > 10MB)")
    print("3. Try re-saving model from Colab with: model.save('tomato_model.keras', save_format='tf')")
    model = None

# Preprocess image function
def preprocess_image(image):
    # Resize to 224x224 (standard for many models)
    image = image.resize((224, 224))
    # Convert to array and normalize
    image_array = np.array(image) / 255.0
    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)
    return image_array

# Home page route
@app.route('/')
def home():
    return render_template('index.html')

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # If model not loaded, return error
        if model is None:
            return jsonify({
                'error': 'Model not loaded. Check console for errors.',
                'status': 'error',
                'tip': 'Make sure tensorflow==2.19.0 is installed'
            })
        
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded', 'status': 'error'})
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected', 'status': 'error'})
        
        # Read and process image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Get original size for display
        original_width, original_height = image.size
        
        # Preprocess for model
        processed_image = preprocess_image(image)
        
        # Make prediction
        predictions = model.predict(processed_image, verbose=0)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = round(float(predictions[0][predicted_class_idx]) * 100, 2)
        
        # Get class name
        predicted_class = class_names[predicted_class_idx]
        
        # Human-friendly names
        friendly_names = {
            'tomato_early_blight': 'தக்காளி ஆரம்ப பிளைட்',
            'tomato_healthy': 'ஆரோக்கியம்',
            'tomato_late_blight': 'தக்காளி பின் பிளைட்'
        }
        
        # Confidence levels
        if confidence >= 90:
            confidence_level = "Very High"
        elif confidence >= 75:
            confidence_level = "High"
        elif confidence >= 60:
            confidence_level = "Moderate"
        else:
            confidence_level = "Low"
        
        # Detailed treatment advice
        treatments = {
            'tomato_early_blight': {
                'action': 'Remove infected leaves immediately.',
                'chemical': 'Apply copper-based fungicide every 7-10 days.',
                'prevention': 'Water at base, avoid wetting leaves. Improve air circulation.',
                'organic': 'Use neem oil or baking soda spray (1 tbsp baking soda + 1 tsp vegetable oil + 1 gallon water).'
            },
            'tomato_healthy': {
                'action': 'Continue current care practices.',
                'chemical': 'No chemicals needed.',
                'prevention': 'Maintain good spacing (24-36 inches), water consistently, mulch around plants.',
                'organic': 'Apply compost tea for nutrient boost.'
            },
            'tomato_late_blight': {
                'action': 'Destroy severely infected plants to prevent spread.',
                'chemical': 'Use fungicides with chlorothalonil or mancozeb.',
                'prevention': 'Avoid overhead watering. Remove all plant debris at season end.',
                'organic': 'Apply compost tea and ensure proper drainage.'
            }
        }
        
        # Create response
        result = {
            'status': 'success',
            'disease': friendly_names[predicted_class],
            'scientific_name': predicted_class,
            'confidence': confidence,
            'confidence_level': confidence_level,
            'image_info': {
                'original_size': f"{original_width}x{original_height}",
                'processed_size': "224x224"
            },
            'treatment': {
                'immediate_action': treatments[predicted_class]['action'],
                'chemical_treatment': treatments[predicted_class]['chemical'],
                'prevention': treatments[predicted_class]['prevention'],
                'organic_option': treatments[predicted_class]['organic']
            },
            'all_predictions': {
                'early_blight': round(float(predictions[0][0]) * 100, 2),
                'healthy': round(float(predictions[0][1]) * 100, 2),
                'late_blight': round(float(predictions[0][2]) * 100, 2)
            }
        }
        
        # Log prediction to console
        print(f"\n🔍 Prediction made:")
        print(f"   Disease: {result['disease']}")
        print(f"   Confidence: {confidence}% ({confidence_level})")
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({'error': str(e), 'status': 'error'})

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy' if model else 'model_not_loaded',
        'tensorflow_version': tf.__version__ if 'tf' in locals() else 'not_loaded',
        'model_loaded': model is not None
    })

# Run the app
if __name__ == '__main__':
    print("\n✅ Starting Flask server...")
    print(f"📂 Model file: {os.path.exists('tomato_disease_model.keras')}")
    print(f"📁 Templates: {os.path.exists('templates')}")
    print(f"🐍 Python: {sys.version.split()[0]}")
    
    if model:
        print("\n🎯 Ready to detect diseases!")
    else:
        print("\n⚠️ Running in demo mode (model not loaded)")
        print("   Uploads will return sample data")
    
    print("\n🌐 OPEN YOUR BROWSER AND VISIT: http://127.0.0.1:5000")
    print("📡 API Endpoint: http://127.0.0.1:5000/predict")
    print("❤️  Health Check: http://127.0.0.1:5000/health")
    print("=" * 50)
    
    app.run(debug=True, port=5000, host='0.0.0.0')