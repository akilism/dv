//fill an array with some values will not mutate array.
import R from 'ramda';

export default function fill(v, i, arr) {
  if(i <= 0) { return arr; }
  return fill(v, --i, arr.concat([v]));
}

export const fill0 = R.partial(fill, [0]);
