import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CloudFog,
  CloudLightning,
  ShieldAlert,
  Snowflake,
  X,
} from 'lucide-react';
import {
  DISASTER_CATEGORY_META,
  DisasterCategory,
  DisasterSeverity,
  getDisastersForScenario,
} from '../utils/disasters';
import { SeasonalWeatherId } from '../utils/seasons';
import Button from './Button';

export interface AlertActiveDisaster {
  eventId: string;
  category: DisasterCategory;
  severity: DisasterSeverity;
  title: string;
  description: string;
  affectedCityNames: string[];
}

export interface EvaluatedAlert {
  key: string;
  kind: 'disaster' | 'extreme_weather';
  category: 'flood' | 'famine' | 'blizzard' | 'fog' | 'pandemic' | 'earthquake' | 'tsunami' | 'storm';
  categoryLabel: string;
  severity: 'severe' | 'catastrophic';
  title: string;
  message: string;
  monthLabel: string;
}

export interface AlertsProps {
  weatherId: SeasonalWeatherId;
  gameMonth: number;
  gameYear?: number;
  gameXun?: number;
  scenarioYear?: number;
  activeDisaster?: AlertActiveDisaster | null;
  onViewReliefMeasures: () => void;
  visible?: boolean;
}

const EXTREME_WEATHERS = new Set<SeasonalWeatherId>(['heavy_rain', 'dense_fog', 'snow']);

export function evaluateWeatherAndDisasterAlert(input: {
  weatherId: SeasonalWeatherId;
  gameMonth: number;
  gameYear?: number;
  gameXun?: number;
  scenarioYear?: number;
  activeDisaster?: AlertActiveDisaster | null;
}): EvaluatedAlert | null {
  const {
    weatherId,
    gameMonth,
    gameYear = 190,
    gameXun = 1,
    scenarioYear = gameYear,
    activeDisaster,
  } = input;

  const monthLabel = `${gameYear}年 ${gameMonth}月`;

  if (activeDisaster) {
    const meta = DISASTER_CATEGORY_META[activeDisaster.category];
    const citySummary =
      activeDisaster.affectedCityNames.length > 0
        ? `波及 ${activeDisaster.affectedCityNames.join('、')} · `
        : '';
    const mappedCategory: EvaluatedAlert['category'] =
      activeDisaster.category === 'drought' ? 'famine' : activeDisaster.category;

    return {
      key: `disaster:${scenarioYear}:${activeDisaster.eventId}`,
      kind: 'disaster',
      category: mappedCategory,
      categoryLabel: meta.label,
      severity: activeDisaster.severity === 'catastrophic' ? 'catastrophic' : 'severe',
      title: activeDisaster.title,
      message: `${citySummary}${activeDisaster.description}`,
      monthLabel,
    };
  }

  // Check if gameMonth + gameXun matches a scheduled seasonal disaster for this era
  const scheduledMatch = getDisastersForScenario(scenarioYear).find(
    d => d.triggerMonth === gameMonth && gameXun >= d.triggerXun,
  );

  if (EXTREME_WEATHERS.has(weatherId)) {
    if (weatherId === 'heavy_rain') {
      const isFloodSeason = gameMonth >= 5 && gameMonth <= 9;
      return {
        key: `weather:${gameYear}:${gameMonth}:heavy_rain`,
        kind: 'extreme_weather',
        category: 'flood',
        categoryLabel: isFloodSeason ? '洪涝与暴雨警报' : '强暴雨警报',
        severity: isFloodSeason ? 'catastrophic' : 'severe',
        title: isFloodSeason ? '特大暴雨引发江河洪涝威胁' : '倾盆暴雨阻断前线粮道',
        message: isFloodSeason
          ? '汛期连旬暴雨恐致堤防溃决、仓粮受潮与商路运费攀升，宜尽早筑堤泄洪或调粮平价。'
          : '道路泥泞难行、火计受阻且行军机动力下降，请及时查看救灾与备荒方略。',
        monthLabel,
      };
    }

    if (weatherId === 'snow') {
      const isWinterFamineWindow = gameMonth >= 10 || gameMonth <= 2;
      return {
        key: `weather:${gameYear}:${gameMonth}:snow`,
        kind: 'extreme_weather',
        category: isWinterFamineWindow ? 'famine' : 'blizzard',
        categoryLabel: isWinterFamineWindow ? '寒潮饥荒预警' : '极寒暴雪警报',
        severity: 'catastrophic',
        title: isWinterFamineWindow ? '大雪封道兼有冻馁饥荒之虞' : '季外暴雪严寒封锁关隘',
        message: isWinterFamineWindow
          ? '严寒暴雪导致草料匮乏、关塞断绝、流民增多，宜开仓赈粮或减免灾区赋税。'
          : '突降大雪致使行军迟滞与粮秣损耗加剧，需关注各地仓廪及民生安抚。',
        monthLabel,
      };
    }

    if (weatherId === 'dense_fog') {
      return {
        key: `weather:${gameYear}:${gameMonth}:dense_fog`,
        kind: 'extreme_weather',
        category: 'fog',
        categoryLabel: '弥天浓雾预警',
        severity: 'severe',
        title: '重雾锁江阻航并伴时疫风险',
        message: '视界骤降且湿瘴凝聚，水陆转运迟滞、军民易染疾疫，请备妥医疗与检疫举措。',
        monthLabel,
      };
    }
  }

  if (scheduledMatch) {
    const meta = DISASTER_CATEGORY_META[scheduledMatch.category];
    return {
      key: `scheduled:${scenarioYear}:${scheduledMatch.id}`,
      kind: 'disaster',
      category: scheduledMatch.category === 'drought' ? 'famine' : scheduledMatch.category,
      categoryLabel: meta.label,
      severity: scheduledMatch.severity === 'catastrophic' ? 'catastrophic' : 'severe',
      title: scheduledMatch.title,
      message: scheduledMatch.description,
      monthLabel,
    };
  }

  return null;
}

function renderAlertIcon(category: EvaluatedAlert['category']) {
  if (category === 'flood') return <CloudLightning size={18} />;
  if (category === 'famine' || category === 'blizzard') return <Snowflake size={18} />;
  if (category === 'fog') return <CloudFog size={18} />;
  if (category === 'storm') return <AlertTriangle size={18} />;
  return <ShieldAlert size={18} />;
}

export default function Alerts({
  weatherId,
  gameMonth,
  gameYear,
  gameXun,
  scenarioYear,
  activeDisaster,
  onViewReliefMeasures,
  visible = true,
}: AlertsProps) {
  const [dismissedKeys, setDismissedKeys] = useState<string[]>([]);

  const alert = useMemo(
    () =>
      evaluateWeatherAndDisasterAlert({
        weatherId,
        gameMonth,
        gameYear,
        gameXun,
        scenarioYear,
        activeDisaster,
      }),
    [weatherId, gameMonth, gameYear, gameXun, scenarioYear, activeDisaster],
  );

  if (!visible || !alert || dismissedKeys.includes(alert.key)) {
    return null;
  }

  const handleDismiss = () => {
    setDismissedKeys(prev => (prev.includes(alert.key) ? prev : [...prev, alert.key]));
  };

  return (
    <div id="alerts-overlay" className="alerts-overlay" aria-live="polite" aria-atomic="true">
      <div
        className={`alerts-toast ${alert.severity === 'catastrophic' ? 'is-catastrophic' : 'is-severe'}`}
        role="status"
      >
        <div className="alerts-toast-icon" aria-hidden="true">
          {renderAlertIcon(alert.category)}
        </div>

        <div className="alerts-toast-body">
          <div className="alerts-toast-meta">
            <span className="alerts-toast-category">{alert.categoryLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="alerts-toast-date tabular-nums">{alert.monthLabel}</span>
          </div>
          <h4 className="alerts-toast-title">{alert.title}</h4>
          <p className="alerts-toast-message">{alert.message}</p>
        </div>

        <div className="alerts-toast-actions">
          <Button
            id="btn-view-relief-measures"
            className="alerts-toast-cta"
            onClick={onViewReliefMeasures}
          >
            View Relief Measures
          </Button>
          <button
            id="btn-dismiss-alert"
            type="button"
            className="alerts-toast-dismiss"
            onClick={handleDismiss}
            aria-label="关闭警报"
            title="暂不提示此警报"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
