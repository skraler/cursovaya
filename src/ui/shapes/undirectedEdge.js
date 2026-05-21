/** Параметры неориентированного ребра (менять только здесь) */
const ARROW_LENGTH = 10;
/** Толщина прямого участка между стрелками */
const LINE_WIDTH = 2.5;
/** Ширина основания стрелки на концах */
const ARROW_WIDTH = 7;

/**
 * Прямой стержень + отдельные стрелки на каждом конце (единый polygon).
 * @param {ReturnType<import('../svgCoords.js').edgeGeometry>} geom
 * @returns {string}
 */
export function undirectedEdgeShapePoints(geom) {
  const { tipFrom, tipTo, ux, uy } = geom;
  const px = -uy;
  const py = ux;
  const shaftHw = LINE_WIDTH / 2;
  const arrowHw = ARROW_WIDTH / 2;

  const bF = { x: tipFrom.x + ux * ARROW_LENGTH, y: tipFrom.y + uy * ARROW_LENGTH };
  const bT = { x: tipTo.x - ux * ARROW_LENGTH, y: tipTo.y - uy * ARROW_LENGTH };

  const wing = (base, hw) => ({
    L: { x: base.x + px * hw, y: base.y + py * hw },
    R: { x: base.x - px * hw, y: base.y - py * hw },
  });

  const pt = (p) => `${p.x},${p.y}`;
  const headF = wing(bF, arrowHw);
  const headT = wing(bT, arrowHw);
  const shaftF = wing(bF, shaftHw);
  const shaftT = wing(bT, shaftHw);

  return [
    pt(tipFrom),
    pt(headF.L),
    pt(shaftF.L),
    pt(shaftT.L),
    pt(headT.L),
    pt(tipTo),
    pt(headT.R),
    pt(shaftT.R),
    pt(shaftF.R),
    pt(headF.R),
  ].join(' ');
}
