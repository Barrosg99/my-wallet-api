class BasicValidation {
  validate(record) {
    return record.transaction > 0;
  }
}

class PremiumValidation {
  validate(record) {
    return record.transaction > 1000;
  }
}

module.exports = { BasicValidation, PremiumValidation };
