'use client';

import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { FONTS, FONT_SIZES } from '@/lib/constants';

interface EditorToolbarProps {
  styles: {
    fontFamily: string;
    fontSize: string;
    color: string;
    backgroundColor: string;
    fontWeight: string;
    fontStyle: string;
    textDecoration: string;
    textAlign: string;
  };
  onStyleChange: (property: string, value: string) => void;
}

export function EditorToolbar({ styles, onStyleChange }: EditorToolbarProps) {
  const currentSize = parseInt(styles.fontSize) || 16;
  const isBold = styles.fontWeight === 'bold' || parseInt(styles.fontWeight) >= 700;
  const isItalic = styles.fontStyle === 'italic';
  const isUnderline = styles.textDecoration.includes('underline');

  // Extract color as hex
  function rgbToHex(rgb: string): string {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';
    return (
      '#' +
      match
        .slice(0, 3)
        .map((x) => parseInt(x).toString(16).padStart(2, '0'))
        .join('')
    );
  }

  return (
    <div className="bg-white border-b px-4 py-2 flex items-center gap-3 flex-wrap">
      {/* Font family */}
      <select
        value={styles.fontFamily.split(',')[0].replace(/['"]/g, '').trim()}
        onChange={(e) => onStyleChange('fontFamily', e.target.value)}
        className="border rounded-lg px-2 py-1.5 text-xs w-36"
      >
        {FONTS.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>

      {/* Font size */}
      <select
        value={currentSize}
        onChange={(e) => onStyleChange('fontSize', `${e.target.value}px`)}
        className="border rounded-lg px-2 py-1.5 text-xs w-16"
      >
        {FONT_SIZES.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <div className="w-px h-6 bg-border" />

      {/* Bold */}
      <button
        onClick={() =>
          onStyleChange('fontWeight', isBold ? 'normal' : 'bold')
        }
        className={`p-1.5 rounded hover:bg-muted transition-colors ${
          isBold ? 'bg-muted text-primary' : ''
        }`}
        title="Bold"
      >
        <Bold size={16} />
      </button>

      {/* Italic */}
      <button
        onClick={() =>
          onStyleChange('fontStyle', isItalic ? 'normal' : 'italic')
        }
        className={`p-1.5 rounded hover:bg-muted transition-colors ${
          isItalic ? 'bg-muted text-primary' : ''
        }`}
        title="Italic"
      >
        <Italic size={16} />
      </button>

      {/* Underline */}
      <button
        onClick={() =>
          onStyleChange(
            'textDecoration',
            isUnderline ? 'none' : 'underline'
          )
        }
        className={`p-1.5 rounded hover:bg-muted transition-colors ${
          isUnderline ? 'bg-muted text-primary' : ''
        }`}
        title="Underline"
      >
        <Underline size={16} />
      </button>

      <div className="w-px h-6 bg-border" />

      {/* Alignment */}
      <button
        onClick={() => onStyleChange('textAlign', 'left')}
        className={`p-1.5 rounded hover:bg-muted transition-colors ${
          styles.textAlign === 'left' || styles.textAlign === 'start' ? 'bg-muted text-primary' : ''
        }`}
        title="Align left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        onClick={() => onStyleChange('textAlign', 'center')}
        className={`p-1.5 rounded hover:bg-muted transition-colors ${
          styles.textAlign === 'center' ? 'bg-muted text-primary' : ''
        }`}
        title="Align center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        onClick={() => onStyleChange('textAlign', 'right')}
        className={`p-1.5 rounded hover:bg-muted transition-colors ${
          styles.textAlign === 'right' ? 'bg-muted text-primary' : ''
        }`}
        title="Align right"
      >
        <AlignRight size={16} />
      </button>

      <div className="w-px h-6 bg-border" />

      {/* Text color */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-muted-foreground">Text</label>
        <input
          type="color"
          value={rgbToHex(styles.color)}
          onChange={(e) => onStyleChange('color', e.target.value)}
          className="w-7 h-7 rounded border cursor-pointer"
        />
      </div>

      {/* Background color */}
      <div className="flex items-center gap-1.5">
        <label className="text-xs text-muted-foreground">BG</label>
        <input
          type="color"
          value={rgbToHex(styles.backgroundColor)}
          onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
          className="w-7 h-7 rounded border cursor-pointer"
        />
      </div>
    </div>
  );
}
