import os
import sys
import json
import time
from pathlib import Path
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models

# Ensure UTF-8 stdout for Windows consoles
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

CLASSES = ["accessories", "bottoms", "dresses", "outerwear", "shoes", "tops"]

def train_and_export():
    print("=" * 60)
    print(" Training Pincher 6-Class AI Classifier")
    print(f" Target Classes ({len(CLASSES)}): {CLASSES}")
    print("=" * 60)

    base_dir = Path("c:/Users/ASUS/Desktop/PIncher")
    train_dir = base_dir / "dataset" / "train"
    val_dir = base_dir / "dataset" / "val"
    models_dir = base_dir / "models"
    frontend_models_dir = base_dir / "frontend" / "public" / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    frontend_models_dir.mkdir(parents=True, exist_ok=True)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Transforms with rich data augmentation
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(12),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    train_dataset = datasets.ImageFolder(str(train_dir), transform=train_transform)
    val_dataset = datasets.ImageFolder(str(val_dir), transform=val_transform)

    print(f"Dataset loaded: {len(train_dataset)} training samples, {len(val_dataset)} validation samples.")
    print(f"Class Mapping: {train_dataset.class_to_idx}")

    # Compute class weights for balanced loss
    class_counts = [0] * len(CLASSES)
    for _, label in train_dataset.samples:
        class_counts[label] += 1
    total_samples = len(train_dataset)
    class_weights = [total_samples / (len(CLASSES) * max(1, c)) for c in class_counts]
    weight_tensor = torch.tensor(class_weights, dtype=torch.float).to(device)
    print(f"Class counts: {dict(zip(CLASSES, class_counts))}")
    print(f"Class weights: {[round(w, 2) for w in class_weights]}")

    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False, num_workers=0)

    # Initialize MobileNetV3 Small
    print("\nLoading pre-trained MobileNetV3 Small backbone...")
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)

    # Fine-tune the backbone
    for param in model.features.parameters():
        param.requires_grad = True

    in_features = model.classifier[0].in_features
    model.classifier = nn.Sequential(
        nn.Linear(in_features, 256),
        nn.Hardswish(),
        nn.Dropout(p=0.2),
        nn.Linear(256, len(CLASSES))
    )
    model = model.to(device)

    criterion = nn.CrossEntropyLoss(weight=weight_tensor)
    optimizer = optim.AdamW(model.parameters(), lr=0.0008, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=8)

    epochs = 8
    best_acc = 0.0

    print(f"\nStarting training for {epochs} epochs...")
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        start_time = time.time()
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

        scheduler.step()
        train_loss = running_loss / total
        train_acc = (correct / total) * 100.0

        # Validation Phase
        model.eval()
        val_loss = 0.0
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, predicted = outputs.max(1)
                val_total += labels.size(0)
                val_correct += predicted.eq(labels).sum().item()

        val_loss = val_loss / (val_total if val_total > 0 else 1)
        val_acc = (val_correct / (val_total if val_total > 0 else 1)) * 100.0
        elapsed = time.time() - start_time

        print(f"Epoch [{epoch+1:02d}/{epochs:02d}] | Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.1f}% | Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.1f}% | Time: {elapsed:.1f}s")

    # Export to ONNX
    print("\n" + "=" * 60)
    print(" Exporting High-Performance MobileNetV3 to ONNX")
    print("=" * 60)
    model.eval()
    dummy_input = torch.randn(1, 3, 224, 224, device=device)

    onnx_dest_1 = models_dir / "pincher_clothing_model.onnx"
    onnx_dest_2 = frontend_models_dir / "pincher_clothing_model.onnx"

    try:
        torch.onnx.export(
            model,
            dummy_input,
            str(onnx_dest_1),
            export_params=True,
            opset_version=14,
            dynamo=False,
            do_constant_folding=True,
            input_names=["image"],
            output_names=["category_scores"],
            dynamic_axes={"image": {0: "batch_size"}, "category_scores": {0: "batch_size"}}
        )
    except Exception as e:
        print(f"Warning on legacy export, trying alternative ONNX export: {e}")
        torch.onnx.export(
            model,
            dummy_input,
            str(onnx_dest_1),
            export_params=True,
            opset_version=18,
            input_names=["image"],
            output_names=["category_scores"]
        )

    import shutil
    shutil.copy2(str(onnx_dest_1), str(onnx_dest_2))

    size_mb = onnx_dest_1.stat().st_size / (1024 * 1024)
    print(f"ONNX Model successfully saved to:")
    print(f"  -> {onnx_dest_1} ({size_mb:.2f} MB)")
    print(f"  -> {onnx_dest_2} ({size_mb:.2f} MB)")

    # Save class mapping metadata
    metadata = {
        "classes": CLASSES,
        "input_shape": [1, 3, 224, 224],
        "input_name": "image",
        "output_name": "category_scores",
        "normalization": {
            "mean": [0.485, 0.456, 0.406],
            "std": [0.229, 0.224, 0.225]
        }
    }
    with open(frontend_models_dir / "model_info.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

if __name__ == "__main__":
    train_and_export()
