class Tideman extends CondorcetVotingMethod {
  create_graph(pairs, l, locked) {
    
    for (const p of pairs) {
      let clocked=[];
      for (let i=0; i<locked.length; ++i) clocked[i] = locked[i].slice()
      clocked[p.winner][p.loser]=true;
      if (!digraph_cycle(clocked, l))
        locked[p.winner][p.loser] = true;
    }
  }

  count_votes() {
    this.calc_relative_strength_matrix();
    this.add_pairs();
    this.sort_pairs();

    // locked array establishes the graph, only adding edges if it doesn't create a cycle
    this.locked = gen_bool_arr(this.candidates.length);
    set_diagonal(this.locked, null);

    this.create_graph(this.pairs, this.candidates.length, this.locked);
    console.log(this.pairs);

    let source = digraph_source(this.locked, this.candidates.length);
    console.log(source);
    let winner = this.candidates[source];

    // choose randomly, tie has occured
    if (winner == undefined) winner = random(this.candidates);

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
    let content = document.createElement("div");

    let text = document.createElement("p");
    text.innerHTML = "";

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

  setup_edges(stepping_box) {
    delete_arrows();
    clicked_selected = undefined;

    this.empty_locked = filledTwoDMatrix(
      candidates.length,
      candidates.length,
      null
    );

    for (const voter of voters) voter.hide();
    // environment storing var
    this.curr = 0;
    this.show_edges.bind(stepping_box.next_button)();
  }

  show_edges() {
    let vs = this.parent_box.visualized_system;
    const pairs = vs.pairs;
    const max_idx = pairs.length / 2;

    clicked_selected = undefined;

    if (max_idx === vs.curr) {
      console.log("kampó");
      return;
    }

    const current_pair = vs.pairs[vs.curr];

    let winner_cand = current_pair.winner;
    let loser_cand = current_pair.loser;

    const wasnt_cycle = vs.locked[winner_cand][loser_cand];
    vs.empty_locked[winner_cand][loser_cand] = wasnt_cycle;
    vs.empty_locked[loser_cand][winner_cand] = !wasnt_cycle;

    let content = document.createElement("div");

    let text = document.createElement("p");

    if (wasnt_cycle) {
      text.innerHTML = "[cycleless, placeholder]";
      vs.arrow_between_2_candidates(
        candidates[current_pair.winner],
        candidates[current_pair.loser]
      );
    } else {
      text.innerHTML = "[placeholder]";
    }

    let table = table_from_matrix(
      vs.empty_locked,
      vs.candidate_names,
      vs.candidate_names
    );

    content.appendChild(text);
    content.appendChild(table);
    this.parent_box.set_content(content);

    vs.curr = vs.curr + 1;
    this.parent_box.next_func(vs.show_edges);
  }

  end_vis() {}
}
