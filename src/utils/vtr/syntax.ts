export interface RTree {
  name: string;
  attr: { [key: string]: string };
  parent: null | RTree;
  children: RTree[];
}

export const syntaxAnalysis = (lexical: { name: string; code: number }[]): RTree => {
  let p = 0;

  let crt: any = null;

  let root: any = null;

  let ctx = 'o';

  const createNewElement = (name: string) => {
    const ele = {
      name: name,
      attr: {},
      parent: null,
      children: []
    };

    if (root === null) {
      root = ele;
    } else if (crt) {
      ele.parent = crt;
      crt.children.push(ele);
    }

    crt = ele;

    return ele;
  };

  while (p < lexical.length) {
    const l = lexical[p];

    switch (l.code) {
      // <> entry
      case 1: {
        createNewElement('empty');
        p++;
        break;
      }
      //</> exit
      case 2: {
        crt = crt.parent;
        p++;
        break;
      }
      // </
      case 3: {
        crt = crt.parent;
        p += 3;
        break;
      }
      // < entry
      case 4: {
        createNewElement(lexical[p + 1].name);
        ctx = 'i';
        p += 2;
        break;
      }
      // /> exit
      case 11: {
        ctx = 'o';
        crt = crt.parent;
        p++;
        break;
      }
      // =
      case 62: {
        break;
      }
      // >
      case 73: {
        ctx = 'o';
        p++;
        break;
      }
      // letters
      case 80: {
        if (ctx === 'o') {
          crt.children.push({
            name: l.name,
            children: null,
            parent: crt,
            arrt: null
          });
          p++;
        } else {
          if (lexical[p + 1].code === 62) {
            crt.attr[lexical[p].name] = lexical[p + 2].name;
            p += 3;
          } else {
            crt.attr[lexical[p].name] = 'true';
            p++;
          }
        }
        break;
      }
    }
  }
  return root;
};

// 1 2 3 4 11 62 73 80
