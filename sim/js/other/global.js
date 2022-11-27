let candidates;
let voters;
let votingmethod;
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
  votingmethod = vm.get(voting_type_selector.value());
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
  }
  max_votes = voters.length;

  candidates.forEach((cand) => {
    cand.reset_text();
  });

  count_supporters();
  calculate_seems_win_candidates();

  voter_maschine = new votingmethod(candidates);

  voter_maschine.prepare_for_voting();

  for (let i = 0; i < voters.length; i++) {
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
