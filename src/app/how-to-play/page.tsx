import { Card } from "@/components/card";
import { Card as C } from "@/types/game";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function HowToPlay() {
  return (
    <main className="px-8 space-y-2 backdrop-blur-3xl">
      <h1 className="text-6xl text-center font-bold">How to play</h1>
      <hr />
      <h2 className="text-3xl">Premise</h2>
      <p className="text-muted-foreground">
        You are playing a custom version of tic-tac-toe against a LLM, more
        specifically `meta-llama/llama-4-maverick-17b-128e-instruct` from groq.
        However, everything isn&apos;t as it seems, the AI has more power than
        you do, and will do anything to bring you to the ground... I mean
        anything.
      </p>
      <p className="text-muted-foreground">
        The game is played on a N by K board, which starts as 3x3, however can
        grow with various expansion cards.
      </p>
      <ul className="list-['-_'] text-muted-foreground">
        <li>Players: There are two players: you and the AI</li>
        <li>
          Hands: Each player starts with 5 cards and auto-refills every 2
          rounds..
        </li>
        <li>
          Cards: Cards can be as simple as your team letter, or as complex as
          inverting the board. You unlock new cards based on your level, which
          increaces every two rounds.
        </li>
      </ul>
      <h2 className="text-3xl">Difficulty</h2>
      <p className="text-muted-foreground">
        The below Gameplay information is for Normal mode, which is the default
        on the slider. HARD mode is selected by dragging the slider to the far
        right, Baby mode is the close left side, and Infant mode is selected by
        dragging the slider to the far left.
      </p>
      <p className="text-muted-foreground">
        Difficulties change the initial settings and probabilities in the game.
        This includes starting win length, board size, and unlock levels/growth
        rates for chance for cards.
      </p>
      <h2 className="text-3xl">Gameplay</h2>
      <p className="text-muted-foreground">
        Place cards on the board by dragging them from the bottom onto the grid.
        You can test this out below (the cards are quite fun to play around
        with).
      </p>
      <h3 className="text-3xl">Scoring and Winning</h3>
      <p className="text-muted-foreground">
        Scoring is quite simple, but it can seem complicated for few. The goal
        is to get K cells of the same kind that belong to your team in a row.
        The win condition (K) is custom and controlled by the win condition
        cards, it starts at 3 to mimic regular tic-tac-toe, but can be as small
        as 2.
      </p>
      <h3>But what about the different cells</h3>
      <ul className="list-['-_'] text-muted-foreground">
        <li>
          Blocked cells count like empty cells, except they cannot be changed by
          you, only the AI posseses that power.
        </li>
        <li>
          Neutral cells count for both teams, if there is a line of neutrals and
          no line for another team, it is a tie.
        </li>
        <li>
          Lowercase cells count for your team, but cannot mix with capital
          cells.
        </li>
        <li>
          Chemical cells are identical to empty cells, but they spread.
        </li>
      </ul>
      <h3>Examples</h3>
      <p className="text-muted-foreground">
        For all of these examples, assume the win length is set to 3, but these
        hold true for any win length.
      </p>
      <Table className="text-2xl">
        <TableCaption>Game states and outcomes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Lines</TableHead>
            <TableHead>Outcome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>X X X</TableCell>
            <TableCell>Win for X</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>x x x</TableCell>
            <TableCell>Win for X</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>? ? ? and X X X</TableCell>
            <TableCell>Win for X</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>? O O</TableCell>
            <TableCell>Win for O</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>X x X</TableCell>
            <TableCell>No win</TableCell>
          </TableRow>
          <TableRow>
            <TableCell># O O</TableCell>
            <TableCell>No win</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>? ? ?</TableCell>
            <TableCell>Tie</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>? X ? and O O O</TableCell>
            <TableCell>Tie</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Chem Chem Chem and O O O</TableCell>
            <TableCell>O, chemical cells act as empty cells</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>X X X, x x x, o o o, O O O, # # #, ? ? ?</TableCell>
            <TableCell>Tie</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>X X X, ? ? O</TableCell>
            <TableCell>Tie</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              The entire board is filled, but no one has won.
            </TableCell>
            <TableCell>Tie</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <h1>Cards (draggable)</h1>
      <Table className="text-2xl">
        <TableCaption>Card list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Card</TableHead>
            <TableHead className="w-[150px]">Name</TableHead>
            <TableHead>Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.X} id={0} />
            </TableCell>
            <TableCell>X</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Base card for the X team, places an X at the selected position if
              the cell is empty. If the cell is not empty the card is returned.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.O} id={1} />
            </TableCell>
            <TableCell>O</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Base card for the O team, places an O at the selected position if
              the cell is empty. If the cell is not empty the card is returned.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.Extend} id={2} />
            </TableCell>
            <TableCell>Extend</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Extends the board by row/column on the side closest to where the
              card was placed. If the card is the same distance from many sides
              (ie. center), it is returned.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.Lowercase} id={3} />
            </TableCell>
            <TableCell>Lowercase</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Lowercases a cell. If the cell is not a capital X or O, it is
              returned.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.Block} id={4} />
            </TableCell>
            <TableCell>Block</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Blocks a cell. Why would you do this? This cell is only
              controllable by the AI.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.Neutralize} id={5} />
            </TableCell>
            <TableCell>Neutralize</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Makes a cell neutral, the cell must be empty. If it is not, the
              card is returned.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.IncrementWinLength} id={6} />
            </TableCell>
            <TableCell>Win Length +1</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Increaces the amount of cells in a row required to win
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.DecrementWinLength} id={7} />
            </TableCell>
            <TableCell>Win Length -1</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Decreaces the amount of cells in a row required to win
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.Roulette} id={8} />
            </TableCell>
            <TableCell>Roulette</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              1/6 chance to shoot the AI, if that fails, 1/6 chance to shoot yourself. (death = loss). If the AI plays this card, it still plays itself first.
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.ScientificReaction} id={9} />
            </TableCell>
            <TableCell>Scientific Reaction</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Spawns a catalyst for the chemical compound that consumes everything it touches!
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Card droppable={false} card={C.TBD} id={10} />
            </TableCell>
            <TableCell>Deck back</TableCell>
            <TableCell className="max-w-md whitespace-normal">
              Not a card, but it is what the AI holds.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </main>
  );
}
