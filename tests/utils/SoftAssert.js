class SoftAssert {
  constructor() {
    this.errors = [];
  }

  async expect(promise, message) {
    try {
      await promise;
    } catch (error) {
      this.errors.push(message ? `${message}: ${error.message}` : error.message);
    }
  }

  assertAll() {
    if (this.errors.length > 0) {
      throw new Error('Soft assertion failures:\n' + this.errors.join('\n'));
    }
  }
}

module.exports = SoftAssert; 