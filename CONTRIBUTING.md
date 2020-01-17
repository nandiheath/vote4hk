# How to Contribute

## Branch Organization

Fork the repo and create seperate branch with proper directory (`feat/` for features, `fix/` for bug fixes). Create a PR with template and wait for review and merge.

Code that lands in master must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of master at any time.

## Styling

To maintain readability and consistency, please follow the styles below:

- functional components for all react components
- react hook as state management
- react-i18n-next for localization
- styled components for all styling
- atomic design for component organization
- material-ui for UI/UX
