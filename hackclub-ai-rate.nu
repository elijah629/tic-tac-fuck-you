let base = (http get https://ai.hackclub.com/ | str substring 499..507 | into int)

print $base;

mut cum_d = 0;
mut cum_t = 0;

loop {
  let start = date now | format date "%s" | into int;
  let delta = (http get https://ai.hackclub.com/ | str substring 499..507 | into int) - $base;
  let time  = (date now | format date "%s" | into int) - $start;

  $cum_d += $delta;
  $cum_t += $time;

  print $"($cum_d / $cum_t)"
}
