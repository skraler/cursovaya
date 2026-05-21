/** Параметры ориентированного ребра (менять только здесь) */
const ARROW_LENGTH = 10;
/** Толщина прямого стержня */
const LINE_WIDTH = 2.5;
/** Ширина основания стрелки на конце */
const ARROW_WIDTH = 7;

/**
 * Прямой стержень от вершины-источника + одна стрелка у вершины-назначения.
 * @param {ReturnType<import('../svgCoords.js').edgeGeometry>} geom
 * @returns {string}
 */
export function directedEdgeShapePoints(geom) {
  const { tipFrom, tipTo, ux, uy } = geom;
  const px = -uy;
  const py = ux;
  const shaftHw = LINE_WIDTH / 2;
  const arrowHw = ARROW_WIDTH / 2;

  const bT = { x: tipTo.x - ux * ARROW_LENGTH, y: tipTo.y - uy * ARROW_LENGTH };

  const wing = (base, hw) => ({
    L: { x: base.x + px * hw, y: base.y + py * hw },
    R: { x: base.x - px * hw, y: base.y - py * hw },
  });

  const pt = (p) => `${p.x},${p.y}`;
  const start = wing(tipFrom, shaftHw);
  const shaftT = wing(bT, shaftHw);
  const headT = wing(bT, arrowHw);

  return [
    pt(start.L),
    pt(shaftT.L),
    pt(headT.L),
    pt(tipTo),
    pt(headT.R),
    pt(shaftT.R),
    pt(start.R),
  ].join(' ');
}
