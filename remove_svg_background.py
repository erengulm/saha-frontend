#!/usr/bin/env python3
"""
Remove dark background from SVG, keeping only white district areas
"""

import re

def remove_background(input_file, output_file):
    """Remove background patches from SVG"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original file size: {len(content)} characters")
    
    # Remove patch_1 group (background rectangle)
    # Match the entire <g id="patch_1">...</g> block
    content = re.sub(
        r'<g id="patch_1">.*?</g>\s*',
        '',
        content,
        flags=re.DOTALL
    )
    print("✓ Removed patch_1 (background)")
    
    # Remove patch_2 group (dark background rectangle with #212830)
    # Match the entire <g id="patch_2">...</g> block
    content = re.sub(
        r'<g id="patch_2">.*?</g>\s*',
        '',
        content,
        flags=re.DOTALL
    )
    print("✓ Removed patch_2 (dark background)")
    
    # Also remove any paths with dark fills that might be standalone
    # Remove paths with #212830 (dark gray) fill
    content = re.sub(
        r'<path[^>]*fill:\s*#212830[^>]*/>',
        '',
        content
    )
    
    # Remove paths with #000000 (black) fill
    content = re.sub(
        r'<path[^>]*fill:\s*#000000[^>]*/>',
        '',
        content
    )
    
    print(f"Fixed file size: {len(content)} characters")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ SVG without background saved to: {output_file}")
    
    # Verify district paths are still there
    district_count = len(re.findall(r'data-district="[^"]+"', content))
    print(f"✅ Verified: {district_count} districts preserved")

if __name__ == "__main__":
    input_file = "src/assets/IstanbulHaritasi.svg"
    output_file = "src/assets/IstanbulHaritasi_no_bg.svg"
    
    remove_background(input_file, output_file)
