class CopelandVoter extends CondorcetVotingMethod{

  calc_copeland_matrix(){
    this.copeland_matrix = twoDMatrixWithZeros(this.candidates.length,this.candidates.length);

    for (let i = 0; i < this.candidates.length; i++){
      for (let j = 0; j < this.candidates.length; j++){
        let curr = this.relative_strength_matrix[i][j];

        if ((curr == null) || (curr < 0)){
          this.copeland_matrix[i][j] = 0;
        } else if (curr == 0){
          this.copeland_matrix[i][j] = 0.5;
        } else {
          this.copeland_matrix[i][j] = 1;
        }
      }

      this.candidates[i].copeland_score = sum(this.copeland_matrix[i]);
    }
  }

  count_votes(){
    this.calc_relative_strength_matrix();
    console.log(this.outranking_matrix);
    console.log(this.relative_strength_matrix);
    this.calc_copeland_matrix();
    console.log(this.copeland_matrix);
    return count_votes_for_ints(this.candidates, function(can){
      return can.copeland_score;
    })
  }
}
