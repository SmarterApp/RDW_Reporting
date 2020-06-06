## Change Log

#### 2.4.0 -

Work done as part of RDW Phase 6.

* Alternate Score Aggregate Report (Phase 6, Req. 4)
    * Add support for alt score aggregate queries
* Add UI Colors to RDW Palette (Phase 6, Req. 2)
    * Integrate updated UI kit which defines new colors
* TechDebt
    * Upgrade gradle, including plugins
    * Upgrade SpringFramework and other libraries (most recent minor revs only, no major upgrades)

#### 2.3.3 - 2020-02-19

* Fix translation provider cache to handle edge-case where file locations change
* Screen reader fixes

#### 2.3.2 - 2020-02-04

* Fix accessibility issues in tenant admin pages

#### 2.3.1 - 2019-12-02

* Update SVG icons

#### 2.3.0 - 2019-11-13

* Fix Okta-related bugs
* Fix minor UI bugs

#### 2.2.0 - 2019-10-15

* RP-726 Show summary metrics about each tenant in UI (Part 2)
* RP-803 CERS User Group Upload Failing 
* RP-753 Tenant/Sandbox Updates - Crash TRT migrations in Instance
* RP-826 Institution name containing commas causes problems

#### 2.1.0 - 2019-09-18

* RP-688: Sandbox landing page does not localize when sandbox selected
* RP-726: Show summary metrics about each tenant in UI
* RP-749: Show each tenant's creation time, updated time, and updated by in tenant dashboard
* RP-759: School field displayed off-center (too high) on schools page
* RP-763: SAML timeout/redirect loop
* RP-777: Cancel button on edit page fails to return user to tenant/sandbox dashboard
* RP-795: Unable to save changes to CA tenant in Stage/Production
* RP-752: Localization settings not documented
* RP-760: Unable to update the welcome banner
* RP-761: Implement admin guide feedback provided by Smarter

#### 2.0.0 - 2019-08-27

NOTE: this release was originally 1.4.0 but was re-labelled just before release. So there are artifacts labelled 1.4.0-RC# which are precursors to the 2.0.0-RELEASE.

* Make all application multi-tenant aware. Please refer to detailed upgrade instructions for more details
    * Changes the configuration properties ... a lot.
* Add tenant administration UI.    
* Ingest pipeline administration.
* Remove stale report cleanup task.
* Many changes to configuration locations in en.json:
    * aggregate-report-form.field.* -> common.student-field.*
    * common.filters.student.* -> common.student-field.*
    * common.aggregate-report-type.*
    * report-download.orders.*
    * reports.report-type.*
* Hundreds of minor functionality changes and bug fixes. Most are not listed but here are some:             
    * Handle multiple tenancy chains in a single string
    * Configurable logout URL
    * Add option to disable tenant/sandbox admin UI
    * Improve exam-target-score query (RP-721)
    * Handle null vs. 0 std-err (RP-633) (RDW-105)
    * Modify ISR to deal with null standard error (RP-596) (RDW-98)
    * Fix group delete in non-sandbox (RP-603) (RDW-102)
    * Disable group delete in sandbox
    * Fix non-sandbox user session interfering with sandbox role repository (RP-609) (SBAC-875)
    * Fix IAB aggregate report bug (RDW-101)
    * Add lazy loading for less commonly used UI pages/components
    * Fix target report issue when exams are missing scores (RP-586) (RDW-96)
    * Accessibility changes (RP-479 and others)
    * Make status column consistent (RP-570)
    * Fix duplicate subgroup display (RP-561)
    * Fix race condition in aggregate report loading
    * Improve IAB card ordering (RP-435)
    * Fix grouping for subject assessments with no standard cutoff
    * Add verbiage for longitudinal school year info pop-up (RP-554)
    * Fix left nav behavior on aggregate reporting page
    * Fix subgroups in target report (RP-536)
    * Fix sandbox user session refresh behavior (RP-547)

#### 1.4.0-UAT 2019-04-12

This is a special pre-release build for Smarter Balanced ELPAC UAT.

* Add saved queries
* Add toggle for empty aggregate report rows
* Add ability to hide student filters for teachers or for all users
    * The reporting.english-learners configuration is now replaced by reporting.student-filters
    
#### 1.3.1 - 2019-03-28

* Extract both answer key parts for EBSR items (reporting-service).
* Increase timeout for district export from 2m to 10m (report-processor).

#### 1.3.0 - 2019-02-05

* Fix issue with claim levels in the ISR (PDF report).
* Change aggregate report table to scroll instead of paging.
* Fix issue with responsive menu in app header.
* Honor school-year discriminator for accommodation text.
* Add language as a filter and subgroup for reports.
* Honor target report flag for subject summative assessments.
* Change aesthetics of writing trait score breakdown.
* Change administrator tools aesthetics in landing page.
    * home.admin-tools.titles.{analyze,manage} replaced with home.admin-tools.titles.administrator-tools.
* Upgraded node modules (Angular 5 to Angular 7, RxJs 5 to 6)

#### 1.2.4 - 2018-11-19

* Tweak organization selector in District/School Export screen to support more schools.

#### 1.2.3 - 2018-10-01

* Fix order of claims on ICA/Summative reports.

#### 1.2.2 - 2018-08-01

* Address bug with schools not appearing in District/School Export screen.

#### 1.2.1 - 2018-07-06

* Configurable Subjects.
* Improve handling of optional fields.

#### 1.2.0 - 2018-06-23

* Extend Custom Aggregate Reports to include IABs.
* Longitudinal Reports.
* Student Response Reports.
* Teacher-Created Groups
* English Language Acquisition Status
* Improved architecture:
    * Web application no longer requires reporting service to be running for basic functionality
    * Organizes system level configuration more logically
    * NOTE: this requires updating configuration and container spec files for each module

#### 1.1.4 - 2018-04-06

* Tweak organization search to be scrollable so all matches may be viewed.
* Change SAML integration to use "mail" instead of "NameID".

#### 1.1.3 - 2018-03-26

* Remove individual student economic disadvantage from UI and reports (DWR-1633).
* Re-enable Google analytics.
* Disable browser auto-complete on search fields (DWR-1590).
* Improve performance and memory usage in aggregate service.

#### 1.1.2 - 2018-03-07

* Fix leaking connections to S3 when retrieving V1.0 PDF reports.
* Allow for disabling summative assessments in aggregate reporting.
* Subject "All" not displaying in print dialog (DWR-1546).
* Aggregate report column order reset when all/group toggle selected (DWR-1547).
* Improve sorting of empty rows in aggregate reports (DWR-1548).
* Districts and Schools with same name get visually merged in aggregate reports (DWR-1540).
* Console error for missing WER items (DWR-1551).
* Misleading stack traces in error log (DWR-1541).
* Misleading error for MC/MS items, "The Rubric and Exemplar are not available" (DWR-1550).
* Remove District/School export button from student history page (DWR-1528).
* Change printed student report for ICA to better fit on one page (DWR-1414).

#### 1.1.1 - 2018-03-01

* Add app-level flag to disable Percentiles feature in UI (DWR-1535).
* Fix title of printing modal for student reports (DWR-1534).
* Restore Distractor Analysis coloring of correct answers (DWR-1529).
* Restore the Overall/Claim toggle button when viewing student results (DWR-1521).
* Fix individual embargo handling (DWR-1520).
* Fix missing label text in a couple places (DWR-1519).

#### 1.1.0 - 2018-02-27

* Custom Aggregate Reporting.
* Norms, aka Percentiles.
* Embargo.
* Distractor Analysis.
* Writing Trait Scores.
* Digital Library Advanced Links.
* District/School Export.
* Improve architecture:
    * Consolidate UI into a single web app (i.e. get rid of admin webapp).
    * Separate UI from back-end services using zuul and jwt.
    * Refactor back-end services to isolate responsibilities.
    * NOTE: all this requires changes to deployment specs and config
* Enhance test item data.
* Change datasource URL configuration.
    * NOTE: this requires updating configuration files for services.    

#### 1.0.2 (Admin) - 2017-12-05

* Make student group upload processing more tolerant of various line endings.

#### 1.0.4 - 2017-10-17

* Use assessment grade when filtering results for printed student reports (DWR-1101).
* Fix display of grade and school year in printed student reports.

#### 1.0.3 / 1.0.1 (Admin) - 2017-10-04
The main Reporting webapp and the Admin webapp were versioned separately for this release.
Reporting was v1.0.3 while Admin was v1.0.1. 

* Fix to handle large SAML response payloads (DWR-1052).
* Enable redis for session caching in Admin webapp (DWR-1025).

#### 1.0.2 - 2017-09-15

* Update landing/home page links and text (DWR-1000, DWR-1001, DWR-1020).
* Adjust IRiS frame for fix to WER item response (IRiS v3.2.1, DWR-664).

#### 1.0.1 - 2017-09-06

* Update landing page links and text.

#### 1.0.0 - 2017-09-04

* Initial release.

