import { useMemo } from 'react'
import { quickHelpData } from '../data/quickHelpData'
import { areaColor } from '../utils/areaColor'
import useAppStore from '../store/useAppStore'

// quickHelpId → SVG region ids that should light up
const REGION_MAP = {
  neck:         ['nk_f', 'nk_b'],
  shoulders:    ['shldr_l', 'shldr_r', 'ua_lf', 'ua_rf', 'ua_lb', 'ua_rb'],
  'upper-back': ['bk_u', 'bk_l'],
  spine:        ['sp', 'bk_l'],
  wrists:       ['fa_lf', 'fa_rf', 'hnd_l', 'hnd_r', 'fa_lb', 'fa_rb'],
  eyes:         ['hd_f', 'hd_b'],
  hips:         ['hip_f', 'hip_b'],
  traps:        ['trp_l', 'trp_r', 'bk_u', 'nk_b'],
  legs:         ['th_lf', 'th_rf', 'sh_lf', 'sh_rf', 'th_lb', 'th_rb', 'sh_lb', 'sh_rb'],
}

export default function BodyDiagram({ hoveredArea }) {
  const colorblindMode = useAppStore(s => s.colorblindMode)

  const colorMap = useMemo(() => {
    const map = {}
    quickHelpData.forEach(d => { map[d.id] = areaColor(d.areaColor, colorblindMode) })
    return map
  }, [colorblindMode])

  const activeRegions = hoveredArea ? (REGION_MAP[hoveredArea] ?? []) : []
  const activeColor = hoveredArea ? colorMap[hoveredArea] : null

  function s(...ids) {
    const active = ids.some(id => activeRegions.includes(id))
    return {
      fill: active ? activeColor : 'var(--text)',
      opacity: active ? 0.82 : 0.13,
      transition: 'fill 0.15s ease, opacity 0.15s ease',
    }
  }

  return (
    <svg
      viewBox="0 0 96 162"
      width="86"
      height="148"
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* ── FRONT (centered at x=24) ── */}
      <circle cx="24" cy="12" r="10"              style={s('hd_f')} />
      <rect x="20" y="22" width="8"  height="7"  rx="3" style={s('nk_f')} />
      <ellipse cx="11" cy="33" rx="7" ry="6"     style={s('shldr_l')} />
      <ellipse cx="37" cy="33" rx="7" ry="6"     style={s('shldr_r')} />
      <rect x="14" y="26" width="20" height="44" rx="6" style={s('trs_f')} />
      <rect x="7"  y="28" width="7"  height="28" rx="3" style={s('ua_lf')} />
      <rect x="34" y="28" width="7"  height="28" rx="3" style={s('ua_rf')} />
      <rect x="5"  y="54" width="7"  height="22" rx="3" style={s('fa_lf')} />
      <rect x="36" y="54" width="7"  height="22" rx="3" style={s('fa_rf')} />
      <ellipse cx="8"  cy="80" rx="4" ry="5"     style={s('hnd_l')} />
      <ellipse cx="40" cy="80" rx="4" ry="5"     style={s('hnd_r')} />
      <rect x="12" y="68" width="24" height="14" rx="5" style={s('hip_f')} />
      <rect x="12" y="80" width="11" height="34" rx="4" style={s('th_lf')} />
      <rect x="25" y="80" width="11" height="34" rx="4" style={s('th_rf')} />
      <rect x="12" y="112" width="10" height="36" rx="4" style={s('sh_lf')} />
      <rect x="26" y="112" width="10" height="36" rx="4" style={s('sh_rf')} />

      {/* ── BACK (centered at x=72, offset +48) ── */}
      <circle cx="72" cy="12" r="10"              style={s('hd_b')} />
      <rect x="68" y="22" width="8"  height="7"  rx="3" style={s('nk_b')} />
      <ellipse cx="59" cy="31" rx="8" ry="7"     style={s('trp_l')} />
      <ellipse cx="85" cy="31" rx="8" ry="7"     style={s('trp_r')} />
      <rect x="62" y="26" width="20" height="22" rx="6" style={s('bk_u')} />
      <rect x="62" y="46" width="20" height="22" rx="6" style={s('bk_l')} />
      <rect x="70" y="26" width="4"  height="54" rx="2" style={s('sp')} />
      <rect x="55" y="28" width="7"  height="28" rx="3" style={s('ua_lb')} />
      <rect x="82" y="28" width="7"  height="28" rx="3" style={s('ua_rb')} />
      <rect x="53" y="54" width="7"  height="22" rx="3" style={s('fa_lb')} />
      <rect x="84" y="54" width="7"  height="22" rx="3" style={s('fa_rb')} />
      <rect x="60" y="68" width="24" height="14" rx="5" style={s('hip_b')} />
      <rect x="60" y="80" width="11" height="34" rx="4" style={s('th_lb')} />
      <rect x="73" y="80" width="11" height="34" rx="4" style={s('th_rb')} />
      <rect x="60" y="112" width="10" height="36" rx="4" style={s('sh_lb')} />
      <rect x="74" y="112" width="10" height="36" rx="4" style={s('sh_rb')} />

      {/* View labels */}
      <text x="24" y="156" textAnchor="middle" fontSize="6.5"
        style={{ fill: 'var(--text-muted)', opacity: 0.35 }}>przód</text>
      <text x="72" y="156" textAnchor="middle" fontSize="6.5"
        style={{ fill: 'var(--text-muted)', opacity: 0.35 }}>tył</text>
    </svg>
  )
}
