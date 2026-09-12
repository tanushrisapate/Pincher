import json
from pathlib import Path
from datetime import datetime

DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
TEMPERATURE_BINS = ['cold', 'mild', 'warm', 'hot']

def generate_daily_dataset():
    print('=' * 60)
    print(' Training Daily Wardrobe Set Selector Dataset')
    print('=' * 60)

    dataset_records = []
    
    archetypes = {
        'monday': {'style': 'Executive Power Dress', 'top': 'Oxford Shirt', 'bottom': 'Tailored Trousers', 'outer': 'Structured Blazer', 'shoes': 'Leather Oxfords', 'acc': 'Chronograph Watch'},
        'tuesday': {'style': 'Productivity Smart Casual', 'top': 'Cashmere Crewneck', 'bottom': 'Pleated Chinos', 'outer': 'Minimalist Trench', 'shoes': 'Penny Loafers', 'acc': 'Leather Portfolio'},
        'wednesday': {'style': 'Midweek Fluid Styling', 'top': 'Button-Down Casual', 'bottom': 'Selvedge Denim', 'outer': 'Harrington Jacket', 'shoes': 'Minimal White Sneakers', 'acc': 'Silk Pocket Square'},
        'thursday': {'style': 'Contemporary Layering', 'top': 'Fine Ribbed Turtleneck', 'bottom': 'Relaxed Slacks', 'outer': 'Oversized Wool Coat', 'shoes': 'Chelsea Boots', 'acc': 'Leather Crossbody'},
        'friday': {'style': 'Desk-to-Dinner Chic', 'top': 'Silk Evening Shirt', 'bottom': 'Dark Indigo Jeans', 'outer': 'Black Leather Jacket', 'shoes': 'Ankle Leather Boots', 'acc': 'Statement Belt'},
        'saturday': {'style': 'Weekend Social & Active', 'top': 'Heavyweight Hoodie', 'bottom': 'Cargo Utility Pants', 'outer': 'Down Bomber Jacket', 'shoes': 'Retro Runner Sneakers', 'acc': 'Acetate Sunglasses'},
        'sunday': {'style': 'Relaxed Brunch & Reset', 'top': 'Organic Cotton Tee', 'bottom': 'Linen Drawstring Pants', 'outer': 'Cozy Knit Cardigan', 'shoes': 'Suede Slip-Ons', 'acc': 'Woven Canvas Tote'}
    }

    for day in DAYS:
        arch = archetypes[day]
        for temp_c in range(-5, 40, 2):
            is_cold = temp_c < 18
            is_hot = temp_c > 27
            
            top = arch['top'] if not is_hot else 'Breathable Linen Shirt'
            outer = arch['outer'] if is_cold else ('Light Overshirt' if temp_c < 24 else None)
            shoes = arch['shoes'] if not is_hot else 'Breathable Loafers'

            record = {
                'day': day,
                'temperature': temp_c,
                'weather_condition': 'Clear' if temp_c > 15 else 'Chilly Breeze',
                'style_archetype': arch['style'],
                'outfit_packet': {
                    'top': top,
                    'bottom': arch['bottom'],
                    'outerwear': outer,
                    'shoes': shoes,
                    'accessory': arch['acc']
                },
                'harmony_score': 94.5 + (temp_c % 5) * 0.8
            }
            dataset_records.append(record)

    out_path = Path('dataset/daily_wardrobe_sets.json')
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(dataset_records, f, indent=2)

    print(f'Successfully generated {len(dataset_records)} daily wardrobe set pairing rules.')
    print(f'Saved to {out_path}')

if __name__ == '__main__':
    generate_daily_dataset()
