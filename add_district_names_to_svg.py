"""
Script to add district names and proper IDs to the Istanbul map SVG.
This script will:
1. Read the istanbul-district.json file
2. Read the IstanbulHaritasi.svg file
3. Add data-district attributes and proper IDs to each patch group
4. Create a new SVG file with proper district identification
"""

import json
import re
from pathlib import Path

def normalize(text):
    """Normalize Turkish characters for ID generation"""
    replacements = {
        'ı': 'i', 'İ': 'I',
        'ş': 's', 'Ş': 'S',
        'ğ': 'g', 'Ğ': 'G',
        'ü': 'u', 'Ü': 'U',
        'ö': 'o', 'Ö': 'O',
        'ç': 'c', 'Ç': 'C'
    }
    result = text
    for turkish, english in replacements.items():
        result = result.replace(turkish, english)
    # Remove non-alphanumeric, lowercase, remove spaces
    result = re.sub(r'[^a-zA-Z0-9]', '', result).lower()
    return result

# Read the JSON file to get district names
json_path = Path('src/assets/istanbul-district.json')
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Extract district names in order they appear in JSON
districts = [feature['properties']['name'] for feature in data['features']]
print(f"Found {len(districts)} districts in JSON:")
for i, district in enumerate(districts, 1):
    print(f"  {i}. {district}")

# Read the SVG file
svg_path = Path('src/assets/IstanbulHaritasi.svg')
with open(svg_path, 'r', encoding='utf-8') as f:
    svg_content = f.read()

# Count patches in SVG (excluding patch_1 and patch_2 which are background)
patch_count = len(re.findall(r'<g id="patch_\d+">', svg_content))
print(f"\nFound {patch_count} patches in SVG")
print(f"We need {len(districts)} district patches")

# Start from patch_3 (patch_1 and patch_2 are backgrounds)
# Map each district to a patch number
district_patch_mapping = {}
for i, district in enumerate(districts):
    patch_num = i + 3  # Start from patch_3
    district_patch_mapping[f'patch_{patch_num}'] = district

print("\nDistrict to Patch mapping:")
for patch_id, district in district_patch_mapping.items():
    print(f"  {patch_id} → {district}")

# Now update the SVG content
new_svg_content = svg_content

for patch_id, district in district_patch_mapping.items():
    normalized = normalize(district)
    path_id = f'path{district.replace(" ", "")}'  # Remove spaces, keep Turkish chars
    
    # Find and replace the patch group
    old_pattern = f'<g id="{patch_id}">'
    new_group = f'<g id="{normalized}" data-district="{district}">'
    
    if old_pattern in new_svg_content:
        new_svg_content = new_svg_content.replace(old_pattern, new_group, 1)
        print(f"Updated {patch_id} → {normalized} ({district})")
        
        # Also update the path inside to have proper ID
        # Find the first <path after this group and add id attribute
        patch_start = new_svg_content.find(new_group)
        path_start = new_svg_content.find('<path', patch_start)
        path_end = new_svg_content.find('d="', path_start)
        
        if path_start > 0 and path_end > 0:
            # Insert id attribute before d="
            new_svg_content = new_svg_content[:path_end] + f'id="{path_id}" ' + new_svg_content[path_end:]
    else:
        print(f"WARNING: Could not find {patch_id}")

# Write the new SVG
output_path = Path('src/assets/IstanbulHaritasi_updated.svg')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(new_svg_content)

print(f"\n✅ Updated SVG saved to: {output_path}")
print("\nNext steps:")
print("1. Review the updated SVG file")
print("2. If it looks good, replace IstanbulHaritasi.svg with IstanbulHaritasi_updated.svg")
print("3. The map should now work with district names!")
