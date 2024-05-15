import joblib
import sys

def load_model(model_path):
    return joblib.load(model_path)

def predict(model, input_data):
    return model.predict(input_data)

if __name__ == "__main__":
    input_data = sys.stdin.read()
    model = load_model("src/utils/py/model.pkl")
    # print(input_data)
    predictions = predict(model, [input_data])
    print(predictions[0])
