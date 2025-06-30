import { Card, CardContent } from '@/components/ui/card';
import { GameContext } from '@/lib/game-context';
import { useContext } from 'react';

export function XpSidebar() {
  const { game, setGame } = useContext(GameContext);

  return (
    <aside className="bg-secondary w-72 border-2 p-4">
      <Card onClick={() => {
        game.xpEvent({ xp: 100, label: "Click" });
      }}>
        <CardContent className="space-y-4">
          <div className="font-bold text-3xl">XP: {game.xp}</div>
          <ul className="space-y-2 text-yellow-300">
            {game.xpEvents.map((event, i) => (
              <li
                key={i}
                className="flex justify-between items-center p-2 rounded transform transition-transform duration-300 opacity-100"
              >
                <span>+{event.xp} {event.label}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};
