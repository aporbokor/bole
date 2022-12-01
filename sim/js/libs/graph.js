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



function digraph_cycle(am, l) {
  
  let visited = [];
  let finished =[];
  for (let i=0; i<l; i++) {
    visited[i]=false;
    finished[i]=false;
  }
  function dfs(v, a) {

    if (finished[v]) return
    if (visited[v]) return true
    visited[v]=true;

    // check all edges pointing away from v, except the one calling dfs(v) = visited
    let neighbours = [];
    for (let i=0; i<l; i++) {
        if (am[v][i]==true & !visited[i]) neighbours.push(i);
    }
    

    for (const w in neighbours) {
      dfs(w);
    }
    finished[v]=true; 

  }
  for (let i=0; i<l; i++) {
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
/*     console.log("currently observing candidate ", v) */
    for (let i=0; i<l; i++) {
/*       console.log("against candidate ", i)
      console.log("result was: ", am[i][v]) */
      if (am[i][v]) { source=false; break; }
    }
    if (source) return v;
  }
}