class Tideman extends CondorcetVotingMethod {
  count_votes() {

    this.calc_relative_strength_matrix();
    this.add_pairs();
    this.sort_pairs();

    // locked array establishes the graph, only adding edges if it doesn't create a cycle
    let locked = gen_bool_arr(this.candidates.length);
    set_diagonal(locked, null);

    function create_graph(pairs, l) {
      for (const p of pairs) {
        let res = digraph_cycle(locked, l);
        if (!digraph_cycle(locked, l)) locked[p.winner][p.loser] = true;
      }
    } 

    create_graph(this.pairs, this.candidates.length);
    
    let source = digraph_source(locked, this.candidates.length)
    console.log(source)
    let winner = this.candidates[source]; 

    // choose randomly, tie has occured
    if (winner==undefined) winner = random(this.candidates)

    return [
      [winner],
      this.candidates.filter(function (c) {
        c = !winner;
      }),
    ];
  }
  show_first() {
    let content = document.createElement("p");

    content.innerText =
      "Sorry, further step by step visualization is not currently available for this voting method, but we are working on it!";
    this.parent_box.set_content(content);
    this.parent_box.hide_next();
  }
}
