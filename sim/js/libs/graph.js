// adjacency_matrix takes in values like this:
// here rows represent source vertices and columns represent destination vertices
/* [
    {
        "winner": 2,
        "diff": 38,
        "loser": 0
    },
    {
        "winner": 2,
        "diff": 32,
        "loser": 1
    },
    {
        "winner": 0,
        "diff": 16,
        "loser": 1
    },
    {
        "winner": 0,
        "diff": -16,
        "loser": 1
    },
    {
        "winner": 2,
        "diff": -32,
        "loser": 1
    },
    {
        "winner": 2,
        "diff": -38,
        "loser": 0
    }
] */ // this can be transformed to:
/*     0      1      2
0   null  true   false
1   false null   false
2   true  null   true  */


/* [[null,true,false],
[false,null,true],
[true,false,null]] */

// here graph looks like 0->1
// then 2->0, after which cycle would occur

// neigbours of 0 are [1]
// neighbours of 1 are [2]
// neighbors of 2 are [0]

function digraph_cycle(am, l) {
  
  let visited = [];
  let finished =[];
  
  function dfs(v, am) {
    if (finished[v]) return
    if (visited[v]) return true 
    visited[v]=true;

    // check all edges pointing away from v
    let neighbours=[];
    for (let i=0; i<l; i++) if (am[v][i]) neighbours.push(i);
    for (const w of neighbours) return dfs(w, am)
    finished[v]=true; 
  }

  // call dfs with every vertex
  for (let i=0; i<l; i++) {
    for (let j=0; j<l; j++) {
      visited[j]=false;
      finished[j]=false;
    }
    let cycle = dfs(i, am);
    if (cycle) return true;
  }
  return false;
}

function digraph_source(am, l) {
  let vertices=[];
  for (let i=0; i<l; i++) {
    vertices.push(i);
  }
  let source;
  for (const v of vertices) {
    source=true;
    for (let i=0; i<l; i++) 
      if (am[i][v]) { source=false; break; }
    if (source) return v;
  }
}