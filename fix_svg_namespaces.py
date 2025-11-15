#!/usr/bin/env python3
"""
Fix SVG file to be React-compatible by removing XML namespaces
"""

import re

def fix_svg_for_react(input_file, output_file):
    """Remove XML namespaces from SVG file to make it React-compatible"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Original file size: {len(content)} characters")
    
    # Remove namespace declarations from the opening svg tag
    # Keep xmlns="http://www.w3.org/2000/svg" but remove others
    content = re.sub(r'xmlns:xlink="[^"]*"', '', content)
    content = re.sub(r'xmlns:dc="[^"]*"', '', content)
    content = re.sub(r'xmlns:cc="[^"]*"', '', content)
    content = re.sub(r'xmlns:rdf="[^"]*"', '', content)
    
    # Remove RDF metadata section completely (it's not needed for rendering)
    content = re.sub(r'<metadata>.*?</metadata>', '', content, flags=re.DOTALL)
    
    # Remove xml: namespace prefixed attributes (like xml:space)
    content = re.sub(r'xml:[a-zA-Z]+="[^"]*"', '', content)
    
    # Remove xlink: namespace prefix from attributes (commonly xlink:href)
    content = re.sub(r'xlink:href=', 'href=', content)
    
    # Clean up multiple spaces left after removals
    content = re.sub(r'  +', ' ', content)
    
    print(f"Fixed file size: {len(content)} characters")
    print(f"Removed {len(content) - len(content)} characters")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ React-compatible SVG saved to: {output_file}")

if __name__ == "__main__":
    input_file = "src/assets/IstanbulHaritasi.svg"
    output_file = "src/assets/IstanbulHaritasi_fixed.svg"
    
    fix_svg_for_react(input_file, output_file)
