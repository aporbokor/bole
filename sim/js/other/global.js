let candidates;
let voters;
let voting_method;
let voter_maschine;
let results;
let max_votes;
const max_range = Infinity;

const vm = new Map([
  ["Plurality voting", PluralityVoter],
  ["Anti-plurality voting", AntiPluralityVoter],
  // ['theoretical perfect', PerfectVoter],
  ["Approval voting", ApprovalVoter],
  ["Evaluative voting", evaluativeVoter],
  ["Score voting", scoreVoter],
  // ["STAR voting", starVoter],
  ["Bucklin voting", Bucklin],
  ["Instant-runoff voting", InstantRunOffVoter],
  ["Coombs's method", CoombsVoting],
  ["Supplementary vote", SupplementaryVoter],
  ["Contingent vote", ContingentVoter],
  ["Sri Lankan contingent vote", SriLankanContingentVoter],
  ["Borda count", BordaCounting],
  ["Copeland's method", CopelandVoter],
  ["Tideman (RP)", TideMan],
]);

let first = false;

function select_voting() {
  voting_method = vm.get(voting_type_selector.value());
  extra_function = empty_function;

  console.log(voters);

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
    cand.reset_text();
    // cand.show_ranges = true;
  }
  max_votes = voters.length;

  count_supporters();
  calculate_seems_win_candidates();

  voter_maschine = new voting_method(candidates);

  voter_maschine.prepare_for_voting();

  for (let i = 0; i < voters.length; i++) {
    voters[i].ranges = [];
    voter_maschine.register_vote(voters[i]);
  }

  voting_results = voter_maschine.count_votes();
  console.log("The voting machine:");
  console.log(voter_maschine);

  console.log("The results:");
  console.log(voting_results);

  console.log("The voters:");
  console.log(voters);

  display_votes(voter_maschine);
  voter_maschine.stepping_box_func(stepping_box);
  load_clicked_selected();
}
