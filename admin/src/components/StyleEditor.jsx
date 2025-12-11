import React, { useState, useEffect } from 'react';

const StyleEditor = ({ editor, selectedComponent }) => {
    const [styles, setStyles] = useState({});

    // Load styles when component changes
    useEffect(() => {
        if (selectedComponent) {
            const componentStyles = selectedComponent.getStyle();
            setStyles(componentStyles);
        }
    }, [selectedComponent]);

    const updateStyle = (property, value) => {
        if (!selectedComponent) return;

        // Use addStyle to merge safely and ensure GrapesJS handles the update
        selectedComponent.addStyle({ [property]: value });

        // Update local state to reflect changes in UI
        setStyles(prev => ({ ...prev, [property]: value }));
    };

    const handleColorChange = (e, property) => {
        updateStyle(property, e.target.value);
    };

    const handlePixelChange = (e, property) => {
        updateStyle(property, `${e.target.value}px`);
    };

    const handleSelectChange = (e, property) => {
        updateStyle(property, e.target.value);
    };

    if (!selectedComponent) return null;

    const type = selectedComponent.get('type') || selectedComponent.get('tagName');

    return (
        <div style={{
            width: '280px',
            background: 'white',
            borderLeft: '1px solid #e9ecef',
            height: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '15px',
                borderBottom: '1px solid #e9ecef',
                background: '#f8f9fa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', textTransform: 'capitalize' }}>
                    Editar {type}
                </h3>
                <button
                    onClick={() => editor.select(null)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px' }}
                >
                    ×
                </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* BACKGROUND */}
                <div>
                    <label style={labelStyle}>Fondo</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                            type="color"
                            value={rgbToHex(styles['background-color']) || '#ffffff'}
                            onChange={(e) => handleColorChange(e, 'background-color')}
                            style={{ width: '40px', height: '40px', border: 'none', padding: 0, cursor: 'pointer' }}
                        />
                        <input
                            type="text"
                            placeholder="URL de imagen"
                            value={styles['background-image']?.replace('url("', '').replace('")', '') || ''}
                            onChange={(e) => updateStyle('background-image', `url("${e.target.value}")`)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* TYPOGRAPHY */}
                <div>
                    <label style={labelStyle}>Tipografía</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={subLabelStyle}>Color</span>
                            <input
                                type="color"
                                value={rgbToHex(styles['color']) || '#000000'}
                                onChange={(e) => handleColorChange(e, 'color')}
                                style={{ width: '100%', height: '35px', border: 'none', padding: 0, cursor: 'pointer' }}
                            />
                        </div>
                        <div>
                            <span style={subLabelStyle}>Tamaño (px)</span>
                            <input
                                type="number"
                                value={parseInt(styles['font-size']) || 16}
                                onChange={(e) => handlePixelChange(e, 'font-size')}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <span style={subLabelStyle}>Alineación</span>
                        <select
                            value={styles['text-align'] || 'left'}
                            onChange={(e) => handleSelectChange(e, 'text-align')}
                            style={selectStyle}
                        >
                            <option value="left">Izquierda</option>
                            <option value="center">Centro</option>
                            <option value="right">Derecha</option>
                            <option value="justify">Justificado</option>
                        </select>
                    </div>
                </div>

                {/* SPACING */}
                <div>
                    <label style={labelStyle}>Espaciado (Padding)</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={subLabelStyle}>Arriba</span>
                            <input
                                type="number"
                                value={parseInt(styles['padding-top']) || 0}
                                onChange={(e) => handlePixelChange(e, 'padding-top')}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <span style={subLabelStyle}>Abajo</span>
                            <input
                                type="number"
                                value={parseInt(styles['padding-bottom']) || 0}
                                onChange={(e) => handlePixelChange(e, 'padding-bottom')}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <span style={subLabelStyle}>Izquierda</span>
                            <input
                                type="number"
                                value={parseInt(styles['padding-left']) || 0}
                                onChange={(e) => handlePixelChange(e, 'padding-left')}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <span style={subLabelStyle}>Derecha</span>
                            <input
                                type="number"
                                value={parseInt(styles['padding-right']) || 0}
                                onChange={(e) => handlePixelChange(e, 'padding-right')}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                {/* BORDERS */}
                <div>
                    <label style={labelStyle}>Bordes</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <span style={subLabelStyle}>Radio (px)</span>
                            <input
                                type="number"
                                value={parseInt(styles['border-radius']) || 0}
                                onChange={(e) => handlePixelChange(e, 'border-radius')}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <span style={subLabelStyle}>Grosor (px)</span>
                            <input
                                type="number"
                                value={parseInt(styles['border-width']) || 0}
                                onChange={(e) => {
                                    updateStyle('border-width', `${e.target.value}px`);
                                    if (!styles['border-style']) updateStyle('border-style', 'solid');
                                }}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <span style={subLabelStyle}>Color Borde</span>
                        <input
                            type="color"
                            value={rgbToHex(styles['border-color']) || '#000000'}
                            onChange={(e) => handleColorChange(e, 'border-color')}
                            style={{ width: '100%', height: '35px', border: 'none', padding: 0, cursor: 'pointer' }}
                        />
                    </div>
                </div>

                {/* ACTIONS */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button
                        onClick={() => {
                            const clone = selectedComponent.clone();
                            selectedComponent.parent().append(clone);
                        }}
                        style={actionButtonStyle('#228be6')}
                    >
                        📑 Duplicar
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('¿Estás seguro de eliminar este elemento?')) {
                                selectedComponent.remove();
                                editor.select(null);
                            }
                        }}
                        style={actionButtonStyle('#fa5252')}
                    >
                        🗑️ Eliminar
                    </button>
                </div>

            </div>
        </div>
    );
};

// Helper styles
const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    fontSize: '13px',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const subLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontSize: '12px',
    color: '#666'
};

const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    fontSize: '13px',
    boxSizing: 'border-box'
};

const selectStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    fontSize: '13px',
    backgroundColor: 'white'
};

const actionButtonStyle = (color) => ({
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    background: 'white',
    border: `1px solid ${color}`,
    color: color,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s'
});

// Helper to convert RGB to Hex for color inputs
function rgbToHex(col) {
    if (!col) return null;
    if (col.charAt(0) === '#') return col;
    const rgb = col.match(/\d+/g);
    if (!rgb) return null;
    return "#" + ((1 << 24) + (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2])).toString(16).slice(1);
}

export default StyleEditor;
