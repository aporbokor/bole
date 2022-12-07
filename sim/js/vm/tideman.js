class Tideman extends CondorcetVotingMethod {
  count_votes() {

    this.calc_relative_strength_matrix();
    this.add_pairs();
    this.sort_pairs();

    // locked array establishes the graph, only adding edges if it doesn't create a cycle
    this.locked = gen_bool_arr(this.candidates.length);
    set_diagonal(this.locked, null);

    function create_graph(pairs, l, locked) {
      for (const p of pairs) {
        let res = digraph_cycle(locked, l);
        if (!digraph_cycle(locked, l)) locked[p.winner][p.loser] = true;
      }
    } 

    create_graph(this.pairs, this.candidates.length, this.locked);
    console.log(this.pairs)
    
    let source = digraph_source(this.locked, this.candidates.length)
    console.log(source)
    let winner = this.candidates[source]; 

    // choose randomly, tie has occured
    if (winner==undefined) winner = random(this.candidates)

    return [[winner]];
  }

  specific_step() {
      // Second step in step_by_step visualization
      let voting_system = this.parent_box.visualized_system;

      for (const cand of candidates) {
        cand.appear();
      }

      voting_system.extra_visualize(voters);
      delete_arrows();

      voters.forEach((v) => {
        v.hide();
      });

      clicked_selected = undefined;

      voting_system.arrows_between_candidates();
      this.random_voter.set_color(this.random_voter.voted_for[0].color);
      let content = document.createElement("div");

      let text = document.createElement("p");
      text.innerHTML ="The locked-in graph";


      let table = table_from_matrix(
        voting_system.locked,
        voting_system.candidate_names,
        voting_system.candidate_names
      );

      let graph_vis_btn = document.createElement("button");
      graph_vis_btn.addEventListener("click", (ev) => {
        voting_system.setup_edges(this.parent_box);
      });
      graph_vis_btn.innerText = "Visualize creation of graph";

      content.appendChild(text);
      content.appendChild(table);
      content.appendChild(graph_vis_btn);

      this.parent_box.set_content(content);
      this.parent_box.next_func(voting_system.specific_step);
      this.curr++;
    }

    setup_edges (stepping_box) {
      delete_arrows()
      clicked_selected=undefined;
      this.empty_locked = filledTwoDMatrix(
        candidates.length,
        candidates.length,
        null
      );
      for (const voter of voters) voter.hide()
      // environment storing var
      this.curr = 0; 
      this.show_edges.bind(stepping_box.next_button)()
    }

    show_edges() {
      let vs = this.parent_box.visualized_system;
      let pairs = vs.pairs;
      


    }
  }