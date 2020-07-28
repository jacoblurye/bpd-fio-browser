const strictTokenize = { tokenize: "strict" };
const vbarTokenize = { encode: false, tokenize: (v) => v.split("|") };

module.exports = {
  cache: 1000,
  doc: {
    id: "fcNum",
    field: {
      narrative: strictTokenize,
      contactOfficerName: strictTokenize,
      supervisorName: strictTokenize,
      zip: strictTokenize,
      basis: strictTokenize,
      fcInvolvedFriskOrSearch: strictTokenize,
      year: strictTokenize,

      includedGenders: vbarTokenize,
      includedRaces: vbarTokenize,
      includedEthnicities: vbarTokenize,
    },
  },
};
