let candidates;
let voters;
let voting_method;
let voting_machine;
let results;
let max_votes;
const max_range = Infinity;

const vm = new Map([
  ["Plurality voting", Plurality],
  ["Anti-plurality voting", Anti_plurality],
  // ['theoretical perfect', PerfectVoter],
  ["Approval voting", Approval],
  ["Evaluative voting", Evaluative],
  ["Score voting", Score],
  // ["STAR voting", starVoter],
  ["Bucklin voting", Bucklin],
  ["Instant-runoff voting", IRV],
  ["Coombs's method", Coombs],
  ["Supplementary vote", Supplementary],
  ["Contingent vote", Contingent],
  ["Sri Lankan contingent vote", Sri_lankan_contingent],
  ["Borda count", Borda_count],
  ["Copeland's method", Copeland],
  ["Tideman (RP)", Tideman],
]);

let first = false;

function select_voting() {
  voting_method = vm.get(voting_type_selector.value());
  extra_function = empty_function;


  for (const voter of voters) {
    voter.size = 2;
  }
  change_in_sim = true;
}

function simulate_voting() {
  // Handles the voting process. Uses the selected voting_method

  reset_on_select();
  delete_arrows();

  for (const cand of candidates) {
    cand.appear();
  }
  max_votes = voters.length;

  candidates.forEach((cand) => {
    cand.reset_text();
  });

  count_supporters();
  calculate_seems_win_candidates();

  voting_machine = new voting_method(candidates);

  voting_machine.prepare_for_voting();

  for (let i = 0; i < voters.length; i++) {
    voting_machine.register_vote(voters[i]);
  }

  voting_results = voting_machine.count_votes();
  console.log("The voting machine:");
  console.log(voting_machine);

  console.log("The results:");
  console.log(voting_results);

  console.log("The voters:");
  console.log(voters);

  display_votes(voting_machine);
  voting_machine.stepping_box_func(stepping_box);
  load_clicked_selected();
}
