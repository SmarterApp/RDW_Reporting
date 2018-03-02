## Change Log

#### 1.1.1 - 2018-03-01

* Restore the Overall/Claim toggle button when viewing student results.
* Fix individual embargo handling.
* Fix missing label text in a couple places.

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

