const readline = require('readline');
const tag = 'GOBLIN FIGHT> '
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: tag,
});

rl.prompt();

const messageQueue = [];
let gameOver = false;

const printMessages = () => {
	return new Promise((resolve) => {
		const recurse = () => {
			const msg = messageQueue.shift();
			setTimeout(() => {
				if (msg) {
					console.log(msg);
					recurse();
				} else {
					resolve();
				}
			}, 1000);
		};
		recurse();
	})
}

const rollDice = (d, m = 0) => Math.ceil(Math.random() * d) + m;

const player = {
  name: 'bill',
  hp: 10,
  ac: 10,
  am: 6,
  attack: {
    name: 'slash',
    get damage() { return rollDice(4); },
  },
};

const baddie = {
    name: 'goblin',
    hp: 10,
    ac: 10,
    am: 5,
    attack: {
      name: 'slash',
      get damage() { return rollDice(4); },
    }
  };

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'attack':
      if (rollDice(20, player.am) >= baddie.ac) {
        const attack = player.attack.damage;
        baddie.hp -= attack;
        messageQueue.push(`${player.name} hits ${baddie.name} for ${attack} damage.`);
      } else {
        messageQueue.push(`${player.name}'s attack missed.`);
      }
      break;
    // case 'defend':
    //   console.log('defending!');
    //   break;
    default:
      messageQueue.push(`say what? I might have heard '${line.trim()}'`);
      break;
  }

  if (baddie.hp > 0) {
    if (rollDice(20, baddie.am) >= player.ac) {
      const { damage } = baddie.attack;
      player.hp -= damage;
      messageQueue.push(`${baddie.name} hits ${player.name} for ${damage} damage.`);
    } else {
      messageQueue.push(`${baddie.name}'s attack missed.`);
    }
  }

  const winner = baddie.hp <= 0 ? player.name : (player.hp <= 0 ? baddie.name : false);

  if (winner) {
    messageQueue.push(`${winner} is victorious!`);
  } else {
    messageQueue.push(`${baddie.name} has ${baddie.hp} hp.`);
    messageQueue.push(`${player.name} has ${player.hp} hp.`);
    messageQueue.push('.', '..', '...');
  }

  printMessages()
    .then(() => {
      if (winner) {
        process.exit(0);
      } else {
        rl.prompt();
      }
    })
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
