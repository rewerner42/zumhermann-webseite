export interface ReleaseReadinessInput {
  domainConfigured: boolean;
  identityApproved: boolean;
  privacyDetailsComplete: boolean;
  textsApproved: boolean;
  externalReviewApproved: boolean;
  appProductionAuditComplete: boolean;
  publicReleaseApproved: boolean;
}

export interface ReleaseReadinessResult {
  externalReady: boolean;
  publicReady: boolean;
}

export function evaluateReleaseReadiness(
  state: ReleaseReadinessInput,
): ReleaseReadinessResult;
