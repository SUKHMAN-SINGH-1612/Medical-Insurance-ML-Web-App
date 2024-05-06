from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np

app = Flask(__name__)

# Load the machine learning model
model_path = 'random-forest-model.pkl'
with open(model_path, 'rb') as model_file:
    model = pickle.load(model_file)

@app.route('/')
def home():
    # Serve the HTML form
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Extract data from the form submission or JSON body
        if request.json:
            data = request.json
            inputs = [float(i) for i in data['inputs']]
        else:
            data = request.form.to_dict()
            inputs = [float(data[key]) for key in data]
        
        # Assuming your model expects a 2D array for a single sample
        prediction = model.predict([inputs])
        
        # Convert prediction to int or process as needed
        prediction = prediction[0]
        
        # Return the prediction as a JSON response
        return jsonify({'prediction': prediction})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)