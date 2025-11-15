#!/usr/bin/env python3
"""
Replace white fill (#ffffff) with a visible light gray color (#e0e0e0)
so districts are visible and hoverable
"""

import re

def fix_white_fill(input_file, output_file):
    """Replace white fill with light gray"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original file size: {len(content)} characters")
    
    # Count white fills before
    white_count = len(re.findall(r'fill:\s*#ffffff', content))
    print(f"Found {white_count} white fills")
    
    # Replace white fill with light gray (#e0e0e0 or #cccccc for better visibility)
    # Using #d3d3d3 (lightgray) which is a standard web color
    content = re.sub(
        r'fill:\s*#ffffff',
        'fill: #d3d3d3',
        content
    )
    
    # Also replace if it's in the format fill="#ffffff"
    content = re.sub(
        r'fill="#ffffff"',
        'fill="#d3d3d3"',
        content
    )
    
    # Count after
    gray_count = len(re.findall(r'fill:\s*#d3d3d3|fill="#d3d3d3"', content))
    print(f"Replaced with {gray_count} light gray fills")
    
    print(f"Fixed file size: {len(content)} characters")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ SVG with visible districts saved to: {output_file}")

if __name__ == "__main__":
    input_file = "src/assets/IstanbulHaritasi.svg"
    output_file = "src/assets/IstanbulHaritasi_visible.svg"
    
    fix_white_fill(input_file, output_file)
