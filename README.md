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
| Add lab member form | GET | /user/new | Y
| Add lab member | POST | /user/:userid | Y
| Remove lab member | DELETE | /user/:userid | Y
| Update lab member details form | GET | /user/:userid/edit |
| Update user details | PUT/PATCH | /user/:userid |
| | | |
| Useful links | GET | /links |
| About page | GET | /about |

Upcoming features

- [ ] Search by skills
- [ ] Access level-based functionality
- [ ] Direct messaging

Write comments, especially the dynamic db query

## Access restrictions (in production)
- Non-lab members can't edit other lab details at any level.
- Only PIs are allowed to delete their own lab
- Only PIs and Managers are allowed to "remove" a lab member up to their level.
- Only PIs and Managers are allowed to "add" a new lab member
- Only PIs and Managers are allowed to update a lab member's role up to manager.
- Only a user can update their own skill list
- Guests do not have any edit access. Only browse (and maybe message).


# Bugs
1. Deployment issues. Will not load the page. Probably routing problem.
2. Still dont understand how HTTP methods work. What is a "resource" and why post is different from put / patch?
3. Couldn't get put/patch working. using post for now



