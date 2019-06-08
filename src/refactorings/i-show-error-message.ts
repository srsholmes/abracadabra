export { ShowErrorMessage, ErrorReason };

type ShowErrorMessage = (reason: ErrorReason) => Promise<void>;

enum ErrorReason {
  DidNotFoundExtractableCode,
  DidNotFoundInlinableCode,
  DidNotFoundInlinableCodeIdentifiers
}
