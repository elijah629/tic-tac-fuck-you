export interface XpEvent {
  xp: number;
  label: string;
}

export class Game {
  board: Board;
  winLength: number;
  human: Team;
  xp: number;
  xpEvents: XpEvent[];

  constructor(human: Team) {
    this.board = new_board(3, 3);
    this.human = human;
    this.winLength = 3;
    this.xp = 0;
    this.xpEvents = [];
  }

  set(index: number, cell: Cell) {
    this.board.cells[index] = cell;
  }

  xpEvent(event: XpEvent) {
    this.xp += event.xp;
    // TODO: Make this only store like 100 as it could crash if it gets too big
    this.xpEvents.unshift(event);
  }

winState(): Team | "both" | null {
  const { rows, cols } = this.board.size;
  const K = this.winLength;
  const cells = this.board.cells;

  const get = (x: number, y: number): Cell | undefined =>
    x < 0 || y < 0 || x >= cols || y >= rows
      ? undefined
      : cells[y * cols + x];

  const lineWinsFor = (x: number, y: number, dx: number, dy: number, T: Team): boolean => {
    let sawActualT = false;
    for (let i = 0; i < K; i++) {
      const c = get(x + dx*i, y + dy*i);
      // treat both Empty and Blocked as stopping the line
      if (c === undefined || c === Cell.Empty || c === Cell.Blocked) return false;
      // if it’s the “other” team's mark, fail
      if (c === Cell.X && T !== Team.X) return false;
      if (c === Cell.O && T !== Team.O) return false;
      // Neutral always ok; actual T mark we record
      if (c === Cell.Neutral) {
        // counts for both, but doesn’t count as “actual T”
      } else {
        sawActualT = true;
      }
    }
    // require at least one real T to avoid all‑neutral lines
    return sawActualT;
  };

  const winners = new Set<Team>();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // you could even skip if get(x,y) is Empty/Blocked, but we test both teams anyway
      for (const [dx, dy] of [[1,0],[0,1],[1,1],[1,-1]] as const) {
        if (lineWinsFor(x, y, dx, dy, Team.X)) winners.add(Team.X);
        if (lineWinsFor(x, y, dx, dy, Team.O)) winners.add(Team.O);
      }
    }
  }

  if (winners.size === 0)     return null;
  if (winners.size === 1)     return [...winners][0];
  return "both";
}
}

export interface Board {
  size: Size,
  cells: Cell[]
}

function new_board(rows: number, cols: number): Board {
  return {
    size: { rows, cols },
    cells: Array<Cell>(rows * cols).fill(Cell.Empty)
  }
}

export enum Cell {
  X,
  O,
  Neutral,
  Empty,
  Blocked
}

export enum Team {
  X,
  O,
}

function opposite_team(team: Team) {
    if (team === Team.X) return Team.O;
    if (team === Team.O) return Team.X;
}

type Size = { rows: number, cols: number };
