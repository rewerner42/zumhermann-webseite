export function evaluateReleaseReadiness(state) {
  const externalReady = Boolean(
    state.domainConfigured &&
      state.identityApproved &&
      state.privacyDetailsComplete &&
      state.textsApproved &&
      state.externalReviewApproved,
  );

  return {
    externalReady,
    publicReady: Boolean(
      externalReady && state.appProductionAuditComplete && state.publicReleaseApproved,
    ),
  };
}
