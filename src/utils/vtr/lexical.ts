type entry = { name: string; code: number };

type entriesT = { [key in entriesKeyT]: entry[] };

type entriesKeyT = '<' | '/' | '*' | '=';

const entries: entriesT = {
  '<': [
    {
      name: '<>',
      code: 1
    },
    {
      name: '</>',
      code: 2
    },
    {
      name: '</',
      code: 3
    },
    {
      name: '<',
      code: 4
    }
  ],
  '/': [
    {
      name: '/>',
      code: 11
    },
    {
      name: '/*',
      code: 12
    },
    {
      name: '/',
      code: 13
    }
  ],
  // '.': [
  //   {
  //     name: '...',
  //     code: 21
  //   },
  //   {
  //     name: '.',
  //     code: 22
  //   }
  // ],
  // '|': [
  //   {
  //     name: '||',
  //     code: 31
  //   }
  // ],
  // '&': [
  //   {
  //     name: '&&',
  //     code: 41
  //   }
  // ],
  '*': [
    {
      name: '*/',
      code: 51
    },
    { name: '*', code: 52 }
  ],
  '=': [
    {
      name: '=>',
      code: 61
    },
    { name: '=', code: 62 }
  ]
};

const specials = ['>', '{', '}'];
// const specials = ['>', '{', '}', '(', ')', '"', "'", '`', '+', '-', '!', ':', '[', ']'];

const matchEntry = (str: string, p: number, entries: entry[]) => {
  for (const entry of entries) {
    if (str.slice(p, p + entry.name.length) === entry.name) {
      return entry;
    }
  }
  return false;
};

export const LexicalAnalysis = (temp: string): entry[] => {
  let max = temp.length * 2;

  let p = 0;

  const final:entry[] = [];

  let d = 0;

  let lexical = 0;

  const clearStack = () => {
    if (lexical) {
      const w = {
        name: temp.slice(p, p + lexical),
        code: 80
      };
      final.push(w);
      p += lexical;
      lexical = 0;
    }
  };

  // debugger;

  while (max > 0 && p + lexical < temp.length) {
    max--;

    const c = temp[p + lexical];
    // 关键词入口
    if (Object.keys(entries).includes(c)) {
      const trys = entries[c as entriesKeyT];
      const entry = matchEntry(temp, p + lexical, trys);

      if (d) {
        if (entry) {
          lexical += entry.name.length;
        }
      } else {
        // 清空栈
        clearStack();

        if (entry) {
          p += entry.name.length;
          final.push(entry);
        } else {
          p += 1;
        }
      }
    } else if (specials.includes(c)) {
      // 特殊字符 清空词栈
      const w = {
        name: c,
        code: c === '{' ? 71 : c === '}' ? 72 : 73
      };

      if (c === '{') {
        d++;
      }

      if (d) {
        lexical++;
      } else {
        clearStack();

        final.push(w);
        p++;
      }

      if (c === '}') {
        d--;
      }
    } else if (d === 0 && (c === ' ' || c === '\n')) {
      // 空格清空词栈
      clearStack();
      p++;
    } else {
      lexical++;
    }
  }

  // if (lexical) {
  //   final.push({
  //     name: temp.slice(p, p + lexical),

  //   });
  // }

  return final;
};
