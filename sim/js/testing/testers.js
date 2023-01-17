function repeat_test(test, test_amount) {
  successful = 0;
  for (let i = 0; i < test_amount; i++) {
    successful += test();
  }

  return successful;
}

function IIA_test(voter_count, voting_system, starter_candidate_count) {
  voter_population = voter_count;
  candidate_population = starter_candidate_count;

  reset_environment();

  voting_machine_ = new voting_system(candidates);
  voting_machine_.prepare_for_voting();

  for (const voter of voters) {
    voting_machine_.register_vote(voter);
  }
  first_results = voting_machine_.count_votes();
  first_winners = first_results[0];

  if (first_winners.length > 1) {
    return true;
  }

  add_candidate();
  new_cand = candidates[candidates.length - 1];
  new_machine = new voting_system(candidates);
  new_machine.prepare_for_voting();

  for (const voter of voters) {
    new_machine.register_vote(voter);
  }
  new_winners = new_machine.count_votes()[0];

  if (new_winners.length > 1 || new_winners[0] != first_winners[0]) {
    return false;
  }
  return true;
}

function tie_test(voter_count, voting_system, candidate_count) {
  voter_population = voter_count;
  candidate_population = candidate_count;

  reset_environment();

  voting_machine_ = new voting_system(candidates);
  voting_machine_.prepare_for_voting();

  for (const voter of voters) {
    voting_machine_.register_vote(voter);
  }
  first_results = voting_machine_.count_votes();
  first_winners = first_results[0];

  if (first_winners.length > 1) {
    return true;
  }
  return false;
}
