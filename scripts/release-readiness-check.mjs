import { evaluateReleaseReadiness } from '../src/config/release-readiness.js';

const completeExternalState = {
  domainConfigured: true,
  identityApproved: true,
  privacyDetailsComplete: true,
  textsApproved: true,
  externalReviewApproved: true,
  appProductionAuditComplete: false,
  publicReleaseApproved: false,
};

const cases = [
  {
    name: 'unapproved external site stays draft and non-public',
    input: { ...completeExternalState, externalReviewApproved: false },
    expected: { externalReady: false, publicReady: false },
  },
  {
    name: 'approved prelaunch site may exist but stays non-public before app audit',
    input: completeExternalState,
    expected: { externalReady: true, publicReady: false },
  },
  {
    name: 'completed app audit does not enable indexing without public approval',
    input: { ...completeExternalState, appProductionAuditComplete: true },
    expected: { externalReady: true, publicReady: false },
  },
  {
    name: 'all approvals enable public readiness',
    input: {
      ...completeExternalState,
      appProductionAuditComplete: true,
      publicReleaseApproved: true,
    },
    expected: { externalReady: true, publicReady: true },
  },
];

for (const testCase of cases) {
  const actual = evaluateReleaseReadiness(testCase.input);
  if (JSON.stringify(actual) !== JSON.stringify(testCase.expected)) {
    throw new Error(
      `${testCase.name}: expected ${JSON.stringify(testCase.expected)}, got ${JSON.stringify(actual)}`,
    );
  }
}

console.log(`Release-Statusprüfung bestanden: ${cases.length} Zustände geprüft.`);
