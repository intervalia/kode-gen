var cin = process.stdin;
var cout = process.stdout;

function promptFn(prompt, cb) {
  cout.write(prompt+": ");
  cin.resume();
  cin.setEncoding('utf8');
  cin.once('data', function (text) {
    cin.pause();
    cb(text.slice(0,-1));
  });
}

module.exports = promptFn;
