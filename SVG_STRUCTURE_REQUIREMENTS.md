# Istanbul District SVG Structure Requirements

## Problem
The new `IstanbulHaritasi.svg` file you uploaded doesn't have the necessary structure for the interactive district map to work. It's missing district identifications.

## Required SVG Structure

The SVG needs to have this structure for each district:

```xml
<g id="districtname" data-district="DistrictName">
    <path id="pathDistrictname" fill="silver" d="M...coordinates..." />
</g>
```

### Example for a Few Districts:

```xml
<svg>
    <!-- Adalar district with multiple islands -->
    <g id="adalar" data-district="Adalar">
        <path id="pathAdalar" fill="silver" d="M...coordinates for Kınalıada..." />
        <path id="pathAdalar" fill="silver" d="M...coordinates for Burgazada..." />
        <path id="pathAdalar" fill="silver" d="M...coordinates for Heybeliada..." />
        <!-- All 9 islands with same id -->
    </g>
    
    <!-- Fatih district (merged with old Eminönü) -->
    <g id="fatih" data-district="Fatih">
        <path id="pathFatih" fill="silver" d="M...coordinates for Fatih area..." />
        <path id="pathFatih" fill="silver" d="M...coordinates for old Eminönü area..." />
    </g>
    
    <!-- Eyüpsultan district -->
    <g id="eyupsultan" data-district="Eyüpsultan">
        <path id="pathEyupsultan" fill="silver" d="M...coordinates..." />
    </g>
    
    <!-- Şişli district -->
    <g id="sisli" data-district="Şişli">
        <path id="pathSisli" fill="silver" d="M...coordinates..." />
    </g>
    
    <!-- ... and so on for all 39 districts -->
</svg>
```

## All 39 Istanbul Districts Required

The SVG needs paths for these districts (matching the JSON file):

1. Adalar
2. Arnavutköy
3. Ataşehir
4. Avcılar
5. Bağcılar
6. Bahçelievler
7. Bakırköy
8. Başakşehir
9. Bayrampaşa
10. Beşiktaş
11. Beykoz
12. Beylikdüzü
13. Beyoğlu
14. Büyükçekmece
15. Çatalca
16. Çekmeköy
17. Esenler
18. Esenyurt
19. Eyüpsultan
20. Fatih
21. Gaziosmanpaşa
22. Güngören
23. Kadıköy
24. Kağıthane
25. Kartal
26. Küçükçekmece
27. Maltepe
28. Pendik
29. Sancaktepe
30. Sarıyer
31. Silivri
32. Sultanbeyli
33. Sultangazi
34. Şile
35. Şişli
36. Tuzla
37. Ümraniye
38. Üsküdar
39. Zeytinburnu

## Naming Convention

### Group IDs (lowercase, normalized):
- Remove Turkish characters: ı→i, ş→s, ğ→g, ü→u, ö→o, ç→c
- Lowercase
- Remove spaces
- Example: "Eyüpsultan" → `id="eyupsultan"`

### Path IDs:
- Same as group but with "path" prefix
- First letter uppercase after "path"
- Example: "Eyüpsultan" → `id="pathEyupsultan"`

### data-district Attribute:
- Keep original Turkish name with proper capitalization
- Example: `data-district="Eyüpsultan"`

## How to Fix Your SVG

You need to either:

1. **Manually add district boundaries** from your GeoJSON to the SVG, or
2. **Use a GeoJSON-to-SVG converter** tool that preserves the district names, or
3. **Find/use an already-structured Istanbul district SVG** with proper district groupings, or
4. **Edit your current SVG** to add proper `<g>` groups and IDs for each district polygon

## Recommended Tools

- QGIS (Geographic Information System) - can export GeoJSON to SVG with properties
- D3.js - can convert GeoJSON to SVG paths programmatically
- Inkscape - manual SVG editing with layers/groups

## What the Code Expects

The JavaScript code in `MapPage.js`:
1. Queries paths by their IDs (e.g., `querySelector('#adalar path')`)
2. Extracts district names from path IDs by removing "path" prefix and normalizing
3. Matches normalized names with the `istanbul-district.json` data
4. Applies hover/click effects to paths based on district grouping

Without proper structure, **the interactive map will not function**.
