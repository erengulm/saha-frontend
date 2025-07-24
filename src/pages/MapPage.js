import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as TurkiyeHaritasi } from '../assets/TurkiyeHaritasi.svg';

const MapPage = () => {
    const [hoveredProvince, setHoveredProvince] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [members, setMembers] = useState([]);
    const mapRef = useRef(null);
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

    // Sample member data - replace this with your actual data source
    const getMembersByProvince = (plateCode, provinceName) => {
        // This is sample data - replace with your actual member data
        const sampleMembers = {
            '06': ['Ahmet Yılmaz', 'Fatma Demir', 'Mehmet Kaya', 'Ayşe Çelik', 'Mustafa Şahin'],
            '34': [
                'Zeynep Arslan', 'Ali Öztürk', 'Gülden Aydın', 'Hasan Koç', 'Merve Güneş',
                'Oğuz Polat', 'Seda Karaca', 'Emre Kılıç', 'Derya Özcan', 'Burak Şimşek',
                'Elif Yıldırım', 'Kerem Bulut', 'Sibel Kara', 'Murat Çelik', 'Neslihan Erdoğan',
                'Tolga Akman', 'Burcu Yaşar', 'Orhan Tekin', 'Gizem Özer', 'Can Yücel',
                'Pınar Doğan', 'Serhat Koçak', 'Aslı Güven', 'Barış Esen', 'Deniz Çakır',
                'Sevgi Ateş', 'Onur Demirci', 'Aylin Kartal', 'Erkan Özdemir', 'Selin Bayrak'
            ],
            '35': ['Burak Çetin', 'Deniz Mutlu', 'Ece Doğan', 'Ferhat Yıldız'],
            '01': ['Canan Özkan', 'Emre Aksoy', 'Gökhan Taş'],
            '07': ['Selma Kara', 'Yasin Çakır', 'Berna Tokgöz', 'Kemal Erdem'],
            '16': ['Işıl Durmuş', 'Kaan Uçar', 'Lale Sezer', 'Murat Aslan', 'Nur Bayram']
        };

        // Return members for the province, or empty array if no members
        return sampleMembers[plateCode] || [];
    };

    // Handle province click - show member names
    const handleProvinceClick = (plateCode, provinceName) => {
        console.log(`Clicked on ${provinceName} (${plateCode})`);

        // Set selected province info
        setSelectedProvince({ code: plateCode, name: provinceName });

        // Get members for this province
        const provinceMembers = getMembersByProvince(plateCode, provinceName);
        setMembers(provinceMembers);
    };

    useEffect(() => {
        // For SVG imports, we need to handle them differently
        const findSvgElement = () => {
            if (!mapRef.current) return null;

            // First try to find the specific ID
            let element = mapRef.current.querySelector('#svg-turkiye-haritasi');

            // If not found, try to find any SVG element
            if (!element) {
                element = mapRef.current.querySelector('svg');
            }

            // If still not found, the SVG might be nested
            if (!element) {
                element = mapRef.current.querySelector('[data-iladi]')?.closest('svg');
            }

            return element;
        };

        const handleMouseOver = (event) => {
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

                // Add hover effect
                event.target.style.fill = '#ff6b35';
                event.target.style.cursor = 'pointer';

                // Ensure plate code is formatted with leading zero
                const formattedCode = plakaKodu ? plakaKodu.padStart(2, '0') : '';

                setHoveredProvince({ name: ilAdi, code: formattedCode });
                // Remove tooltip completely - no more popup
            }
        };

        const handleMouseMove = (event) => {
            // Remove mouse move tooltip functionality
        };

        const handleMouseOut = (event) => {
            if (event.target.tagName === 'path') {
                // Reset hover effect
                event.target.style.fill = '';
                event.target.style.cursor = 'default';
            }

            // Only hide province info if we're not moving to a child element
            if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
                setHoveredProvince(null);
            }
        };

        const handleClick = (event) => {
            if (event.target.tagName === 'path') {
                event.preventDefault();

                const parent = event.target.parentNode;
                const id = parent?.getAttribute('id') || event.target.getAttribute('id');
                let plakaKodu = parent?.getAttribute('data-plakakodu') || event.target.getAttribute('data-plakakodu');
                let ilAdi = parent?.getAttribute('data-iladi') || event.target.getAttribute('data-iladi');

                // If we don't have the plate code from SVG, try to match with our provinces data
                if (!plakaKodu && ilAdi) {
                    // Find plate code by matching province name
                    const foundCode = Object.keys(provinces).find(code =>
                        provinces[code].toLowerCase() === ilAdi.toLowerCase()
                    );
                    plakaKodu = foundCode;
                }

                // If we still don't have province name but have code, get it from our data
                if (!ilAdi && plakaKodu) {
                    ilAdi = provinces[plakaKodu];
                } else if (ilAdi) {
                    // Decode Unicode escape sequences in province name
                    ilAdi = decodeUnicodeString(ilAdi);
                }

                if (plakaKodu && ilAdi) {
                    // Format plate code with leading zero
                    const formattedCode = plakaKodu.padStart(2, '0');
                    console.log(`Clicked on ${ilAdi} (${formattedCode})`);
                    handleProvinceClick(formattedCode, ilAdi);
                } else {
                    console.warn('Province data not found for clicked element');
                }
            }
        };

        // Use a timeout to ensure the SVG is fully loaded and rendered
        const timeoutId = setTimeout(() => {
            const element = findSvgElement();

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
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            const element = mapRef.current?.svgElement;
            if (element) {
                element.removeEventListener('mouseover', handleMouseOver);
                element.removeEventListener('mousemove', handleMouseMove);
                element.removeEventListener('mouseout', handleMouseOut);
                element.removeEventListener('click', handleClick);
            }
        };
    }, [navigate]); // Add navigate to dependencies

    return (
        <div className="page-container" style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
            {/* Left Section - Title and Map */}
            <div className="left-section" style={{ flex: '1' }}>
                {/* Title and Province Info Section */}
                <div className="header-section" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '20px',
                    gap: '30px'
                }}>
                    {/* Title */}
                    <div className="title-section">
                        <h2 className="mb-4">SaHa Türkiye Geneli Üye Haritası</h2>
                        <p className="mb-3 text-gray-600">Üye profillerini görmek için bir ile tıklayın</p>
                    </div>

                    {/* Province Info Boxes */}
                    <div className="province-info-boxes" style={{
                        display: 'flex',
                        gap: '15px',
                        flex: '1'
                    }}>
                        {hoveredProvince ? (
                            <div className="hovered-info" style={{
                                flex: '1',
                                padding: '10px',
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                border: '2px solid #ff6b35',
                                minHeight: '60px'
                            }}>
                                <h4 style={{ margin: '0 0 4px 0', color: '#ff6b35', fontSize: '16px' }}>Üzerine Gelinen İl</h4>
                                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
                                    {hoveredProvince.name}
                                </p>
                                <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    Plaka: {hoveredProvince.code}
                                </p>
                            </div>
                        ) : (
                            <div className="hover-instruction" style={{
                                flex: '1',
                                padding: '10px',
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '60px'
                            }}>
                                <p style={{ margin: '0', color: '#666', fontSize: '14px', textAlign: 'center' }}>
                                    Bir ilin üzerine gelin
                                </p>
                            </div>
                        )}

                        {selectedProvince ? (
                            <div className="selected-info" style={{
                                flex: '1',
                                padding: '10px',
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                border: '2px solid #28a745',
                                minHeight: '60px'
                            }}>
                                <h4 style={{ margin: '0 0 4px 0', color: '#28a745', fontSize: '16px' }}>Seçilen İl</h4>
                                <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>
                                    {selectedProvince.name}
                                </p>
                                <p style={{ margin: '2px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    Plaka: {selectedProvince.code} | Üye: {members.length}
                                </p>
                            </div>
                        ) : (
                            <div className="click-instruction" style={{
                                flex: '1',
                                padding: '10px',
                                backgroundColor: 'white',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '60px'
                            }}>
                                <p style={{ margin: '0', color: '#666', fontSize: '14px', textAlign: 'center' }}>
                                    Bir ile tıklayın
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map - Fixed Small Size */}
                <div className="svg-turkiye-haritasi" ref={mapRef} style={{
                    width: '100%'
                }}>
                    <TurkiyeHaritasi />
                </div>
            </div>

            {/* Right Panel - Always Visible */}
            <div className="members-section" style={{
                width: '350px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                height: '100%',
                overflowY: 'auto'
            }}>
                {selectedProvince ? (
                    <>
                        <h3 style={{ marginBottom: '15px', color: '#333' }}>
                            {selectedProvince.name} ({selectedProvince.code}) İlinden Üyeler
                        </h3>
                        {members.length > 0 ? (
                            <div className="members-list">
                                <p style={{ marginBottom: '10px', color: '#666' }}>
                                    Toplam {members.length} üye bulundu:
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {members.map((member, index) => (
                                        <li
                                            key={index}
                                            style={{
                                                padding: '8px 12px',
                                                margin: '4px 0',
                                                backgroundColor: 'white',
                                                borderRadius: '4px',
                                                border: '1px solid #e0e0e0'
                                            }}
                                        >
                                            {member}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>
                                Bu ilden henüz kayıtlı üye bulunmamaktadır.
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
                        <p style={{ color: '#999', fontSize: '16px' }}>
                            Üye listesini görmek için<br/>bir ile tıklayın
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MapPage;