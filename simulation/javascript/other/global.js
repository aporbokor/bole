let candidates;
let voters;
let votingmethod;
let voter_maschine;
let results;
let max_votes;
const max_range = Infinity;

const votingmethods = new Map([
  ['plurarity', PlurarityVoter],
  ['anti-plurarity', AntiPlurarityVoter],
  // ['theoretical perfect', PerfectVoter],
  ['approval voting', ApprovalVoter],
  ['evaluative voting', evaluativeVoter],
  ['score voting', scoreVoter],
  ['STAR voting', starVoter],
  ['borda counting', BordaCounting],
  ['bucklin', Bucklin],
  ['supplementary vote', SupplementaryVoter],
  ['Sri Lankan Contingent vote', SriLankanContingentVoter],
  ['contingent vote', ContingentVoter],
  ['instant runoff', InstantRunOffVoter],
  ['coombs', CoombsVoting],
  ['copleland', CopelandVoter],
  ['tideman', TideMan],
]);

function select_voting() {
  votingmethod = votingmethods.get(voting_type_selector.value());
  extra_function = empty_function;
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

  candidates.forEach(cand => {
    cand.reset_text();
  });

  count_supporters();
  calculate_seems_win_candidates();

  voter_maschine = new votingmethod(candidates);

  voter_maschine.prepare_for_voting();

  for (let i = 0; i < voters.length; i++) {
    voter_maschine.registrate_vote(voters[i]);
  }

  voting_results = voter_maschine.count_votes();
  console.log('The voting machine:');
  console.log(voter_maschine);

  console.log('The results:');
  console.log(voting_results);

  console.log('The voters:');
  console.log(voters);

  display_votes(voter_maschine);
  voter_maschine.stepping_box_func(stepping_box);
  load_clicked_selected();
}
