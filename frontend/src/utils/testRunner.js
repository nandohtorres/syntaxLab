const ASSERTION_ERROR_PREFIX = 'AssertionError: '

export async function runTestsAgainstUserCode(pyodide, userCode, testAssertions) {
  // Run the user's code first to catch syntax errors and runtime errors early
  try {
    await pyodide.runPythonAsync(userCode)
  } catch (userCodeError) {
    return {
      passed: false,
      results: [],
      runtimeError: userCodeError.message,
    }
  }

  // Run each test assertion individually to give per-test feedback
  const testResults = []

  for (const testAssertion of testAssertions) {
    const combinedCode = `${userCode}\n${testAssertion}`

    try {
      await pyodide.runPythonAsync(combinedCode)
      testResults.push({
        assertion: testAssertion,
        passed: true,
        message: 'Passed',
      })
    } catch (assertionError) {
      const readableErrorMessage = extractReadableErrorMessage(assertionError.message)
      testResults.push({
        assertion: testAssertion,
        passed: false,
        message: readableErrorMessage,
      })
    }
  }

  const allTestsPassed = testResults.every(result => result.passed)

  return {
    passed: allTestsPassed,
    results: testResults,
    runtimeError: null,
  }
}

function extractReadableErrorMessage(rawErrorMessage) {
  const assertionErrorIndex = rawErrorMessage.indexOf(ASSERTION_ERROR_PREFIX)

  if (assertionErrorIndex !== -1) {
    return rawErrorMessage.slice(assertionErrorIndex + ASSERTION_ERROR_PREFIX.length)
  }

  return rawErrorMessage
}
