import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3, Sparkles } from 'lucide-react';
import { Faction } from '../types';
import {
  DiplomacyState,
  FactionRelationDatum,
  buildRelationChartData,
} from '../utils/diplomacy';

interface DiplomacyRelationChartProps {
  factions: Faction[];
  diplomacyState: DiplomacyState;
  playerFaction: string;
  selectedTargetFaction: string;
  onSelectTargetFaction?: (factionId: string) => void;
}

function getBarFill(datum: FactionRelationDatum): string {
  if (datum.hasAlliance) return '#fbbf24'; // amber-400 (allied)
  if (datum.score >= 30) return '#34d399'; // emerald-400 (friendly / prime ally candidate)
  if (datum.score > 0) return '#38bdf8'; // sky-400 (warm / persuadable)
  if (datum.score === 0) return '#64748b'; // slate-500 (neutral)
  if (datum.score > -40) return '#fb923c'; // orange-400 (cold)
  return '#fb7185'; // rose-400 (hostile)
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: FactionRelationDatum }>;
}

function RelationChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const allyAdvice = d.hasAlliance
    ? '已缔结攻守同盟'
    : d.score >= 30
      ? '高好感潜质盟友，适合派遣使节请盟'
      : d.score > 0
        ? '关系融洽，赠礼或通商后即可请盟'
        : d.score === 0
          ? '中立观望，可通过赠礼或通商建立互信'
          : '邦交冷淡或敌对，需多次厚礼破冰';

  return (
    <div className="diplomacy-chart-tooltip">
      <div className="diplomacy-chart-tooltip-title">
        <strong>{d.name}</strong>
        <span className="trade-muted">{d.ruler}</span>
      </div>
      <div className="diplomacy-chart-tooltip-row">
        <span>当前好感</span>
        <strong>{d.score > 0 ? `+${d.score}` : d.score}</strong>
      </div>
      <div className="diplomacy-chart-tooltip-row">
        <span>外交定性</span>
        <span>{d.standingLabel}</span>
      </div>
      {(d.hasAlliance || d.hasTradePact) && (
        <div className="diplomacy-chart-tooltip-pacts">
          {d.hasAlliance && <span className="diplomacy-pact-tag is-alliance">攻守同盟</span>}
          {d.hasTradePact && <span className="diplomacy-pact-tag is-trade">通商条约</span>}
        </div>
      )}
      <p className="diplomacy-chart-tooltip-hint">{allyAdvice}</p>
    </div>
  );
}

export default function DiplomacyRelationChart({
  factions,
  diplomacyState,
  playerFaction,
  selectedTargetFaction,
  onSelectTargetFaction,
}: DiplomacyRelationChartProps) {
  const playerFactionInfo = useMemo(
    () => factions.find(f => f.id === playerFaction),
    [factions, playerFaction]
  );

  const chartData = useMemo(
    () => buildRelationChartData(diplomacyState, factions, playerFaction),
    [diplomacyState, factions, playerFaction]
  );

  const allyCandidates = useMemo(
    () => chartData.filter(d => !d.hasAlliance && d.potentialAlly),
    [chartData]
  );

  const chartHeight = Math.max(320, chartData.length * 28 + 44);

  return (
    <section
      className="diplomacy-chart-section"
      aria-label="列国邦交关系图谱"
      data-testid="diplomacy-relation-chart"
    >
      <div className="diplomacy-chart-header">
        <div>
          <h3>
            <BarChart3 size={18} /> 列国好感对比柱状图（{playerFactionInfo?.name || playerFaction}视角）
          </h3>
          <p className="trade-muted">
            按当前关系分值由高到低排列（−100 至 +100），分值达到 +30 以上即属高潜质盟友；点击柱条可直接选为出使对象。
          </p>
        </div>

        <div className="diplomacy-chart-legend" aria-label="图例说明">
          <span className="diplomacy-legend-item">
            <i className="diplomacy-legend-swatch is-allied" /> 同盟
          </span>
          <span className="diplomacy-legend-item">
            <i className="diplomacy-legend-swatch is-friendly" /> 潜质盟友 (≥+30)
          </span>
          <span className="diplomacy-legend-item">
            <i className="diplomacy-legend-swatch is-warm" /> 友善倾心 (+1~+29)
          </span>
          <span className="diplomacy-legend-item">
            <i className="diplomacy-legend-swatch is-cold" /> 冷淡/敌对 (&lt;0)
          </span>
        </div>
      </div>

      {allyCandidates.length > 0 && (
        <div className="diplomacy-ally-callout" data-testid="diplomacy-ally-callout">
          <Sparkles size={14} />
          <span>
            潜在可结盟势力：
            {allyCandidates.map((candidate, index) => (
              <React.Fragment key={candidate.factionId}>
                {index > 0 && '、'}
                <button
                  type="button"
                  className="diplomacy-ally-link"
                  onClick={() => onSelectTargetFaction?.(candidate.factionId)}
                >
                  {candidate.name} (+{candidate.score})
                </button>
              </React.Fragment>
            ))}
          </span>
        </div>
      )}

      <div className="diplomacy-chart-wrap" style={{ height: `${chartHeight}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 24, bottom: 8, left: 16 }}
          >
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[-100, 100]}
              ticks={[-100, -70, -30, 0, 30, 60, 100]}
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={108}
              stroke="#94a3b8"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              interval={0}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
              content={<RelationChartTooltip />}
            />
            <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
            <ReferenceLine
              x={30}
              stroke="#34d399"
              strokeDasharray="4 4"
              label={{
                value: '盟友门槛 +30',
                position: 'top',
                fill: '#6ee7b7',
                fontSize: 11,
              }}
            />
            <Bar
              dataKey="score"
              name="邦交好感"
              radius={[3, 3, 3, 3]}
              barSize={16}
              onClick={(_barItem, index) => {
                const datum = typeof index === 'number' ? chartData[index] : undefined;
                if (datum?.factionId) onSelectTargetFaction?.(datum.factionId);
              }}
            >
              {chartData.map(entry => {
                const isSelected = entry.factionId === selectedTargetFaction;
                return (
                  <Cell
                    key={entry.factionId}
                    fill={getBarFill(entry)}
                    stroke={isSelected ? '#fbbf24' : 'transparent'}
                    strokeWidth={isSelected ? 2 : 0}
                    cursor="pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
