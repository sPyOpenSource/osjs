import React from 'react';
import { AvatarStyle } from '../types';

interface AvatarRendererProps {
  style: AvatarStyle;
  size?: number;
}

export default function AvatarRenderer({ style, size = 120 }: AvatarRendererProps) {
  // Map armor colors
  const armorHexMap: { [key: string]: string } = {
    '#10b981': '#047857', // Emerald -> Dark Emerald
    '#3b82f6': '#1d4ed8', // Blue -> Royal Blue
    '#ef4444': '#b91c1c', // Red -> Crimson
    '#a855f7': '#7e22ce', // Purple -> Violet
    '#eab308': '#a16207', // Gold -> Dark Amber
    '#6b7280': '#374151', // Gray -> Slate Gray
    '#f8fafc': '#cbd5e1', // White -> Soft Gray
    '#fb923c': '#c2410c', // Orange
    '#059669': '#064e3b',
  };

  const armorColor = style.armorColor || '#3b82f6';
  const shadowArmorColor = armorHexMap[armorColor] || '#1e3a8a';

  // Hair mapping colors
  const hairHexMap: { [key: string]: string } = {
    '#1e293b': '#0f172a', // Slate
    '#0f172a': '#020617', // Black
    '#171717': '#000000', // Dark Charcoal
    '#c2410c': '#7c2d12', // Crimson-red Beard
    '#4b5563': '#1f2937', // Gray hair
  };

  const hairColor = style.hairColor || '#1e293b';
  const shadowHairColor = hairHexMap[hairColor] || '#0f172a';

  return (
    <div 
      className={`relative rounded-xl overflow-hidden border border-slate-700 shadow-xl bg-gradient-to-b ${style.bgGradient}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Subtle Sun Burst */}
        <circle cx="50" cy="50" r="35" fill="rgba(255,255,255,0.03)" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

        {/* Head/Neck Base */}
        <path d="M 46 62 L 46 72 L 54 72 L 54 62 Z" fill="#fcd34d" />
        <path d="M 44 72 Q 50 78 56 72 Z" fill="#f59e0b" opacity="0.3" />

        {/* Face */}
        <rect x="36" y="38" width="28" height="28" rx="8" fill="#fef08a" />
        {/* Cheeks blush for Female/Warm look */}
        {style.expression.includes('Warm') && (
          <>
            <circle cx="41" cy="53" r="3" fill="#f43f5e" opacity="0.15" />
            <circle cx="59" cy="53" r="3" fill="#f43f5e" opacity="0.15" />
          </>
        )}

        {/* Ears */}
        <circle cx="34" cy="50" r="4.5" fill="#fef08a" />
        <circle cx="66" cy="50" r="4.5" fill="#fef08a" />

        {/* Hair Backing if long */}
        {(style.hairStyle.includes('Long') || style.hairStyle.includes('Mane')) && (
          <path d="M 32 46 Q 22 75 40 92 Q 50 95 60 92 Q 78 75 68 46 Z" fill={shadowHairColor} />
        )}

        {/* Armor Robes */}
        {/* Base Cloak */}
        <path d="M 20 80 C 20 80, 25 72, 35 72 L 65 72 C 75 72, 80 80, 80 80 L 85 100 L 15 100 Z" fill={shadowArmorColor} />
        {/* Main Chestplate Guard */}
        <path d="M 28 78 L 72 78 L 68 100 L 32 100 Z" fill={armorColor} stroke="#e2e8f0" strokeWidth="1" />
        {/* Golden Shoulder plates / Pauldrons */}
        <path d="M 18 80 Q 28 68 38 78 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.75" />
        <path d="M 82 80 Q 72 68 62 78 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.75" />
        {/* Armor Center Emblem/Knot */}
        <circle cx="50" cy="88" r="4" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
        <line x1="50" y1="84" x2="50" y2="100" stroke="#fbbf24" strokeWidth="1.5" />

        {/* Hair Front Side / Beards */}
        {/* Hair Top Piece */}
        {style.hairStyle.includes('Topknot') && (
          <path d="M 45 32 Q 50 15 55 32 Z" fill={hairColor} />
        )}
        <ellipse cx="50" cy="38" rx="16" ry="7" fill={hairColor} />
        <path d="M 34 38 C 34 32, 66 32, 66 38" stroke={hairColor} strokeWidth="2" fill="none" />

        {/* Facial Expression Details */}
        {/* Eyes */}
        {style.expression.includes('Fierce') ? (
          <>
            <path d="M 40 47 L 46 45" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 60 47 L 54 45" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="43" cy="49" r="1.5" fill="#000000" />
            <circle cx="57" cy="49" r="1.5" fill="#000000" />
          </>
        ) : style.expression.includes('Warm') || style.expression.includes('Smiling') ? (
          <>
            <path d="M 40 48 Q 44 45 46 48" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M 54 48 Q 56 45 60 48" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <circle cx="43" cy="50" r="2.2" fill="#0f172a" />
            <circle cx="57" cy="50" r="2.2" fill="#0f172a" />
          </>
        ) : ( // Calm, Brilliant, Stately, Cold
          <>
            <line x1="39" y1="46" x2="45" y2="46" stroke="#1e293b" strokeWidth="2" />
            <line x1="55" y1="46" x2="61" y2="46" stroke="#1e293b" strokeWidth="2" />
            <circle cx="42" cy="49" r="2.2" fill="#0f172a" />
            <circle cx="58" cy="49" r="2.2" fill="#0f172a" />
          </>
        )}

        {/* Eyebrows */}
        {style.expression.includes('Fierce') ? (
          <>
            <path d="M 37 43 L 47 46" stroke="#000000" strokeWidth="2" />
            <path d="M 63 43 L 53 46" stroke="#000000" strokeWidth="2" />
          </>
        ) : style.expression.includes('Calm') || style.expression.includes('Brilliant') ? (
          <>
            <path d="M 38 43 Q 43 41 47 44" stroke="#0f172a" strokeWidth="1.8" fill="none" />
            <path d="M 62 43 Q 57 41 53 44" stroke="#0f172a" strokeWidth="1.8" fill="none" />
          </>
        ) : (
          <>
            <path d="M 38 44 L 46 44" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M 62 44 L 54 44" stroke="#1e293b" strokeWidth="1.5" />
          </>
        )}

        {/* Nose */}
        <path d="M 49 48 L 49 54 L 52 54" stroke="#eab308" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Mouth with Expression */}
        {style.expression.includes('Roaring') || style.expression.includes('Fierce') ? (
          <path d="M 45 58 Q 50 64 55 58 Z" fill="#be123c" stroke="#111827" strokeWidth="1" />
        ) : style.expression.includes('Warm') || style.expression.includes('Smiling') ? (
          <path d="M 44 57 Q 50 63 56 57" stroke="#991b1b" strokeWidth="2" fill="none" strokeLinecap="round" />
        ) : (
          <line x1="44" y1="58" x2="56" y2="58" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        )}

        {/* Special Beard style */}
        {style.hairStyle.includes('Bearded') && (
          <path d="M 38 58 Q 50 78 62 58 Q 50 82 38 58 Z" fill={hairColor} />
        )}

        {/* Scholar jade Headdress Crown or Imperial crowns */}
        {style.accessory.includes('Crown') || style.accessory.includes('Headdress') ? (
          <g>
            {/* Crown Base block */}
            <rect x="42" y="16" width="16" height="12" rx="2" fill="#f59e0b" stroke="#854d0e" strokeWidth="1" />
            {/* Red gem in crown center */}
            <circle cx="50" cy="22" r="2.5" fill="#ef4444" />
            {/* Stick/pin through the crown headdress */}
            <line x1="36" y1="18" x2="64" y2="24" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ) : style.accessory.includes('Blade') ? (
          <g transform="translate(73, 20) rotate(15)">
            {/* Spear Tip / Green Dragon Blade peeking behind shoulder */}
            <path d="M 0 0 L 8 -10 L 16 0 L 12 40 L 4 40 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
            <path d="M 4 40 L 4 60" stroke="#f59e0b" strokeWidth="2.5" />
            <circle cx="8" cy="15" r="3" fill="#10b981" />
          </g>
        ) : style.accessory.includes('Fan') ? (
          <g transform="translate(18, 55) rotate(-30)">
            {/* Scholar Feather Fan held in lower region */}
            <path d="M 0 30 Q 15 5 30 30 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
            {/* Stick of the fan */}
            <line x1="15" y1="30" x2="15" y2="45" stroke="#b45309" strokeWidth="2" />
          </g>
        ) : style.accessory.includes('Sword') ? (
          <g transform="translate(75, 55) rotate(20)">
            {/* Hilt and Guard of Hand-held weapon */}
            <rect x="2" y="-5" width="4" height="40" fill="#f1f5f9" stroke="#94a3b8" />
            <rect x="-4" y="-5" width="16" height="5" fill="#f59e0b" rx="1.5" />
            <line x1="4" y1="-5" x2="4" y2="-15" stroke="#b45309" strokeWidth="3" />
          </g>
        ) : null}

        {/* Headband / Ribbon details */}
        {style.hairStyle.includes('Ribbon') && (
          <g>
            {/* Horizontal Headband across forehead */}
            <path d="M 36 40 Q 50 38 64 40" stroke="#ef4444" strokeWidth="3.5" fill="none" />
            {/* Pheasant tail ribbon arcs coming out top of head */}
            <path d="M 48 30 Q 25 -5 15 25" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
            <path d="M 52 30 Q 75 -5 85 25" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
          </g>
        )}
      </svg>
    </div>
  );
}
