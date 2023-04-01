const getArgs = (args) => {
  const res = {}
  const [executor, file, ...rest] = args;

  rest.forEach((value, idx, array) => {
    if (value.charAt(0) === '-') {
      if (idx === array.length - 1) {
        res[value.slice(1)] = true;
      } else if (array[idx + 1]?.charAt(0) !== '-') { // ToDo do we really need this check ?
        res[value.slice(1)] = array[idx+1];
      } else {
        res[value.slice(1)] = true; 
      }
    }
  });

  return res;
}

export {getArgs}