## Change Log

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

