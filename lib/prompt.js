var cin = process.stdin;
var cout = process.stdout;

function promptFn(prompt) {
  return new Promise((resolve) => {
    cout.write(prompt + ": ");
    cin.resume();
    cin.setEncoding('utf8');
    cin.once('data', text => {
      cin.pause();
      resolve(text.toString('utf8').trim());
    });
  });
}

module.exports = promptFn;
