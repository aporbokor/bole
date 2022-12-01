class Tideman extends CondorcetVotingMethod {
  count_votes() {

    this.calc_relative_strength_matrix();
    this.add_pairs();
    this.sort_pairs();

    // locked array establishes the graph, only adding edges if it doesn't create a cycle
    let locked = gen_bool_arr(this.candidates.length);
    set_diagonal(locked, null);

    console.log(this.relative_strength_matrix);
    console.log(this.pairs)





/*     function invalid_edge(pair) {
        let l = pair.loser;
        while (true) {
          for (let i = 0; i < this.candidates.length; i++) {
            if (i == l) {
              continue;
            } else if (locked[l][i] == true) {
              if (i == pair.winner) {
                return true;
              }
              l = i;
            } else {
              return false;
            }
          }
        }
      } */

    function create_graph(pairs, l) {
      for (const p of pairs) {
        let res = digraph_cycle(locked, l);
        if (!digraph_cycle(locked, l)) {
          locked[p.winner][p.loser] = true;
        }
      }
    }

    create_graph(this.pairs, this.candidates.length);

    let source = digraph_source(locked, this.candidates.length)
    console.log(source)
    let winner = this.candidates[source];



/*     let winner;
    let chosen=false;
    for (let i = 0; i < this.candidates.length; i++) {
      for (let j = 0; j < this.candidates.length; j++) {
        if (this.locked[j][i] == false) {
          if (j == this.candidates.length - 1) {
            winner = this.candidates[i];
          }
        } else {
          chosen=true;

          break;
        }
      }
      if (chosen) {
        break;
      }
    } */
    // TODO

/*     if (winner == undefined) {
      winner = this.candidates[this.pairs[0].winner];
    } */
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
