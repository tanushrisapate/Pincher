import os
import urllib.request
from pathlib import Path
from PIL import Image, ImageEnhance
import random

FASHION_URLS = {
    "shoes": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",  # Red Nike sneaker
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&q=80",  # Colorful sneaker
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",  # High-top sneaker
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&q=80",  # Running shoe
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",  # Vans sneaker
        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=400&q=80",  # Blue running shoe
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80",  # Chelsea leather boot
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80",  # Oxford leather shoe
        "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80",  # Suede loafer
        "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=400&q=80",  # Running shoes on feet
        "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=400&q=80",  # White sneaker
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&q=80",  # Grey running sneaker
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=400&q=80",  # Leather dress shoes
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80",  # Hiking boots
        "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=400&q=80",  # Athletic sneakers
        "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=400&q=80",  # Leather dress oxford
        "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=400&q=80",  # Basketball sneakers
        "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&q=80",  # Leather boot
        "https://images.unsplash.com/photo-1570464197285-9949814674a7?w=400&q=80",  # Classic black sneaker
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=400&q=80",  # High heel pumps
        "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&q=80",  # Leather ankle boots
        "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=400&q=80",  # Sport runner
    ],
    "accessories": [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80",  # Leather handbag
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",  # Backpack
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80",  # Luxury tote bag
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&q=80",  # Luxury watch
        "https://images.unsplash.com/photo-1534972195531-a756b1126f25?w=400&q=80",  # Fedora hat
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80",  # Leather wallet & belt
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80",  # Sunglasses
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",  # Leather cross-body bag
        "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&q=80",  # Straw hat
        "https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=400&q=80",  # Leather shoulder bag
        "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80",  # Gold watch
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",  # Necklace jewelry
        "https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?w=400&q=80",  # Sunglasses black
        "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80",  # Scarf and hat
    ]
}

def augment_image(img, out_path, kind):
    if kind == "flip":
        aug = img.transpose(Image.FLIP_LEFT_RIGHT)
    elif kind == "rot_pos":
        aug = img.rotate(8, resample=Image.BILINEAR, expand=False)
    elif kind == "rot_neg":
        aug = img.rotate(-8, resample=Image.BILINEAR, expand=False)
    elif kind == "bright":
        enhancer = ImageEnhance.Brightness(img)
        aug = enhancer.enhance(1.15)
    elif kind == "dim":
        enhancer = ImageEnhance.Brightness(img)
        aug = enhancer.enhance(0.85)
    elif kind == "contrast":
        enhancer = ImageEnhance.Contrast(img)
        aug = enhancer.enhance(1.2)
    elif kind == "crop_zoom":
        w, h = img.size
        crop_box = (int(w * 0.05), int(h * 0.05), int(w * 0.95), int(h * 0.95))
        aug = img.crop(crop_box).resize((224, 224), Image.Resampling.LANCZOS)
    else:
        aug = img
    aug.save(out_path, "JPEG", quality=92)

def download_and_augment():
    base_dir = Path("c:/Users/ASUS/Desktop/PIncher/dataset")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

    print("=" * 60)
    print(" Downloading & Augmenting Curated Fashion Samples")
    print("=" * 60)

    for cat, urls in FASHION_URLS.items():
        train_cat_dir = base_dir / "train" / cat
        val_cat_dir = base_dir / "val" / cat
        train_cat_dir.mkdir(parents=True, exist_ok=True)
        val_cat_dir.mkdir(parents=True, exist_ok=True)

        print(f"Fetching {len(urls)} base images for '{cat}'...")
        for idx, url in enumerate(urls):
            try:
                req = urllib.request.Request(url, headers=headers)
                filename = f"base_{cat}_{idx:03d}.jpg"
                dest = train_cat_dir / filename if (idx % 3 != 0) else val_cat_dir / filename

                with urllib.request.urlopen(req, timeout=10) as response, open(dest, 'wb') as out_file:
                    out_file.write(response.read())

                with Image.open(dest) as img:
                    rgb_img = img.convert("RGB").resize((224, 224))
                    rgb_img.save(dest, "JPEG", quality=92)

                    is_train = (idx % 3 != 0)
                    target_dir = train_cat_dir if is_train else val_cat_dir
                    aug_types = ["flip", "rot_pos", "rot_neg", "bright", "dim", "contrast", "crop_zoom"]
                    
                    for aug_k in aug_types:
                        aug_dest = target_dir / f"aug_{aug_k}_{idx:03d}.jpg"
                        augment_image(rgb_img, aug_dest, aug_k)

            except Exception as e:
                print(f"  Note: Failed to download {url}: {e}")

    print("Finished downloading and augmenting dataset samples.")

if __name__ == "__main__":
    download_and_augment()
