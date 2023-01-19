function repeat_test(test, test_amount) {
  successful = 0;
  for (let i = 0; i < test_amount; i++) {
    let val = test();
    // console.log(val);
    successful += val;
  }

  return successful;
}

function repeat_tests(
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

    let res_val = repeat_test(test, tests_per_case);

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

        entry.data = repeat_tests(
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

function IIA_test(voter_count, voting_system, starter_candidate_count) {
  first_results = run_vote(voter_count, voting_system, starter_candidate_count);
  first_winners = first_results[0];

  add_candidate();
  new_cand = candidates[candidates.length - 1];
  new_machine = new voting_system(candidates);
  new_machine.prepare_for_voting();

  for (const voter of voters) {
    new_machine.register_vote(voter);
  }
  new_results = new_machine.count_votes();
  new_winners = new_results[0];

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

function tie_test(voter_count, voting_system, candidate_count) {
  results = run_vote(voter_count, voting_system, candidate_count);
  winners = results[0];

  if (winners.length > 1) {
    return true;
  }
  return false;
}

function best_winner_to_avg_voter_test(
  voter_count,
  voting_system,
  candidate_count
) {
  winners = run_vote(voter_count, voting_system, candidate_count)[0];

  const should_win = average_voter.honest_preference(candidates)[0];

  for (const cand of winners) {
    if (should_win.id == cand.id) {
      return true;
    }
  }
  return false;
}
