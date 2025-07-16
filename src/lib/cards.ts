import x from "@/assets/images/cards/x.png";
import o from "@/assets/images/cards/o.png";
import extend from "@/assets/images/cards/extenda.png"; // APNG ANIMATED!
import lowercase from "@/assets/images/cards/lowercase.png";
import blocked from "@/assets/images/cards/blocked.png";
import neutralize from "@/assets/images/cards/neutral.png";
import back from "@/assets/images/cards/deck-back.png";
import inc from "@/assets/images/cards/inc-win.png";
import dec from "@/assets/images/cards/dec-win.png";
import { Card as C } from "@/types/game";

// pick correct image src
export function cardSrc(card: C) {
  if (card === C.O) return o.src;
  if (card === C.X) return x.src;
  if (card === C.Neutralize) return neutralize.src;
  if (card === C.Lowercase) return lowercase.src;
  if (card === C.Block) return blocked.src;
  if (card === C.Extend) return extend.src;
  if (card === C.IncrementWinLength) return inc.src;
  if (card === C.DecrementWinLength) return dec.src;

  return back.src;
}
