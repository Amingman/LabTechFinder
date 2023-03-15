# Lab Tech Finder
### social app to find a lab technician with a specific skill-set
[Use it here](https://lab-tech-finder.onrender.com/)


Problem with controllers


Search feature
search is canse insensitive. It will also detect search based on partial entries. e.g. prot => proteomics
You can use multiple search term and it will detect it automatically e.g. prot gen => proteomics and genome


## Routes
| Items | Method | Route | Done? |
| ----------- | ----------- | ----------- | ----------- |
| Home | GET | / | Y
| Browse lab form | GET | /lab | Y
| Browse lab | POST | /lab_search | Y
| Lab details | GET | /lab/:labid | Y
| Add lab form | GET | /lab/new | Y
| Add lab | POST | /lab/:labid | Y
| Delete lab | Delete | /lab/:labid | Y
| Edit lab details form | GET | /lab/:labid/edit |
| Edit lab details | PUT/PATCH | /lab/:labid |
| | | |
| Search lab member form | GET | /user | Y
| Search lab member | POST | /user_search | Y
| User details | GET | /user/:userid | Y
| Add lab member form | GET | /user/new |
| Add lab member | POST | /user/:userid |
| Remove lab member | DELETE | /user/:userid |
| Update lab member details form | GET | /user/:userid/edit |
| Update user details | PUT/PATCH | /user/:userid |



Write comments, especially the dynamic db query


# Bugs
1. Deployment issues. Will not load the page. Probably routing problem.
2. News without author = null. Return error reading null


