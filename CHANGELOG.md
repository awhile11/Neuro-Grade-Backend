# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- `generate_test` API endpoint in `tests_api/views.py` to generate AI questions using Hugging Face.
- Frontend JS functionality in `teacher-practice-service.js` to fetch and display tests for teachers.
- LocalStorage support for saving temporary questions state in the frontend.
- Functions to search, display, and view test details in the frontend.
- Firebase integration for saving tests.

### Fixed
- Corrected URL paths to match Django app name (`tests_api`) instead of `/api/`.
- Removed token/authorization requirement for `generate_test` endpoint (`AllowAny` permission added).
- CORS enabled to allow requests from `localhost:5500`.
- Fixed `permission_classes` import in `views.py` to avoid `NameError`.
- Ensured JS fetch URLs match backend endpoints (`http://127.0.0.1:8000/tests_api/generate-test/`).
- Fixed sidebar toggle, AI modal open/close, and question editing functionality.
- Updated tests display to handle no tests or search results.

### Removed
- Previous placeholder `/api/` prefix in JS and Django URLs.
- Any unused auth headers or token checks in frontend requests.

### Notes
- Backend is running on Django 5.2.7.
- Frontend served on `localhost:5500`.
- AI question generation requires a Hugging Face API key set in `.env`.

