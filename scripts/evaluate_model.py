import os
import sys
import numpy as np
from pathlib import Path
from PIL import Image
import onnxruntime as ort

CLASSES = ["accessories", "bottoms", "dresses", "outerwear", "shoes", "tops"]

def preprocess_image(image_path):
    img = Image.open(image_path).convert("RGB").resize((224, 224))
    arr = np.array(img).astype(np.float32) / 255.0

    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)

    norm = (arr - mean) / std
    tensor = norm.transpose(2, 0, 1) # HWC to CHW
    tensor = np.expand_dims(tensor, axis=0) # [1, 3, 224, 224]
    return tensor

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=-1, keepdims=True)

def evaluate():
    base_dir = Path("c:/Users/ASUS/Desktop/PIncher")
    model_path = base_dir / "models" / "pincher_clothing_model.onnx"
    val_dir = base_dir / "dataset" / "val"

    print("=" * 60)
    print(" Evaluating ONNX Multi-Class Clothing & Footwear Model")
    print(f" Model: {model_path}")
    print("=" * 60)

    session = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
    input_name = session.get_inputs()[0].name

    results_by_class = {c: {"correct": 0, "total": 0} for c in CLASSES}

    for cat in CLASSES:
        cat_dir = val_dir / cat
        if not cat_dir.exists():
            continue

        images = list(cat_dir.glob("*.jpg")) + list(cat_dir.glob("*.png"))
        for img_p in images:
            try:
                tensor = preprocess_image(img_p)
                outputs = session.run(None, {input_name: tensor})
                scores = outputs[0][0]
                probs = softmax(scores)
                pred_idx = np.argmax(probs)
                pred_class = CLASSES[pred_idx]

                results_by_class[cat]["total"] += 1
                if pred_class == cat:
                    results_by_class[cat]["correct"] += 1
            except Exception as e:
                continue

    print("\n--- Accuracy Benchmark Results ---")
    print(f"{'Category':<15} | {'Samples':<10} | {'Correct':<10} | {'Accuracy':<10}")
    print("-" * 55)

    overall_correct = 0
    overall_total = 0

    for cat, res in results_by_class.items():
        total = res["total"]
        correct = res["correct"]
        acc = (correct / total * 100) if total > 0 else 0.0
        overall_correct += correct
        overall_total += total
        print(f"{cat.capitalize():<15} | {total:<10} | {correct:<10} | {acc:.1f}%")

    overall_acc = (overall_correct / overall_total * 100) if overall_total > 0 else 0.0
    print("-" * 55)
    print(f"Overall Multi-Class Accuracy: {overall_acc:.2f}%\n")

if __name__ == "__main__":
    evaluate()
