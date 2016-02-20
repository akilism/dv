//pad an array with some values will not mutate array.
import R from 'ramda';

export default function pad(v, i, arr) {
  if(i <= 0) { return arr; }
  return pad(v, --i, [v].concat(arr));
}

export const pad0 = R.partial(pad, [0]);
