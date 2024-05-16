import joblib
import sys
import pandas as pd

def load_model(model_path):
    return joblib.load(model_path)

def predict(model, input_data):
    return model.predict(input_data)

def feature_engineering(password):
    length = len(password)
    uppercase_count = sum(c.isupper() for c in password)
    lowercase_count = sum(c.islower() for c in password)
    digit_count = sum(c.isdigit() for c in password)
    special_char_count = sum(not c.isalnum() for c in password)
    return length, uppercase_count, lowercase_count, digit_count, special_char_count

def predict_strength(password, model):
    features = feature_engineering(password) 
    features_df = pd.DataFrame([features], columns=["length", "uppercase_count", "lowercase_count", "digit_count", "special_char_count"])  
    predicted_strength = model.predict(features_df)[0]
    return predicted_strength

if __name__ == "__main__":
    input_data = sys.stdin.read()
    model = load_model("src/utils/py/password_strength_model.joblib")
    predictions = predict_strength(input_data, model)
    print(predictions)
