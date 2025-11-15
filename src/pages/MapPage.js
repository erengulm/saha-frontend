import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as TurkiyeHaritasi } from '../assets/TurkiyeHaritasi.svg';
import { ReactComponent as IstanbulHaritasi } from '../assets/IstanbulHaritasi.svg';
import istanbulDistrictsJson from '../assets/istanbul-district.json';
import axiosInstance from '../api/axios';

const MapPage = () => {
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [members, setMembers] = useState([]);
    const [currentView, setCurrentView] = useState('turkiye'); // 'turkiye' | 'istanbul'
    const [cityUsersData, setCityUsersData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
    const selectedElementRef = useRef(null);
    const navigate = useNavigate();

    // Turkey provinces with plate codes - proper UTF-8 encoding
    const provinces = {
        '01': 'Adana',
        '02': 'Adıyaman',
        '03': 'Afyonkarahisar',
        '04': 'Ağrı',
        '05': 'Amasya',
        '06': 'Ankara',
        '07': 'Antalya',
        '08': 'Artvin',
        '09': 'Aydın',
        '10': 'Balıkesir',
        '11': 'Bilecik',
        '12': 'Bingöl',
        '13': 'Bitlis',
        '14': 'Bolu',
        '15': 'Burdur',
        '16': 'Bursa',
        '17': 'Çanakkale',
        '18': 'Çankırı',
        '19': 'Çorum',
        '20': 'Denizli',
        '21': 'Diyarbakır',
        '22': 'Edirne',
        '23': 'Elazığ',
        '24': 'Erzincan',
        '25': 'Erzurum',
        '26': 'Eskişehir',
        '27': 'Gaziantep',
        '28': 'Giresun',
        '29': 'Gümüşhane',
        '30': 'Hakkâri',
        '31': 'Hatay',
        '32': 'Isparta',
        '33': 'Mersin',
        '34': 'İstanbul',
        '35': 'İzmir',
        '36': 'Kars',
        '37': 'Kastamonu',
        '38': 'Kayseri',
        '39': 'Kırklareli',
        '40': 'Kırşehir',
        '41': 'Kocaeli',
        '42': 'Konya',
        '43': 'Kütahya',
        '44': 'Malatya',
        '45': 'Manisa',
        '46': 'Kahramanmaraş',
        '47': 'Mardin',
        '48': 'Muğla',
        '49': 'Muş',
        '50': 'Nevşehir',
        '51': 'Niğde',
        '52': 'Ordu',
        '53': 'Rize',
        '54': 'Sakarya',
        '55': 'Samsun',
        '56': 'Siirt',
        '57': 'Sinop',
        '58': 'Sivas',
        '59': 'Tekirdağ',
        '60': 'Tokat',
        '61': 'Trabzon',
        '62': 'Tunceli',
        '63': 'Şanlıurfa',
        '64': 'Uşak',
        '65': 'Van',
        '66': 'Yozgat',
        '67': 'Zonguldak',
        '68': 'Aksaray',
        '69': 'Bayburt',
        '70': 'Karaman',
        '71': 'Kırıkkale',
        '72': 'Batman',
        '73': 'Şırnak',
        '74': 'Bartın',
        '75': 'Ardahan',
        '76': 'Iğdır',
        '77': 'Yalova',
        '78': 'Karabük',
        '79': 'Kilis',
        '80': 'Osmaniye',
        '81': 'Düzce'
    };

    // Fetch users data from database
    useEffect(() => {
        const fetchUsersData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('users/by-city/');

                if (response.data.success) {
                    setCityUsersData(response.data.data);
                    setError(null);
                } else {
                    setError('Kullanıcı verileri alınamadı');
                }
            } catch (err) {
                console.error('Error fetching users data:', err);
                setError('Sunucu hatası: Kullanıcı verileri alınamadı');
            } finally {
                setLoading(false);
            }
        };

        fetchUsersData().catch(error => {
            console.error('Unhandled error in fetchUsersData:', error);
        });
    }, []);

    // Function to decode Unicode escape sequences
    const decodeUnicodeString = (str) => {
        if (!str) return str;

        try {
            // Handle \xNN format (like \xC7)
            str = str.replace(/\\x([0-9A-Fa-f]{2})/g, (match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });

            // Handle \uNNNN format (like \u0131)
            str = str.replace(/\\u([0-9A-Fa-f]{4})/g, (match, hex) => {
                return String.fromCharCode(parseInt(hex, 16));
            });

            return str;
        } catch (e) {
            console.warn('Error decoding Unicode string:', str, e);
            return str;
        }
    };

    // Get members by province name
    const getMembersByProvince = (plateCode, provinceName) => {
        // Direct match first
        if (cityUsersData[provinceName]) {
            return cityUsersData[provinceName];
        }

        // Case-insensitive match
        const cityKey = Object.keys(cityUsersData).find(
            city => city.toLowerCase() === provinceName.toLowerCase()
        );

        if (cityKey) {
            return cityUsersData[cityKey];
        }

        // Try partial matching
        const partialMatch = Object.keys(cityUsersData).find(city => {
            const cleanCity = city.toLowerCase().trim();
            const cleanProvince = provinceName.toLowerCase().trim();
            return cleanCity.includes(cleanProvince) || cleanProvince.includes(cleanCity);
        });

        if (partialMatch) {
            return cityUsersData[partialMatch];
        }

        return [];
    };

    // Handle province click - show member names
    const handleProvinceClick = (plateCode, provinceName) => {
        // Set selected province info
        setSelectedProvince({ code: plateCode, name: provinceName });

        // Get members for this province from database
        const provinceMembers = getMembersByProvince(plateCode, provinceName);
        setMembers(provinceMembers);
    };

    // Normalize strings for matching path IDs to district names
    const normalize = (s) => {
        if (!s) return '';
        // lower, remove diacritics, remove non-alphanum
        const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'Á':'a' };
        return s.toLowerCase().split('').map(ch => map[ch] || ch).join('').replace(/[^a-z0-9]/g, '');
    };

    // Build lookup from normalized district name -> display name (first token from display_name)
    const districtNameLookup = React.useMemo(() => {
        const lookup = {};
        try {
            const features = istanbulDistrictsJson.features || [];
            features.forEach(f => {
                const display = f.properties?.display_name || '';
                // first token before comma is district name
                const district = display.split(',')[0].trim();
                const key = normalize(district);
                if (key) lookup[key] = district;
            });
        } catch (e) {
            console.warn('Error building district lookup', e);
        }
        return lookup;
    }, []);

    useEffect(() => {
        // Only set up event listeners after data is loaded
        if (Object.keys(cityUsersData).length === 0) {
            return;
        }

        // For SVG imports, we need to handle them differently
        const findSvgElement = () => {
            if (!mapRef.current) return null;

            // Try to find any SVG element under the container (works for both Turkey and Istanbul SVGs)
            let element = mapRef.current.querySelector('svg');
            return element;
        };

        const handleMouseOver = (event) => {
            if (event.target.tagName !== 'path') return;

            // Store original fill color if not already stored
            if (!event.target.dataset.originalFill) {
                const computedStyle = window.getComputedStyle(event.target);
                event.target.dataset.originalFill = computedStyle.fill || 'silver';
            }

            // If we are in Istanbul view, treat hover as district
            if (currentView === 'istanbul') {
                const id = event.target.id || event.target.getAttribute('id') || '';
                const key = normalize(id.replace(/^path/i, '').replace(/\d+/g, ''));
                const districtName = districtNameLookup[key];
                if (!districtName) return;

                // Special handling for Adalar - hover all islands simultaneously
                if (key === 'adalar') {
                    const svg = mapRef.current?.querySelector('svg');
                    if (svg) {
                        const adalarpaths = svg.querySelectorAll('#adalar path');
                        // Check if ANY Adalar path is selected
                        const isAdalarSelected = Array.from(adalarpaths).some(path => path === selectedElementRef.current);
                        
                        adalarpaths.forEach(path => {
                            if (!path.dataset.originalFill) {
                                const computedStyle = window.getComputedStyle(path);
                                path.dataset.originalFill = computedStyle.fill || 'silver';
                            }
                            // Don't change color if Adalar is already selected
                            if (!isAdalarSelected) {
                                path.style.fill = '#ff6b35';
                            }
                            path.style.cursor = 'pointer';
                        });
                    }
                } else if (key === 'fatih') {
                    // Special handling for Fatih - hover both paths (Fatih + old Eminönü) simultaneously
                    const svg = mapRef.current?.querySelector('svg');
                    if (svg) {
                        const fatihPaths = svg.querySelectorAll('#fatih path');
                        // Check if ANY Fatih path is selected
                        const isFatihSelected = Array.from(fatihPaths).some(path => path === selectedElementRef.current);
                        
                        fatihPaths.forEach(path => {
                            if (!path.dataset.originalFill) {
                                const computedStyle = window.getComputedStyle(path);
                                path.dataset.originalFill = computedStyle.fill || 'silver';
                            }
                            // Don't change color if Fatih is already selected
                            if (!isFatihSelected) {
                                path.style.fill = '#ff6b35';
                            }
                            path.style.cursor = 'pointer';
                        });
                    }
                } else {
                    if (event.target !== selectedElementRef.current) {
                        event.target.style.fill = '#ff6b35';
                    }
                    event.target.style.cursor = 'pointer';
                }
                
                setHoveredProvince({ name: districtName, code: '34' });
                return;
            }

            // otherwise, existing province hover behavior
            if (event.target.tagName === 'path') {
                // Look for data-iladi and data-plakakodu on the path itself or its parent
                let ilAdi = event.target.getAttribute('data-iladi');
                let plakaKodu = event.target.getAttribute('data-plakakodu');

                if (!ilAdi && event.target.parentNode) {
                    ilAdi = event.target.parentNode.getAttribute('data-iladi');
                    plakaKodu = event.target.parentNode.getAttribute('data-plakakodu');
                }

                // Skip if no city name found
                if (!ilAdi) {
                    return;
                }

                // Decode Unicode escape sequences in province name
                ilAdi = decodeUnicodeString(ilAdi);

                // Add hover effect only if not selected
                if (event.target !== selectedElementRef.current) {
                    event.target.style.fill = '#ff6b35';
                }
                event.target.style.cursor = 'pointer';

                // Ensure plate code is formatted with leading zero
                const formattedCode = plakaKodu ? plakaKodu.padStart(2, '0') : '';

                setHoveredProvince({ name: ilAdi, code: formattedCode });
            }
        };

        const handleMouseMove = (event) => {
            // Remove mouse move tooltip functionality
        };

        const handleMouseOut = (event) => {
            if (event.target.tagName !== 'path') return;

            // Check if this is an Adalar path in Istanbul view
            if (currentView === 'istanbul') {
                const id = event.target.id || event.target.getAttribute('id') || '';
                const key = normalize(id.replace(/^path/i, '').replace(/\d+/g, ''));
                
                if (key === 'adalar') {
                    // Reset all Adalar islands
                    const svg = mapRef.current?.querySelector('svg');
                    if (svg) {
                        const adalarpaths = svg.querySelectorAll('#adalar path');
                        // Check if ANY Adalar path is selected
                        const isAdalarSelected = Array.from(adalarpaths).some(path => path === selectedElementRef.current);
                        
                        adalarpaths.forEach(path => {
                            if (isAdalarSelected) {
                                // Keep all Adalar paths green if any is selected
                                path.style.fill = '#28a745';
                                path.style.cursor = 'pointer';
                            } else {
                                const originalFill = path.dataset.originalFill || 'silver';
                                path.style.fill = originalFill;
                                path.style.cursor = 'default';
                            }
                        });
                    }
                    
                    // Only hide province/district info if we're not moving to another island
                    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
                        setHoveredProvince(null);
                    }
                    return;
                }
                
                if (key === 'fatih') {
                    // Reset all Fatih paths
                    const svg = mapRef.current?.querySelector('svg');
                    if (svg) {
                        const fatihPaths = svg.querySelectorAll('#fatih path');
                        // Check if ANY Fatih path is selected
                        const isFatihSelected = Array.from(fatihPaths).some(path => path === selectedElementRef.current);
                        
                        fatihPaths.forEach(path => {
                            if (isFatihSelected) {
                                // Keep all Fatih paths green if any is selected
                                path.style.fill = '#28a745';
                                path.style.cursor = 'pointer';
                            } else {
                                const originalFill = path.dataset.originalFill || 'silver';
                                path.style.fill = originalFill;
                                path.style.cursor = 'default';
                            }
                        });
                    }
                    
                    // Only hide province/district info if we're not moving to another Fatih area
                    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
                        setHoveredProvince(null);
                    }
                    return;
                }
            }

            // Reset hover effect, but keep selected state
            if (event.target === selectedElementRef.current) {
                // Keep green if selected
                event.target.style.fill = '#28a745';
                event.target.style.cursor = 'pointer';
            } else {
                // Restore original color if not selected
                const originalFill = event.target.dataset.originalFill || 'silver';
                event.target.style.fill = originalFill;
                event.target.style.cursor = 'default';
            }

            // Only hide province/district info if we're not moving to a child element
            if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
                setHoveredProvince(null);
            }
        };

        const handleClick = (event) => {
            if (event.target.tagName !== 'path') return;
            event.preventDefault();

            // If currently viewing Istanbul, treat clicks as district selection
            if (currentView === 'istanbul') {
                const id = event.target.id || '';
                const key = normalize(id.replace(/^path/i, '').replace(/\d+/g, ''));
                const districtName = districtNameLookup[key];

                if (!districtName) {
                    console.warn('District name not found for path id', id);
                    return;
                }

                // Special handling for Adalar - select/deselect all islands
                if (key === 'adalar') {
                    const svg = mapRef.current?.querySelector('svg');
                    if (!svg) return;
                    
                    const adalarPaths = svg.querySelectorAll('#adalar path');
                    
                    // Check if any island is currently selected
                    const isAnySelected = Array.from(adalarPaths).some(path => path === selectedElementRef.current);
                    
                    if (isAnySelected) {
                        // Deselect all islands
                        adalarPaths.forEach(path => {
                            const originalFill = path.dataset.originalFill || 'silver';
                            path.style.fill = originalFill;
                            path.style.cursor = 'default';
                        });
                        selectedElementRef.current = null;
                        setSelectedProvince(null);
                        setMembers([]);
                    } else {
                        // Deselect previous selection if exists (check for multi-path districts)
                        if (selectedElementRef.current) {
                            // Check if previous selection was Fatih
                            const fatihPaths = svg.querySelectorAll('#fatih path');
                            const wasFatih = Array.from(fatihPaths).some(path => path === selectedElementRef.current);
                            
                            if (wasFatih) {
                                fatihPaths.forEach(path => {
                                    const originalFill = path.dataset.originalFill || 'silver';
                                    path.style.fill = originalFill;
                                    path.style.cursor = 'default';
                                });
                            } else {
                                // Single path district
                                const originalFill = selectedElementRef.current.dataset.originalFill || 'silver';
                                selectedElementRef.current.style.fill = originalFill;
                                selectedElementRef.current.style.cursor = 'default';
                            }
                        }
                        
                        // Select all islands
                        adalarPaths.forEach(path => {
                            path.style.fill = '#28a745';
                            path.style.cursor = 'pointer';
                        });
                        
                        // Store the first island as selected reference
                        selectedElementRef.current = adalarPaths[0];

                        // For members, try to find users matching district name
                        let districtMembers = [];
                        const candidate = Object.keys(cityUsersData).find(k => normalize(k).includes(key) || normalize(k) === key);
                        if (candidate) districtMembers = cityUsersData[candidate] || [];
                        else districtMembers = getMembersByProvince('34', 'İstanbul');

                        setSelectedProvince({ code: '34', name: `İstanbul - ${districtName}` });
                        setMembers(districtMembers);
                    }
                    return;
                }

                // Special handling for Fatih - select/deselect both paths (Fatih + old Eminönü)
                if (key === 'fatih') {
                    const svg = mapRef.current?.querySelector('svg');
                    if (!svg) return;
                    
                    const fatihPaths = svg.querySelectorAll('#fatih path');
                    
                    // Check if any path is currently selected
                    const isAnySelected = Array.from(fatihPaths).some(path => path === selectedElementRef.current);
                    
                    if (isAnySelected) {
                        // Deselect all paths
                        fatihPaths.forEach(path => {
                            const originalFill = path.dataset.originalFill || 'silver';
                            path.style.fill = originalFill;
                            path.style.cursor = 'default';
                        });
                        selectedElementRef.current = null;
                        setSelectedProvince(null);
                        setMembers([]);
                    } else {
                        // Deselect previous selection if exists (check for multi-path districts)
                        if (selectedElementRef.current) {
                            // Check if previous selection was Adalar
                            const adalarPaths = svg.querySelectorAll('#adalar path');
                            const wasAdalar = Array.from(adalarPaths).some(path => path === selectedElementRef.current);
                            
                            if (wasAdalar) {
                                adalarPaths.forEach(path => {
                                    const originalFill = path.dataset.originalFill || 'silver';
                                    path.style.fill = originalFill;
                                    path.style.cursor = 'default';
                                });
                            } else {
                                // Single path district
                                const originalFill = selectedElementRef.current.dataset.originalFill || 'silver';
                                selectedElementRef.current.style.fill = originalFill;
                                selectedElementRef.current.style.cursor = 'default';
                            }
                        }
                        
                        // Select all Fatih paths
                        fatihPaths.forEach(path => {
                            path.style.fill = '#28a745';
                            path.style.cursor = 'pointer';
                        });
                        
                        // Store the first path as selected reference
                        selectedElementRef.current = fatihPaths[0];

                        // For members, try to find users matching district name
                        let districtMembers = [];
                        const candidate = Object.keys(cityUsersData).find(k => normalize(k).includes(key) || normalize(k) === key);
                        if (candidate) districtMembers = cityUsersData[candidate] || [];
                        else districtMembers = getMembersByProvince('34', 'İstanbul');

                        setSelectedProvince({ code: '34', name: `İstanbul - ${districtName}` });
                        setMembers(districtMembers);
                    }
                    return;
                }

                // Toggle selection for other districts
                if (event.target === selectedElementRef.current) {
                    const originalFill = event.target.dataset.originalFill || 'silver';
                    event.target.style.fill = originalFill;
                    event.target.style.cursor = 'default';
                    selectedElementRef.current = null;
                    setSelectedProvince(null);
                    setMembers([]);
                } else {
                    // Deselect previous selection if exists (check for multi-path districts)
                    if (selectedElementRef.current) {
                        const svg = mapRef.current?.querySelector('svg');
                        if (svg) {
                            // Check if previous selection was Adalar
                            const adalarPaths = svg.querySelectorAll('#adalar path');
                            const wasAdalar = Array.from(adalarPaths).some(path => path === selectedElementRef.current);
                            
                            // Check if previous selection was Fatih
                            const fatihPaths = svg.querySelectorAll('#fatih path');
                            const wasFatih = Array.from(fatihPaths).some(path => path === selectedElementRef.current);
                            
                            if (wasAdalar) {
                                adalarPaths.forEach(path => {
                                    const originalFill = path.dataset.originalFill || 'silver';
                                    path.style.fill = originalFill;
                                    path.style.cursor = 'default';
                                });
                            } else if (wasFatih) {
                                fatihPaths.forEach(path => {
                                    const originalFill = path.dataset.originalFill || 'silver';
                                    path.style.fill = originalFill;
                                    path.style.cursor = 'default';
                                });
                            } else {
                                // Single path district
                                const originalFill = selectedElementRef.current.dataset.originalFill || 'silver';
                                selectedElementRef.current.style.fill = originalFill;
                                selectedElementRef.current.style.cursor = 'default';
                            }
                        }
                    }
                    selectedElementRef.current = event.target;
                    event.target.style.fill = '#28a745';
                    event.target.style.cursor = 'pointer';

                    // For members, try to find users matching district name; otherwise fallback to Istanbul province
                    let districtMembers = [];
                    // Try exact key match in cityUsersData
                    const candidate = Object.keys(cityUsersData).find(k => normalize(k).includes(key) || normalize(k) === key);
                    if (candidate) districtMembers = cityUsersData[candidate] || [];
                    else districtMembers = getMembersByProvince('34', 'İstanbul');

                    setSelectedProvince({ code: '34', name: `İstanbul - ${districtName}` });
                    setMembers(districtMembers);
                }

                return;
            }

            // Otherwise, existing province click logic
            const parent = event.target.parentNode;
            let plakaKodu = parent?.getAttribute('data-plakakodu') || event.target.getAttribute('data-plakakodu');
            let ilAdi = parent?.getAttribute('data-iladi') || event.target.getAttribute('data-iladi');

            // If we don't have the plate code from SVG, try to match with our provinces data
            if (!plakaKodu && ilAdi) {
                const foundCode = Object.keys(provinces).find(code =>
                    provinces[code].toLowerCase() === ilAdi.toLowerCase()
                );
                plakaKodu = foundCode;
            }

            if (!ilAdi && plakaKodu) {
                ilAdi = provinces[plakaKodu];
            } else if (ilAdi) {
                ilAdi = decodeUnicodeString(ilAdi);
            }

            if (plakaKodu && ilAdi) {
                // If Istanbul clicked, open Istanbul map
                const formattedCode = plakaKodu.padStart(2, '0');
                if (formattedCode === '34') {
                    // switch to Istanbul view
                    setCurrentView('istanbul');
                    // clear selections
                    if (selectedElementRef.current) {
                        const originalFill = selectedElementRef.current.dataset.originalFill || 'silver';
                        selectedElementRef.current.style.fill = originalFill;
                        selectedElementRef.current.style.cursor = 'default';
                        selectedElementRef.current = null;
                    }
                    setHoveredProvince(null);
                    setSelectedProvince(null);
                    setMembers([]);
                    return;
                }

                // Check if clicking the same selected element (toggle off)
                if (event.target === selectedElementRef.current) {
                    const originalFill = event.target.dataset.originalFill || 'silver';
                    event.target.style.fill = originalFill;
                    event.target.style.cursor = 'default';
                    selectedElementRef.current = null;
                    setSelectedProvince(null);
                    setMembers([]);
                } else {
                    if (selectedElementRef.current) {
                        const originalFill = selectedElementRef.current.dataset.originalFill || 'silver';
                        selectedElementRef.current.style.fill = originalFill;
                        selectedElementRef.current.style.cursor = 'default';
                    }
                    selectedElementRef.current = event.target;
                    event.target.style.fill = '#28a745';
                    event.target.style.cursor = 'pointer';

                    handleProvinceClick(formattedCode, ilAdi);
                }
            } else {
                console.warn('Province data not found for clicked element');
            }
        };

        // Handler to clear hover state when mouse leaves the entire map container
        const handleMapLeave = () => {
            setHoveredProvince(null);
        };

        // Use a timeout to ensure the SVG is fully loaded and rendered
        const timeoutId = setTimeout(() => {
            const element = findSvgElement();
            const mapContainer = mapRef.current;

            if (element) {
                element.addEventListener('mouseover', handleMouseOver);
                element.addEventListener('mousemove', handleMouseMove);
                element.addEventListener('mouseout', handleMouseOut);
                element.addEventListener('click', handleClick);

                // Store the element reference for cleanup
                mapRef.current.svgElement = element;
            } else {
                console.warn('SVG element not found. Make sure the SVG file has proper data attributes.');
            }

            // Add mouseleave handler to map container to clear hover state
            if (mapContainer) {
                mapContainer.addEventListener('mouseleave', handleMapLeave);
            }
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            const element = mapRef.current?.svgElement;
            const mapContainer = mapRef.current;
            
            if (element) {
                element.removeEventListener('mouseover', handleMouseOver);
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseout', handleMouseOut);
                element.removeEventListener('click', handleClick);
            }
            
            if (mapContainer) {
                mapContainer.removeEventListener('mouseleave', handleMapLeave);
            }
        };
    }, [navigate, cityUsersData, currentView, districtNameLookup]);

    if (loading) {
        return (
            <div className="homepage">
                <div className="page-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100vh - 80px)',
                    marginTop: '80px',
                    marginLeft: '2rem'
                }}>
                    <p>Kullanıcı verileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="homepage">
                <div className="page-container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100vh - 80px)',
                    marginTop: '80px',
                    marginLeft: '2rem'
                }}>
                    <p style={{ color: 'red' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="homepage">
            <div className="page-container" style={{
                display: 'flex',
                height: 'calc(100vh - 80px)',
                marginTop: '80px',
                marginLeft: '2rem',
                marginRight: '1rem'
            }}>
                {/* Left Section - Title and Map */}
                <div className="left-section" style={{ flex: '1', paddingRight: '20px' }}>
                    {/* Title and Province Info Section */}
                    <div className="header-section" style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        marginBottom: '20px',
                        gap: '30px'
                    }}>
                        {/* Title */}
                        <div className="title-section">
                            <h2 className="section-title mb-4">SaHa Türkiye Geneli Üye Haritası</h2>
                            <p className="mb-3 text-gray-600">
                                Üye profillerini görmek için bir {currentView === 'istanbul' ? 'ilçeye' : 'ile'} tıklayın
                            </p>
                        </div>

                        {/* Province Info Boxes */}
                        <div className="province-info-boxes" style={{
                            display: 'flex',
                            gap: '15px',
                            flex: '1',
                            minWidth: '0'
                        }}>
                            {hoveredProvince ? (
                                <div className="hovered-info card animate-fade-in" style={{
                                    flex: '1',
                                    padding: '20px',
                                    border: '2px solid #ff6b35',
                                    minHeight: '110px',
                                    minWidth: '0',
                                    overflow: 'hidden'
                                }}>
                                    <h4 style={{ margin: '0 0 4px 0', color: '#ff6b35', fontSize: '14px' }}>
                                        {currentView === 'istanbul' ? 'Üzerine Gelinen İlçe' : 'Üzerine Gelinen İl'}
                                    </h4>
                                    <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', lineHeight: '1.1', wordBreak: 'break-word' }}>
                                        {hoveredProvince.name}
                                    </p>
                                    {currentView !== 'istanbul' && (
                                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                            Plaka: {hoveredProvince.code}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="hover-instruction card animate-fade-in" style={{
                                    flex: '1',
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '110px',
                                    minWidth: '0'
                                }}>
                                    <p style={{ margin: '0', color: '#666', fontSize: '12px', textAlign: 'center' }}>
                                        Bir {currentView === 'istanbul' ? 'ilçenin' : 'ilin'} üzerine gelin
                                    </p>
                                </div>
                            )}

                            {selectedProvince ? (
                                <div className="selected-info card animate-fade-in" style={{
                                    flex: '1',
                                    padding: '20px',
                                    border: '2px solid #28a745',
                                    minHeight: '110px',
                                    minWidth: '0',
                                    overflow: 'hidden'
                                }}>
                                    <h4 style={{ margin: '0 0 4px 0', color: '#28a745', fontSize: '14px' }}>
                                        {currentView === 'istanbul' ? 'Seçilen İlçe' : 'Seçilen İl'}
                                    </h4>
                                    <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', lineHeight: '1.1', wordBreak: 'break-word' }}>
                                        {selectedProvince.name}
                                    </p>
                                    {currentView !== 'istanbul' ? (
                                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                            Plaka: {selectedProvince.code} | Üye: {members.length}
                                        </p>
                                    ) : (
                                        <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                            Üye: {members.length}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="click-instruction card animate-fade-in" style={{
                                    flex: '1',
                                    padding: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minHeight: '110px',
                                    minWidth: '0'
                                }}>
                                    <p style={{ margin: '0', color: '#666', fontSize: '12px', textAlign: 'center' }}>
                                        Bir {currentView === 'istanbul' ? 'ilçeye' : 'ile'} tıklayın
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Map - Fixed Small Size */}
                    <div className="svg-turkiye-haritasi" ref={mapRef} style={{
                        width: '100%'
                    }}>
                        {currentView === 'turkiye' ? (
                            <TurkiyeHaritasi style={{ width: '100%', height: 'auto' }} />
                        ) : (
                            <div style={{ position: 'relative', width: '100%' }}>
                                <button
                                    onClick={() => {
                                        // clear any selected district visuals
                                        if (selectedElementRef.current) {
                                            // Check if selected element is part of Adalar or Fatih
                                            const svg = mapRef.current?.querySelector('svg');
                                            if (svg) {
                                                const adalarPaths = svg.querySelectorAll('#adalar path');
                                                const isAdalarSelected = Array.from(adalarPaths).some(path => path === selectedElementRef.current);
                                                
                                                const fatihPaths = svg.querySelectorAll('#fatih path');
                                                const isFatihSelected = Array.from(fatihPaths).some(path => path === selectedElementRef.current);
                                                
                                                if (isAdalarSelected) {
                                                    // Reset all Adalar islands
                                                    adalarPaths.forEach(path => {
                                                        const originalFill = path.dataset.originalFill || 'silver';
                                                        path.style.fill = originalFill;
                                                        path.style.cursor = 'default';
                                                    });
                                                } else if (isFatihSelected) {
                                                    // Reset all Fatih paths
                                                    fatihPaths.forEach(path => {
                                                        const originalFill = path.dataset.originalFill || 'silver';
                                                        path.style.fill = originalFill;
                                                        path.style.cursor = 'default';
                                                    });
                                                } else {
                                                    // Reset single element
                                                    const originalFill = selectedElementRef.current.dataset.originalFill || 'silver';
                                                    selectedElementRef.current.style.fill = originalFill;
                                                    selectedElementRef.current.style.cursor = 'default';
                                                }
                                            }
                                            selectedElementRef.current = null;
                                        }
                                        setCurrentView('turkiye');
                                        setHoveredProvince(null);
                                        setSelectedProvince(null);
                                        setMembers([]);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 10,
                                        left: 10,
                                        top: 10,
                                        background: '#fff',
                                        border: '1px solid #ddd',
                                        padding: '6px 10px',
                                        cursor: 'pointer',
                                        borderRadius: 4
                                    }}
                                >
                                    ← Geri
                                </button>
                                <IstanbulHaritasi style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Full Height */}
                <div className="members-section card animate-fade-in" style={{
                    width: '350px',
                    padding: '20px',
                    height: 'calc(100vh - 120px)',
                    overflowY: 'auto',
                    margin: '0 0 20px 0'
                }}>
                    {selectedProvince ? (
                        <>
                            <h3 className="card-title" style={{ fontSize: '20px', marginBottom: '15px', color: 'var(--text-primary)' }}>
                                {currentView === 'istanbul' 
                                    ? `${selectedProvince.name} İlçesinden Üyeler`
                                    : `${selectedProvince.name} (${selectedProvince.code}) İlinden Üyeler`
                                }
                            </h3>
                            {members.length > 0 ? (
                                <div className="members-list">
                                    <p className="card-content" style={{ marginBottom: '10px', color: '#666' }}>
                                        Toplam {members.length} üye bulundu:
                                    </p>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {members.map((member, index) => (
                                            <li
                                                key={index}
                                                className="card animate-fade-in"
                                                style={{
                                                    padding: '8px 12px',
                                                    margin: '4px 0',
                                                    border: '1px solid #e0e0e0'
                                                }}
                                            >
                                                <div style={{ fontWeight: 'bold' }}>{member.name}</div>
                                                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                                    {member.role === 'superadmin' ? 'Süper Admin' :
                                                        member.role === 'admin' ? 'Admin' : 'Üye'}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p className="card-content" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                    Bu {currentView === 'istanbul' ? 'ilçeden' : 'ilden'} henüz kayıtlı üye bulunmamaktadır.
                                </p>
                            )}
                        </>
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '200px',
                            textAlign: 'center'
                        }}>
                            <p className="card-content" style={{ color: '#999', fontSize: '16px' }}>
                                Üye listesini görmek için<br/>bir {currentView === 'istanbul' ? 'ilçeye' : 'ile'} tıklayın
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MapPage;