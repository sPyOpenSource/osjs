import { Officer, RelationshipRelation } from '../types';

export type RelationFilterType = RelationshipRelation['type'] | 'all';

export interface RelationshipTreeNode {
  officer: Officer;
  depth: number;
  relationFromParent?: RelationshipRelation['type'];
  parentOfficerId?: string;
  children: RelationshipTreeNode[];
  extraConnectionsCount: number;
}

export interface RelationshipTreeResult {
  root: RelationshipTreeNode | null;
  reachableCount: number;
  visibleEdgeCount: number;
  totalUniqueBonds: number;
  hubOfficers: Array<{ officer: Officer; degree: number }>;
}

export const RELATION_TYPE_META: Record<
  RelationshipRelation['type'],
  { label: string; icon: string; badgeClass: string }
> = {
  'Sworn Brother': {
    label: '金兰结义',
    icon: '🤝',
    badgeClass: 'is-sworn',
  },
  Spouse: {
    label: '金玉良缘',
    icon: '💍',
    badgeClass: 'is-spouse',
  },
  Lord: {
    label: '主臣效忠',
    icon: '👑',
    badgeClass: 'is-lord',
  },
  Confidant: {
    label: '莫逆红颜',
    icon: '🎭',
    badgeClass: 'is-confidant',
  },
  Trust: {
    label: '至信之交',
    icon: '⭐',
    badgeClass: 'is-trust',
  },
  Rival: {
    label: '生平宿敌',
    icon: '⚡',
    badgeClass: 'is-rival',
  },
};

const pairKey = (a: string, b: string) => (a < b ? `${a}::${b}` : `${b}::${a}`);

export function getUniqueRelationships(
  officers: Officer[],
  relationships: RelationshipRelation[],
  filterType: RelationFilterType = 'all'
): RelationshipRelation[] {
  const validIds = new Set(officers.map(o => o.id));
  const seen = new Set<string>();
  const unique: RelationshipRelation[] = [];

  for (const rel of relationships) {
    if (rel.fromOfficerId === rel.toOfficerId) continue;
    if (!validIds.has(rel.fromOfficerId) || !validIds.has(rel.toOfficerId)) continue;
    if (filterType !== 'all' && rel.type !== filterType) continue;
    const key = pairKey(rel.fromOfficerId, rel.toOfficerId);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(rel);
  }
  return unique;
}

export function buildRelationshipTree(
  officers: Officer[],
  relationships: RelationshipRelation[],
  rootOfficerId: string,
  options: { maxDepth?: number; filterType?: RelationFilterType } = {}
): RelationshipTreeResult {
  const maxDepth = Math.max(1, Math.min(6, options.maxDepth ?? 3));
  const filterType = options.filterType ?? 'all';
  const officerMap = new Map(officers.map(o => [o.id, o]));
  const uniqueRels = getUniqueRelationships(officers, relationships, filterType);

  // Build undirected adjacency list
  const adj = new Map<string, Array<{ neighborId: string; type: RelationshipRelation['type'] }>>();
  for (const rel of uniqueRels) {
    if (!adj.has(rel.fromOfficerId)) adj.set(rel.fromOfficerId, []);
    if (!adj.has(rel.toOfficerId)) adj.set(rel.toOfficerId, []);
    adj.get(rel.fromOfficerId)!.push({ neighborId: rel.toOfficerId, type: rel.type });
    adj.get(rel.toOfficerId)!.push({ neighborId: rel.fromOfficerId, type: rel.type });
  }

  // Also compute global hub officers across all relation types so quick-jump chips stay informative
  const allUniqueRels =
    filterType === 'all' ? uniqueRels : getUniqueRelationships(officers, relationships, 'all');
  const degreeMap = new Map<string, number>();
  for (const rel of allUniqueRels) {
    degreeMap.set(rel.fromOfficerId, (degreeMap.get(rel.fromOfficerId) ?? 0) + 1);
    degreeMap.set(rel.toOfficerId, (degreeMap.get(rel.toOfficerId) ?? 0) + 1);
  }
  const hubOfficers = Array.from(degreeMap.entries())
    .map(([id, degree]) => ({ officer: officerMap.get(id)!, degree }))
    .filter(item => Boolean(item.officer))
    .sort((a, b) => b.degree - a.degree || a.officer.name.localeCompare(b.officer.name, 'zh-CN'))
    .slice(0, 8);

  const rootOfficer = officerMap.get(rootOfficerId);
  if (!rootOfficer) {
    return {
      root: null,
      reachableCount: 0,
      visibleEdgeCount: 0,
      totalUniqueBonds: uniqueRels.length,
      hubOfficers,
    };
  }

  // BFS spanning tree so every reachable officer appears once at shortest distance
  const visited = new Set<string>([rootOfficerId]);
  const rootNode: RelationshipTreeNode = {
    officer: rootOfficer,
    depth: 0,
    children: [],
    extraConnectionsCount: 0,
  };

  const queue: RelationshipTreeNode[] = [rootNode];
  let visibleEdgeCount = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adj.get(current.officer.id) ?? [];

    if (current.depth >= maxDepth) {
      current.extraConnectionsCount = neighbors.filter(n => n.neighborId !== current.parentOfficerId).length;
      continue;
    }

    let hiddenCrossLinks = 0;
    for (const edge of neighbors) {
      if (visited.has(edge.neighborId)) {
        if (edge.neighborId !== current.parentOfficerId) {
          hiddenCrossLinks += 1;
        }
        continue;
      }
      const childOfficer = officerMap.get(edge.neighborId);
      if (!childOfficer) continue;

      visited.add(edge.neighborId);
      const childNode: RelationshipTreeNode = {
        officer: childOfficer,
        depth: current.depth + 1,
        relationFromParent: edge.type,
        parentOfficerId: current.officer.id,
        children: [],
        extraConnectionsCount: 0,
      };
      current.children.push(childNode);
      queue.push(childNode);
      visibleEdgeCount += 1;
    }

    current.extraConnectionsCount = hiddenCrossLinks;
  }

  return {
    root: rootNode,
    reachableCount: visited.size,
    visibleEdgeCount,
    totalUniqueBonds: uniqueRels.length,
    hubOfficers,
  };
}
