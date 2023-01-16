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

    // choose randomly, tie has occurred
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
    text.innerHTML = "From the relative strength matrix we gain enough information to group candidates into pairs sorted(ranked) by strength of victory.\n \
    This listing of pairs gives us an adjacency matrix shown below, showing the winners and losers of each pairwise comparison of any 2 candidates.";

    let t2 = document.createElement("p");
    t2.innerHTML = "Without using much jargon, the adjacency matrix is one of the most common data structures for graph representation, where rows represent source vertices and columns represent destination vertices. This might be a little hard to visualize just by looking at the table, but if you inspect the canvas, it should make sense. You can see the vertices represented by the candidates and the edges represented by arrows pointing one candidate from another. (The candidate from whom the arrow points away is the source vertex, and the candidate to whom the arrow points to is the destination vertex.)";
    
    let t3 = document.createElement("p");
    t3.innerHTML = ("We create the graph by locking in 'edges' with the greatest margin of victory first, but only if inserting the edge does not lead to a cycle(a situation whereby following the arrows, leads back to the initial source vertex.). In the case of a cycle, we skip that edge, and continue.")

    let t4 = document.createElement("p");
    t4.innerHTML = "It might be helpful for your understanding to click on the 'Visualize creation of graph' button below which goes much more in-depth in the creation of the graph."

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
    content.appendChild(t2);
    content.appendChild(t3);
    content.appendChild(t4);
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
    const max_idx = (pairs.length / 2);

    clicked_selected = undefined;

    if (max_idx === vs.curr) {
      console.log("kampó");
      this.parent_box.next_func(vs.end_vis)
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
      text.innerHTML = "We read from our adjacency matrix that " + candidate_names[winner_cand] + " beat " + candidate_names[loser_cand] + " and a cycle has not occurred, thus we insert an edge between them. ";
      vs.arrow_between_2_candidates(
        candidates[current_pair.winner],
        candidates[current_pair.loser]
      );
    } else {
      text.innerHTML = "In this scenario, either a draw or a cycle has occurred, this edge will not be locked in. We continue as if nothing had happened.";
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

  end_vis() {
    let vs = this.parent_box.visualized_system;
    this.parent_box.hide_next();
    let content = document.createElement("div")
    let text = document.createElement("p")
    let source = digraph_source(vs.locked, candidates.length);
    let winner = candidates[source];
    if (winner == undefined) winner = random(candidates);
    text.innerText = "We can finally announce our winner: " + winner.name + ", but there is an off chance that a Condorcet winner could not be established, then the algorithm chooses randomly among candidates.";
    content.appendChild(text);
    this.parent_box.set_content(content);
  }
}
