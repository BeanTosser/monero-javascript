const BigIntegerCompare = function(bigint1, bigint2){
  if(bigint1 === bigint2) return 0;
  if(bigint1 > bigint2) return 1;
  return -1;
}

module.exports = BigIntegerCompare;
