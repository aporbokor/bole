function place_candidates(candidates_ = candidates) {
  // Places the candidates in a circle
  let mid_point = createVector(width / 2, height / 2);
  let up_vector = createVector(height / 2, 0);

  const rotation_amount = TWO_PI / candidates_.length;

  for (let i = 0; i < candidates_.length; i++) {
    let place_vector = p5.Vector.add(mid_point, up_vector);
    candidates_[i].x = place_vector.x;
    candidates_[i].y = place_vector.y;

    up_vector.rotate(rotation_amount);
  }
  change_in_sim = true;
}

function place_voters_with_opinion_brute_force(
  voter_count,
  opinion_list,
  candidates_in_opinion_list = candidates,
  is_tactical = false,
  step_size = 1
) {
  // Places votercount amount of voters onto the canvas in such a way, that their opinions matches the given opinion
  // Only works if the votercount is not at its maximum

  add_voter_to_position(0, 0);

  let added_voter = voters[voters.length - 1];
  voters[voters.length - 1].tactical = is_tactical;

  while (
    !same_opinion(
      added_voter.honest_preference(candidates_in_opinion_list),
      opinion_list
    )
  ) {
    if (added_voter.x >= width) {
      added_voter.y += step_size;
      added_voter.x = 0;
      continue;
    }
    added_voter.x += step_size;

    if (added_voter.y >= height) {
      console.log("No possible place to place these voters");
      return;
    }
  }

  for (let i = 0; i < voter_count - 1; i++) {
    add_voter_to_position(added_voter.x, added_voter.y);
    voters[voters.length - 1].tactical = is_tactical;
  }
  change_in_sim = true;
}

function getNamedcandidates() {
  // Convenience method. Creates an object with 4 attributes corresponding to the first 4 candidates.
  // I wanted to make it easier to specify an opinion in the place_voters_with_opinion_brute_force() function
  return {
    A: candidates[0],
    B: candidates[1],
    C: candidates[2],
    D: candidates[3],
  };
}
