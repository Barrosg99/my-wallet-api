class StrategyValidator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  validate(transaction) {
    return this.strategy.validate(transaction);
  }
}

module.exports = { StrategyValidator };
