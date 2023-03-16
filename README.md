# Lab Tech Finder v1.0
### Social app to find a lab technician with a specific skill-set.
Version 1.0 is made within 3 days as General Assembly project.

Hosted at Render.
[Use it here](https://lab-tech-finder.onrender.com/)


# Features

### Daily News
Implemented [Axios](https://axios-http.com/) client to use the [newsdata](https://newsdata.io/) API. It's not perfect, though, as the API unable to capture pictures and articles reliable at times. For example, it can't capture both the picture and article from sciencealert.

The news are locked to Australia and *Science* category. Unfortunately the more *scientific* news sources tend to have poor image resolution.

The key is hardcoded with a maximum of 200 requests a day. So far I have not hit that number, even during development, so I have no idea what will happen when it does.

---

### Standard Convention CRUD features
Create, Read, Update and Delete entries from a database. For this project, postgreSQL is used.

---

### One truth to rule them all
The database relies on laboratory id as a common denominator for all tables. This ensures appropriate labeling on all the CRUD proceses.

---

### Dynamic Search feature
All searches are case insensitive. It will detect search based on partial entries.

e.g. prot => proteomics

You can use multiple search term and it will detect also it automatically

e.g. prot gen => proteomics and genome

***All roads lead to Rome***

You have the options to search using different types of queries. For example to find a particular lab, you can search for it using either the laboratory name or Principal Investigator's name (PI).

---

### Clean and SAFE

The dynamic search feature above is only possible due to the dynamic query string constructor.

Both the string constructor and the parameters are constructed based on how long segmented search terms are. They are then sanitised when passed into the database.

The app also uses [bcrypt](https://www.npmjs.com/package/bcrypt) to encrypt your password. I definitely do not know that your password is *1234*

---

### Confirmation and Checks
- When deleting entries in database, you will be required to tick a box. Know the risk!
- When adding or creating password, you will not be able to continue if the password does not match the confirmation field.

---

# Database

![schema](./artefacts/Lab%20Tech%20Finder.png)
Note: So far, projects and field tables are not available yet.

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
| Edit lab details form | GET | /lab/:labid/edit | Y
| Edit lab details | PUT/PATCH | /lab/:labid | Y
| | | |
| Search lab member form | GET | /user | Y
| Search lab member | POST | /user_search | Y
| User details | GET | /user/:userid | Y
| Add lab member form | GET | /user/new | Y
| Add lab member | POST | /user/:userid | Y
| Remove lab member | DELETE | /user/:userid | Y
| Update lab member details form | GET | /user/:userid/edit | Y
| Update user details | PUT/PATCH | /user/:userid | Y
| | | |
| Log in form | GET | /session/login | Y
| Log in | POST | /session | Y
| Log out | DELETE | /session | Y
| | | |
| Useful links | GET | /links |
| About page | GET | /about |

Note: more details in artefacts.

---

## Upcoming features
- [x] Search by skills
- [ ] Access level-based functionality
- [ ] Direct messaging
- [ ] 1 account per e-mail limit
- [ ] Image cloud hosting at cloudinary
- [ ] Advanced search feature



## Access restrictions (in production)
- Non-lab members can't edit other lab details at any level.
- Only PIs are allowed to delete their own lab
- Only PIs and Managers are allowed to "remove" a lab member up to their level.
- Only PIs and Managers are allowed to "add" a new lab member
- Only PIs and Managers are allowed to update a lab member's role up to manager.
- Only a user can update their own skill list
- Guests do not have any edit access. Only browse (and maybe message).

---

## Not real people
**Disclaimer**: Photos are randomly generated from [This-Person-Does-Not-Exist](https://this-person-does-not-exist.com/en), an AI generated portrait generator. The names are also from various random names generator.

There are some sample pictures in the public directory. Use them whenever appropriate.

## Bugs
<!-- 1. Deployment issues. Load the page but got error message. -->
2. Still dont understand how HTTP methods work. What is a "resource" and why post is different from put / patch?
<!-- 4. Adding new lab member causes a bug where the picture not loaded properly. Exiting the page and reentering works, though. Currently redirecting to lab page to circumvent this problem. -->
<!-- 5. Need to make footer at least positioned at 100vh. -->

## To Do List (For Later)
- [x] Login Sessions
- [ ] UI Fixes
- [ ] Write more comments, especially the dynamic db query.
- [ ] Add useful links.
- [ ] Add the Abouts page with the content of this documentation.
- [ ] Remove commented out codes