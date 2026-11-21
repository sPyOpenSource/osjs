import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  GitBranch,
  List,
  Network,
  Scissors,
  Swords,
  Target,
} from 'lucide-react';
import { Faction, Officer, RelationshipRelation } from '../types';
import {
  buildRelationshipTree,
  RELATION_TYPE_META,
  RelationFilterType,
  RelationshipTreeNode,
} from '../utils/relationshipTree';
import AvatarRenderer from './AvatarRenderer';
import Button from './Button';

interface RelationshipTreeProps {
  officers: Officer[];
  factions: Faction[];
  relationships: RelationshipRelation[];
  playerFactionId?: string;
  playerFactionName?: string;
  selectedOfficerId?: string;
  onSelectOfficer?: (officer: Officer) => void;
  onDuelPair: (off1: Officer, off2: Officer) => void;
  onBreakRelationship: (fromId: string, toId: string) => void;
}

export default function RelationshipTree({
  officers,
  factions,
  relationships,
  playerFactionId,
  playerFactionName,
  selectedOfficerId,
  onSelectOfficer,
  onDuelPair,
  onBreakRelationship,
}: RelationshipTreeProps) {
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [filterType, setFilterType] = useState<RelationFilterType>('all');
  const [maxDepth, setMaxDepth] = useState<number>(3);
  const ownOfficers = useMemo(
    () =>
      playerFactionId
        ? officers.filter(o => o.factionId === playerFactionId)
        : officers,
    [officers, playerFactionId]
  );

  const [rootOfficerId, setRootOfficerId] = useState<string>(() => {
    const initialPool = playerFactionId
      ? officers.filter(o => o.factionId === playerFactionId)
      : officers;
    if (selectedOfficerId && initialPool.some(o => o.id === selectedOfficerId)) {
      return selectedOfficerId;
    }
    return initialPool[0]?.id || '';
  });
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!ownOfficers.some(o => o.id === rootOfficerId)) {
      setRootOfficerId(ownOfficers[0]?.id || '');
    }
  }, [ownOfficers, rootOfficerId]);

  const factionMap = useMemo(
    () => new Map(factions.map(f => [f.id, f])),
    [factions]
  );

  const officerMap = useMemo(
    () => new Map(officers.map(o => [o.id, o])),
    [officers]
  );

  const treeResult = useMemo(
    () =>
      buildRelationshipTree(officers, relationships, rootOfficerId, {
        maxDepth,
        filterType,
      }),
    [officers, relationships, rootOfficerId, maxDepth, filterType]
  );

  const sortedOfficerOptions = useMemo(() => {
    const degreeById = new Map<string, number>();
    for (const rel of relationships) {
      degreeById.set(rel.fromOfficerId, (degreeById.get(rel.fromOfficerId) ?? 0) + 1);
      degreeById.set(rel.toOfficerId, (degreeById.get(rel.toOfficerId) ?? 0) + 1);
    }
    return [...ownOfficers].sort((a, b) => {
      const diff = (degreeById.get(b.id) ?? 0) - (degreeById.get(a.id) ?? 0);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name, 'zh-CN');
    });
  }, [ownOfficers, relationships]);

  const handleReroot = (officer: Officer) => {
    setRootOfficerId(officer.id);
    setCollapsedIds({});
    onSelectOfficer?.(officer);
  };

  const toggleCollapse = (officerId: string) => {
    setCollapsedIds(prev => ({ ...prev, [officerId]: !prev[officerId] }));
  };

  const collapseToDirect = () => {
    if (!treeResult.root) return;
    const next: Record<string, boolean> = {};
    for (const child of treeResult.root.children) {
      if (child.children.length > 0) {
        next[child.officer.id] = true;
      }
    }
    setCollapsedIds(next);
  };

  const renderTreeNode = (node: RelationshipTreeNode, parentOfficer?: Officer) => {
    const hasChildren = node.children.length > 0;
    const isCollapsed = Boolean(collapsedIds[node.officer.id]);
    const faction = factionMap.get(node.officer.factionId);
    const relMeta = node.relationFromParent
      ? RELATION_TYPE_META[node.relationFromParent]
      : null;

    return (
      <li
        key={node.officer.id}
        className={`rel-tree-branch ${node.depth === 0 ? 'is-root-branch' : ''}`}
      >
        <div
          className={`rel-tree-node-card ${node.depth === 0 ? 'is-root' : ''}`}
          data-testid={`rel-tree-node-${node.officer.id}`}
        >
          {relMeta && (
            <span className={`rel-tree-edge-pill ${relMeta.badgeClass}`}>
              <span>{relMeta.icon}</span>
              <span>{relMeta.label}</span>
            </span>
          )}

          <div className="rel-tree-node-main">
            {hasChildren ? (
              <button
                type="button"
                className="rel-tree-toggle"
                aria-label={isCollapsed ? `展开 ${node.officer.name} 分支` : `收起 ${node.officer.name} 分支`}
                aria-expanded={!isCollapsed}
                onClick={() => toggleCollapse(node.officer.id)}
              >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
            ) : (
              <span className="rel-tree-leaf-dot" aria-hidden="true" />
            )}

            <AvatarRenderer style={node.officer.avatarStyle} size={node.depth === 0 ? 44 : 36} />

            <div className="rel-tree-node-info">
              <div className="rel-tree-node-title">
                <strong>{node.officer.name}</strong>
                {faction && (
                  <span className="rel-tree-faction-tag">
                    {faction.name}
                  </span>
                )}
                {node.depth === 0 && <span className="rel-tree-root-tag">树根中心</span>}
              </div>
              <div className="rel-tree-node-sub">
                <span>武 {node.officer.stats.force}</span>
                <span>·</span>
                <span>智 {node.officer.stats.intelligence}</span>
                {hasChildren && (
                  <>
                    <span>·</span>
                    <span>直系 {node.children.length}</span>
                  </>
                )}
                {node.extraConnectionsCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="rel-tree-extra">+{node.extraConnectionsCount} 旁枝连带</span>
                  </>
                )}
              </div>
            </div>

            <div className="rel-tree-node-actions">
              {node.depth > 0 && (
                <button
                  type="button"
                  className="rel-tree-action-btn is-focus"
                  title={`以 ${node.officer.name} 为树根中心展开`}
                  onClick={() => handleReroot(node.officer)}
                >
                  <Target size={12} /> 设为中心
                </button>
              )}
              {parentOfficer && (
                <>
                  <button
                    type="button"
                    className="rel-tree-action-btn is-duel"
                    title={`${parentOfficer.name} 与 ${node.officer.name} 单挑`}
                    onClick={() => onDuelPair(parentOfficer, node.officer)}
                  >
                    <Swords size={12} /> 单挑
                  </button>
                  <button
                    type="button"
                    className="rel-tree-action-btn is-sever"
                    title={`斩断 ${parentOfficer.name} 与 ${node.officer.name} 羁绊`}
                    onClick={() => onBreakRelationship(parentOfficer.id, node.officer.id)}
                  >
                    <Scissors size={12} /> 斩断
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <ul className="rel-tree-children" role="group">
            {node.children.map(child => renderTreeNode(child, node.officer))}
          </ul>
        )}
      </li>
    );
  };

  const filteredListRelationships = useMemo(
    () =>
      relationships.filter(r =>
        filterType === 'all' ? true : r.type === filterType
      ),
    [relationships, filterType]
  );

  return (
    <div className="rel-tree-panel" data-testid="relationship-tree-panel">
      <div className="rel-tree-header">
        <div>
          <span className="rel-tree-eyebrow">
            <GitBranch size={15} /> 名将人脉树状图谱
          </span>
          <p className="trade-muted">
            以任意名将为根节点层层展开桃园结义、君臣效忠、联姻与宿敌分支；可点击节点“设为中心”切换视角。
          </p>
        </div>

        <div className="rel-tree-view-switch" role="group" aria-label="关系展示模式">
          <Button
            id="btn-bonds-tree-view"
            aria-pressed={viewMode === 'tree'}
            onClick={() => setViewMode('tree')}
          >
            <Network size={14} /> 关系树视图
          </Button>
          <Button
            id="btn-bonds-list-view"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <List size={14} /> 全部连带 ({filteredListRelationships.length})
          </Button>
        </div>
      </div>

      <div className="rel-tree-toolbar">
        {viewMode === 'tree' && (
          <label className="rel-tree-control">
            <span>
              树根中心人物{playerFactionId ? ` (${playerFactionName ?? playerFactionId} · ${sortedOfficerOptions.length} 位)` : ''}
            </span>
            <select
              id="rel-tree-root-select"
              aria-label="树根中心人物"
              value={ownOfficers.some(o => o.id === rootOfficerId) ? rootOfficerId : ''}
              disabled={sortedOfficerOptions.length === 0}
              onChange={e => {
                const chosen = officerMap.get(e.target.value);
                if (chosen) handleReroot(chosen);
              }}
            >
              {sortedOfficerOptions.length === 0 ? (
                <option value="">当前所属阵营暂无武将</option>
              ) : (
                sortedOfficerOptions.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({factionMap.get(o.factionId)?.name || '在野'})
                  </option>
                ))
              )}
            </select>
          </label>
        )}

        <label className="rel-tree-control">
          <span>关系类型筛选</span>
          <select
            id="rel-tree-type-filter"
            aria-label="关系类型筛选"
            value={filterType}
            onChange={e => setFilterType(e.target.value as RelationFilterType)}
          >
            <option value="all">全部关系</option>
            <option value="Sworn Brother">金兰结义 🤝</option>
            <option value="Spouse">金玉良缘 💍</option>
            <option value="Lord">主臣效忠 👑</option>
            <option value="Confidant">莫逆红颜 🎭</option>
            <option value="Trust">至信之交 ⭐</option>
            <option value="Rival">生平宿敌 ⚡</option>
          </select>
        </label>

        {viewMode === 'tree' && (
          <>
            <label className="rel-tree-control">
              <span>展开深度</span>
              <select
                id="rel-tree-depth-select"
                aria-label="展开深度"
                value={maxDepth}
                onChange={e => setMaxDepth(Number(e.target.value))}
              >
                <option value={2}>2 层分支</option>
                <option value={3}>3 层分支</option>
                <option value={4}>4 层分支</option>
              </select>
            </label>

            <div className="rel-tree-expand-btns">
              <Button id="btn-rel-tree-expand-all" onClick={() => setCollapsedIds({})}>
                展开全部
              </Button>
              <Button id="btn-rel-tree-collapse-deep" onClick={collapseToDirect}>
                仅看直系
              </Button>
            </div>
          </>
        )}
      </div>

      {viewMode === 'tree' && treeResult.hubOfficers.length > 0 && (
        <div className="rel-tree-hubs">
          <span className="trade-muted">核心枢纽人物：</span>
          {treeResult.hubOfficers.map(({ officer, degree }) => (
            <button
              key={officer.id}
              type="button"
              className={`rel-tree-hub-chip ${officer.id === rootOfficerId ? 'is-active' : ''}`}
              onClick={() => handleReroot(officer)}
            >
              {officer.name} ({degree})
            </button>
          ))}
        </div>
      )}

      {viewMode === 'tree' ? (
        treeResult.root ? (
          <div className="rel-tree-canvas">
            <div className="rel-tree-stats-bar">
              <span>
                已覆盖人物：<strong>{treeResult.reachableCount}</strong> 人 · 展开枝干连线：
                <strong>{treeResult.visibleEdgeCount}</strong> 条 · 全盘去重羁绊：
                <strong>{treeResult.totalUniqueBonds}</strong> 对
              </span>
            </div>

            {treeResult.root.children.length === 0 ? (
              <div className="rel-tree-empty">
                <ul className="rel-tree-root-list" role="tree">
                  {renderTreeNode(treeResult.root)}
                </ul>
                <p className="trade-muted">
                  {treeResult.root.officer.name} 在当前筛选条件下暂无对外羁绊；可在上方锻造工坊添加，或点击“核心枢纽人物”切换根节点。
                </p>
              </div>
            ) : (
              <ul className="rel-tree-root-list" role="tree" aria-label="武将关系树">
                {renderTreeNode(treeResult.root)}
              </ul>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500">
            未找到所选中心名将，请从下拉列表选择一位人物。
          </div>
        )
      ) : filteredListRelationships.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredListRelationships.map((rel, idx) => {
            const off1 = officerMap.get(rel.fromOfficerId);
            const off2 = officerMap.get(rel.toOfficerId);
            if (!off1 || !off2) return null;
            const meta = RELATION_TYPE_META[rel.type];

            return (
              <div
                key={`${rel.fromOfficerId}-${rel.toOfficerId}-${idx}`}
                className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between gap-3"
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-slate-200 text-sm">{off1.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({off1.stats.force} 武力)
                    </span>
                  </div>

                  <span className={`rel-tree-edge-pill ${meta.badgeClass}`}>
                    {meta.icon} {meta.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="font-serif text-slate-200 text-sm">{off2.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({off2.stats.force} 武力)
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-slate-950/40 p-1 rounded-lg border border-slate-950">
                  <button
                    id={`btn-duel-sim-${idx}`}
                    type="button"
                    onClick={() => onDuelPair(off1, off2)}
                    className="text-[10px] text-sky-300 font-semibold px-2 py-1 flex items-center gap-1 active:scale-95 transition cursor-pointer"
                  >
                    ⚔️ 挥军阵前单挑
                  </button>

                  <button
                    id={`btn-sever-bond-${idx}`}
                    type="button"
                    onClick={() => onBreakRelationship(off1.id, off2.id)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 active:scale-95 transition cursor-pointer"
                  >
                    斩断羁绊情仇
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-xs text-slate-500">
          天盘羁绊中枢目前尚无匹配该类型的人际纽带名录。
        </div>
      )}
    </div>
  );
}
