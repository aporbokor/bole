function repeat_criterion(test, test_amount) {
  successful = 0;
  for (let i = 0; i < test_amount; i++) {
    let val = test();
    // console.log(val);
    successful += val;
  }

  return successful;
}

function repeat_criterions(
  test_type,
  voter_count,
  voting_system,
  starter_candidate_count,
  end_candidate_count,
  tests_per_case
) {
  // Runs a test for different candidate-counts
  let results = {};

  results.meta = {
    test_type,
    voter_count,
    voting_system,
    starter_candidate_count,
    end_candidate_count,
    tests_per_case,
  };
  results.data = [];

  for (let i = starter_candidate_count; i <= end_candidate_count; i++) {
    test = () => test_type(voter_count, voting_system, i);

    let res_val = repeat_criterion(test, tests_per_case);

    results.data.push(res_val);
  }

  return results;
}

function test_and_download_data(
  test_types,
  voter_counts,
  voting_systems,
  starter_candidate_count,
  end_candidate_count,
  tests_per_case
) {
  const eta = new ETA(
    test_types.length * voter_counts.length * voting_systems.length
  );
  let progress = 0;

  let results = {};

  let type_names = [];
  for (const type of test_types) {
    type_names.push(type.name);
  }

  let system_names = [];
  for (const system of voting_systems) {
    system_names.push(system.name);
  }

  results.meta = {
    test_types: type_names,
    voter_counts,
    voting_systems: system_names,
    starter_candidate_count,
    end_candidate_count,
    tests_per_case,
  };

  results.entries = [];

  for (const test_type of test_types) {
    for (const voter_count of voter_counts) {
      for (const voting_system of voting_systems) {
        let entry = {
          test_type: test_type.name,
          voter_count,
          voting_system: voting_system.name,
        };

        entry.data = repeat_criterions(
          test_type,
          voter_count,
          voting_system,
          starter_candidate_count,
          end_candidate_count,
          tests_per_case
        ).data;
        results.entries.push(entry);
        console.log("voting system done");
        progress++;
        console.log(eta.get_formatted_eta(progress));
      }
      console.log("voter_count", voter_count, "done");
    }
    console.log("test_type done");
  }
  results.meta.execution_time = eta.get_elapsed_time();
  download(JSON.stringify(results), "results.json", "json");
  return results;
}

function run_vote(voter_count, voting_system, candidate_count) {
  voter_population = voter_count;
  candidate_population = candidate_count;

  reset_environment();

  voting_machine_ = new voting_system(candidates);
  voting_machine_.prepare_for_voting();

  for (const voter of voters) {
    voting_machine_.register_vote(voter);
  }

  return voting_machine_.count_votes();
}

function IIA_criterion(voter_count, voting_system, starter_candidate_count) {
  let first_results = run_vote(voter_count, voting_system, starter_candidate_count);
  let first_winners = first_results[0];

  add_candidate();
  let new_cand = candidates[candidates.length - 1];
  let new_machine = new voting_system(candidates);
  new_machine.prepare_for_voting();

  for (const voter of voters) {
    new_machine.register_vote(voter);
  }
  let new_results = new_machine.count_votes();
  let new_winners = new_results[0];

  if ((new_winners.length == 1) & (new_winners[0].id == new_cand.id)) {
    return true;
  }

  for (const old_winner of first_winners) {
    let winner_in_new = false;
    for (const new_winner of new_winners) {
      if (old_winner.id == new_winner.id) {
        winner_in_new = true;
        break;
      }
    }
    if (!winner_in_new) {
      return false;
    }
  }
  return true;
}

function tie_criterion(voter_count, voting_system, candidate_count) {
  let results = run_vote(voter_count, voting_system, candidate_count);
  let winners = results[0];

  if (winners.length > 1) {
    return true;
  }
  return false;
}

function best_winner_to_avg_voter_criterion(
  voter_count,
  voting_system,
  candidate_count
) {
  let winners = run_vote(voter_count, voting_system, candidate_count)[0];

  const should_win = average_voter.honest_preference(candidates)[0];

  for (const cand of winners) {
    if (should_win.id == cand.id) {
      return true;
    }
  }
  return false;
}

function condorcet_winner_criterion(voter_count, voting_system, candidate_count) {
  // just do pairwise comparisons, rank pairs then identify condercet winner
  let winner = run_vote(voter_count, voting_system, candidate_count)[0][0];

  let new_machine = new Copeland(candidates);
  new_machine.prepare_for_voting();

  for (const voter of voters) {
    new_machine.register_vote(voter);
  }
  let new_results = new_machine.count_votes();
  let condorcet_winner = new_results[0][0];

  if (condorcet_winner.copeland_score == candidate_count - 1) return (winner.id == condorcet_winner.id);
  return false;
}

function majority_criterion(voter_count, voting_system, candidate_count) {
  let winner = run_vote(voter_count, voting_system, candidate_count)[0];
  let first_votes = [];
  for (const voter of voters) {
    first_votes[voter.honest_preference(candidates)[0].id]++;
  }
  let majority_winner;
  for (let i = 0; i < candidates.length; ++i) {
    if (first_votes[i]>voter_count) majority_winner = candidates[i];
  }

  if (majority_winner != undefined)
    return majority_winner.id == winner.id;
  return false; //TODO
}

// compliant should be: IRV, contingent vote, borda count, tideman
// non-compliant should be: plurality, supplementary, Sri Lankan contingent, approval, bucklin
function condorcet_loser_criterion(voter_count, voting_system, candidate_count) {
  let winner = run_vote(voter_count, voting_system, candidate_count)[0][0];

  let new_machine = new Copeland(candidates);
  new_machine.prepare_for_voting();

  for (const voter of voters) {
    new_machine.register_vote(voter);
  }
  new_machine.count_votes();

  return (winner.copeland_score != 0) //TODO

}

// no winner is helped by up-ranking, no loser is helped by down-ranking
// E.g. harming candidate x by changing some ballots from
// z > x > y to x > z > y would violate the monotonicity criterion
// while harming x by changing ballots from 
// z > x > y to x > z > y would not.
//
// results should be (ranked votingmethods only!):
// monotonic: Borda, ranked pairs
// non-monotonic: Coombs' method, IRV
// can be generalized to cardinal and plurality voting systems
//
// https://www.votingmatters.org.uk/ISSUE6/P4.HTM check for all these if (want_to_die == true)
//function monotonicity_criterion(voter_count, voting_system, candidate_count) {
  //if (voting_system.prototype instanceof RankingVotingMethod) {
    //// create preference table
    //voter_population = voter_count; 
    //candidate_population = candidate_count;
    //reset_environment();
    //voting_machine_ = new voting_system(candidates);
    //voting_machine_.prepare_for_voting();
    //for (const voter of voters) {
      //voting_machine_.register_vote(voter);
    //}
    //let ptable = twoDMatrixWithZeros(candidate_count, candidate_count);
    //for (const candidate of candidates) {
      //for (let i = 0; i < candidates.length; ++i) {
        //ptable[candidate.id][i] = candidate.votes[i];
      //}
    //}
    //console.log(ptable);
    //let results = voting_machine_.count_votes();
    //console.log(results[0].name)

  //}
