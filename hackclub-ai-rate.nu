let base = (http get https://ai.hackclub.com/ | str substring 499..507 | into int)

mut cum_d = 0;
mut cum_t = 0;

loop {
  let start = date now | into int;
  let delta = (http get https://ai.hackclub.com/ | str substring 499..507 | into int) - $base;
  let time  = (date now | into int) - $start;

  $cum_d += $delta;
  $cum_t += $time;

  print $"($delta)\t($time)\t(($cum_d / $cum_t) * 1000000000)"
}
